import asyncio
import json

from fastapi import FastAPI, HTTPException, BackgroundTasks, Depends
from auth import get_current_user, get_optional_user
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from job_store import create_job, update_job, get_job, JobStatus
from graph_orchestrator import run
import event_bus

import os
from supabase_client import get_supabase

app = FastAPI(title="MASS API", description="Multi-Agent Startup Simulator")

# CORS — reads allowed origins from ALLOWED_ORIGINS env var
allowed_origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SimulateRequest(BaseModel):
    idea: str
    target_audience: str = ""
    market: str = ""
    revenue_model: str = ""
    constraints: str = ""
    tier: str = "free"


class ClarifyRequest(BaseModel):
    idea: str
    tier: str = "free"

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    tier: str = "free"
    messages: list[ChatMessage]


def run_simulation(job_id: str, req: SimulateRequest, user_id: str):
    try:
        update_job(job_id, status=JobStatus.RUNNING)

        context = {
            "target_audience": req.target_audience,
            "market": req.market,
            "revenue_model": req.revenue_model,
            "constraints": req.constraints
        }

        final_state = run(req.idea, context, job_id=job_id, user_id=user_id, tier=req.tier)

        result = {
            "final_report": final_state.get("final_report", ""),
            "business_plan": final_state.get("business_plan", {}),
            "conflicts": final_state.get("conflicts", []),
            "debate_rounds": final_state.get("iteration", 0),
            "messages_count": len(final_state.get("messages", []))
        }

        update_job(job_id, status=JobStatus.DONE, result=result)

    except Exception as e:
        event_bus.publish(job_id, {"type": "job_error", "error": str(e)})
        update_job(job_id, status=JobStatus.ERROR, error=str(e))
    finally:
        # Give SSE a moment to flush the last event, then clean up
        import time
        time.sleep(1)
        event_bus.cleanup(job_id)


@app.get("/")
def root():
    return {"status": "MASS API running", "docs": "/docs"}


@app.post("/simulate")
def simulate(req: SimulateRequest, background_tasks: BackgroundTasks, user_id: str | None = Depends(get_optional_user)):
    job_id = create_job()
    background_tasks.add_task(run_simulation, job_id, req, user_id)
    return {"job_id": job_id, "status": "pending"}


@app.post("/clarify")
def clarify_idea(req: ClarifyRequest):
    from agents.llm_router import get_llm_model
    from groq import Groq
    import os
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    prompt = f"""
You are an expert startup consultant. A founder has given you this raw startup idea:
"{req.idea}"

Before simulating the business, you need to clarify their target market, constraints, and business model.
Generate exactly 3 multiple-choice questions to ask the founder.
Each question must have 3-4 distinct options.

Respond ONLY in valid JSON format exactly like this:
{{
  "questions": [
    {{
      "question": "What is your target market?",
      "options": ["Global (Default to USD)", "India (Default to INR)", "US Only", "Europe"]
    }},
    {{
      "question": "What is your funding constraint?",
      "options": ["Bootstrapped (Zero external capital)", "Pre-Seed (Seeking angel funding)", "Venture Backed (Aiming for Series A)"]
    }}
  ]
}}
    """
    try:
        response = client.chat.completions.create(
            model=get_llm_model(req.tier),
            response_format={"type": "json_object"},
            messages=[{"role": "user", "content": prompt}]
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"Error in /clarify: {e}")
        # Fallback questions if LLM fails
        return {
            "questions": [
                {
                    "question": "What is your primary market?",
                    "options": ["Global", "India", "United States", "Europe"]
                },
                {
                    "question": "What is your funding situation?",
                    "options": ["Bootstrapped", "Venture Backed"]
                },
                {
                    "question": "What is the primary revenue model?",
                    "options": ["B2B SaaS", "B2C Subscription", "Marketplace / Commission", "One-time Purchase"]
                }
            ]
        }


@app.get("/simulate/{job_id}")
def get_simulation(job_id: str):
    job = get_job(job_id)

    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")

    response = {"job_id": job_id, "status": job["status"]}

    if job["status"] == JobStatus.DONE:
        response["result"] = job["result"]
    elif job["status"] == JobStatus.ERROR:
        response["error"] = job["error"]

    return response


@app.post("/simulate/{job_id}/chat")
def chat_with_council(job_id: str, req: ChatRequest):
    from agents.llm_router import get_llm_model
    from groq import Groq
    import os

    job = get_job(job_id)
    if job is None or job["status"] != JobStatus.DONE:
        raise HTTPException(status_code=400, detail="Job not found or not done")

    final_report = job.get("result", {}).get("final_report", "")
    
    system_prompt = f"""
You are the MASS Startup Council. You just created this business plan for the founder:

{final_report}

If the founder asks a general question, answer as the Supervisor.
If the founder addresses a specific agent (e.g. "@Finance" or "Hey CEO"), answer from their exact persona.
Keep your answer concise, brutally honest, and specific to their business constraints.
"""

    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    
    formatted_messages = [{"role": "system", "content": system_prompt}]
    for m in req.messages:
        formatted_messages.append({"role": m.role, "content": m.content})
        
    try:
        response = client.chat.completions.create(
            model=get_llm_model(req.tier),
            messages=formatted_messages
        )
        return {"reply": response.choices[0].message.content}
    except Exception as e:
        print(f"Error in chat: {e}")
        raise HTTPException(status_code=500, detail="Failed to get chat response")


@app.get("/simulate/{job_id}/stream")
async def stream_simulation(job_id: str):
    """
    SSE endpoint — streams real-time agent activity events.

    Event format:  data: {"type": "agent_start", "agent": "CEO", ...}\n\n
    Terminal events: job_done, job_error (stream closes after these).
    """
    job = get_job(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")

    loop = asyncio.get_event_loop()
    queue = event_bus.create_channel(job_id, loop)

    async def event_generator():
        try:
            while True:
                # Wait for next event (with timeout to detect dead jobs)
                try:
                    event = await asyncio.wait_for(queue.get(), timeout=120)
                except asyncio.TimeoutError:
                    # Send keepalive comment
                    yield ": keepalive\n\n"
                    continue

                data = json.dumps(event)
                yield f"data: {data}\n\n"

                # Terminal events — close the stream
                if event.get("type") in ("job_done", "job_error"):
                    break
        except asyncio.CancelledError:
            pass

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )

@app.get("/simulations")
def list_simulations(user_id: str = Depends(get_current_user)):
    try:
        supabase = get_supabase()
        response = supabase.table("simulations").select("id, job_id, idea, created_at").eq("user_id", user_id).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/simulations/{id}")
def get_simulation_by_id(id: str, user_id: str = Depends(get_current_user)):
    try:
        supabase = get_supabase()
        response = supabase.table("simulations").select("*").eq("id", id).eq("user_id", user_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Simulation not found")
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))