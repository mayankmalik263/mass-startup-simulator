from openai import OpenAI
import os
import json
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY")
)

class SupervisorAgent:
    def evaluate(self, state: dict) -> dict:
        idea = state["startup_idea"]
        iteration = state["iteration"]
        
        # get latest CEO and Finance messages
        ceo_messages = [m for m in state["messages"] if m["agent"] == "CEO"]
        finance_messages = [m for m in state["messages"] if m["agent"] == "Finance"]
        
        latest_ceo = ceo_messages[-1]["message"] if ceo_messages else ""
        latest_finance = finance_messages[-1]["message"] if finance_messages else ""
        
        prompt = f"""
You are a neutral supervisor overseeing a startup planning debate.

Startup Idea: {idea}
Debate Round: {iteration + 1}

CEO's Latest Position:
{latest_ceo}

Finance's Latest Position:
{latest_finance}

Your job: determine if CEO and Finance have reached workable consensus.

Consensus means:
- Finance accepts the core strategy (even with reservations)
- CEO has acknowledged financial constraints
- There is no fundamental blocker preventing moving forward

Respond ONLY with valid JSON in this exact format:
{{
  "agreed": true or false,
  "reason": "one sentence explaining why",
  "conflicts": ["list of unresolved conflicts, empty if agreed"],
  "decisions": ["list of things both parties agreed on"]
}}

No text before or after the JSON.
"""
        
        response = client.chat.completions.create(
            model="openai/gpt-oss-120b:free",
            messages=[{"role": "user", "content": prompt}]
        )
        
        raw = response.choices[0].message.content.strip()
        
        # parse JSON response
        try:
            # strip markdown fences if present
            if raw.startswith("```"):
                raw = raw.split("```")[1]
                if raw.startswith("json"):
                    raw = raw[4:]
            result = json.loads(raw.strip())
        except json.JSONDecodeError:
            # if LLM doesn't return clean JSON → default to agreed
            # prevents infinite loops on bad responses
            print("⚠️ Supervisor JSON parse failed. Defaulting to agreed.")
            result = {
                "agreed": True,
                "reason": "Parse error — defaulting to consensus",
                "conflicts": [],
                "decisions": []
            }
        
        print(f"  Supervisor verdict: {'✅ AGREED' if result['agreed'] else '❌ NOT AGREED'}")
        print(f"  Reason: {result.get('reason', '')}\n")
        
        return result