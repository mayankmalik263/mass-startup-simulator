from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from job_store import create_job, update_job, get_job, JobStatus
from graph_orchestrator import run

app = FastAPI(title="MASS API", description="Multi-Agent Startup Simulator")

# allow frontend (Next.js, etc.) to call this API later
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class SimulateRequest(BaseModel):
    idea: str
    target_audience: str = ""
    market: str = ""
    revenue_model: str = ""
    constraints: str = ""


def run_simulation(job_id: str, req: SimulateRequest):
    try:
        update_job(job_id, status=JobStatus.RUNNING)

        context = {
            "target_audience": req.target_audience,
            "market": req.market,
            "revenue_model": req.revenue_model,
            "constraints": req.constraints
        }

        final_state = run(req.idea, context)

        result = {
            "final_report": final_state.get("final_report", ""),
            "business_plan": final_state.get("business_plan", {}),
            "conflicts": final_state.get("conflicts", []),
            "debate_rounds": final_state.get("iteration", 0),
            "messages_count": len(final_state.get("messages", []))
        }

        update_job(job_id, status=JobStatus.DONE, result=result)

    except Exception as e:
        update_job(job_id, status=JobStatus.ERROR, error=str(e))


@app.get("/")
def root():
    return {"status": "MASS API running", "docs": "/docs"}


@app.post("/simulate")
def simulate(req: SimulateRequest, background_tasks: BackgroundTasks):
    job_id = create_job()
    background_tasks.add_task(run_simulation, job_id, req)
    return {"job_id": job_id, "status": "pending"}


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