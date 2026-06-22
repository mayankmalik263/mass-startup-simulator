from openai import OpenAI
import os
import json
from dotenv import load_dotenv
from .context_block import build_context_block
from .llm_router import get_llm_model

load_dotenv()

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY")
)

SUPERVISOR_PERSONA = """
You are the Strict Consensus Evaluator. Your ONLY job is to compare the CEO's strategy
and the Finance's budget, and output a JSON array of conflicts.
You look for bloat, unrealistic assumptions, and Context Block violations.
"""

class SupervisorAgent:
    def evaluate(self, state: dict) -> dict:
        ceo_message = ""
        finance_message = ""
        for msg in state["messages"]:
            if msg["agent"] == "CEO" and msg["round"] == state["iteration"]:
                ceo_message = msg["message"]
            if msg["agent"] == "Finance" and msg["round"] == state["iteration"]:
                finance_message = msg["message"]

        prompt = f"""
{SUPERVISOR_PERSONA}
{build_context_block(state)}

CEO's Strategy:
{ceo_message}

Finance's Budget:
{finance_message}

EVALUATION RULES:
1. Did the CEO and Finance respect the Constraints (e.g. Bootstrapped vs VC)?
2. Are the financial numbers aligned with the Market Context and requested Currency?
3. Did they hallucinate bloated costs (e.g. $50k for an MVP) instead of 2026 AI realities?

If there are violations or disagreements between CEO and Finance, set "agreed": false and list the conflicts.
If they are perfectly aligned and realistic, set "agreed": true.

Respond ONLY with valid JSON in this format:
{{
  "agreed": true/false,
  "reason": "Brief summary of why",
  "conflicts": [
    {{
      "title": "Short title of conflict",
      "description": "Detailed description of what must be fixed in the next round"
    }}
  ],
  "decisions": [
    {{
      "title": "Short title of agreement",
      "description": "Detail of what was agreed upon"
    }}
  ]
}}
"""

        try:
            response = client.chat.completions.create(
                model=get_llm_model(state.get("tier", "free")),
                response_format={"type": "json_object"},
                messages=[{"role": "user", "content": prompt}]
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            print(f"Supervisor JSON parse error: {e}")
            return {
                "agreed": True,
                "reason": "Fallback: Failed to parse supervisor output.",
                "conflicts": [],
                "decisions": []
            }