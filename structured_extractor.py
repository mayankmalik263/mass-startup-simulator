from openai import OpenAI
import os
import json
from dotenv import load_dotenv
from pydantic import ValidationError
from models import StartupBusinessPlan

load_dotenv()

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY")
)

SCHEMA_HINT = """
{
  "startup_idea": "string",
  "mission": "string",
  "problem": "string",
  "target_customer": "string",
  "business_model": [
    {"name": "string", "price": "string", "features": ["string"]}
  ],
  "financial_snapshot": {
    "monthly_burn": "string",
    "funding_needed": "string",
    "runway": "string",
    "break_even_target": "string"
  },
  "go_to_market": ["string"],
  "product_mvp": ["string"],
  "revenue_targets": [
    {"day": 30, "mrr": "string", "notes": "string"}
  ],
  "key_conflicts": [
    {"title": "string", "description": "string"}
  ],
  "final_verdict": "string"
}
"""

def _call_llm(prompt: str) -> str:
    response = client.chat.completions.create(
        model="openai/gpt-oss-120b:free",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content.strip()


def _strip_fences(raw: str) -> str:
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return raw.strip()


def extract_structured_plan(report_text: str, idea: str) -> StartupBusinessPlan | None:
    prompt = f"""
Convert the following startup business plan into JSON matching EXACTLY this schema:

{SCHEMA_HINT}

Rules:
- Output ONLY valid JSON. No markdown fences, no preamble, no explanation.
- "startup_idea" must be: {idea}
- Extract real numbers/values from the report below. Do not invent data.
- revenue_targets must include entries for day 30, 60, and 90 if present.

REPORT TO CONVERT:
{report_text}
"""

    raw = _call_llm(prompt)

    for attempt in range(2):
        try:
            cleaned = _strip_fences(raw)
            data = json.loads(cleaned)
            return StartupBusinessPlan.model_validate(data)
        except (json.JSONDecodeError, ValidationError) as e:
            if attempt == 0:
                print(f"⚠️ Structured extraction failed (attempt 1): {e}")
                print("🔄 Retrying with error feedback...\n")
                retry_prompt = f"""
Your previous JSON output was invalid. Error: {e}

Fix it and output ONLY valid JSON matching this schema:
{SCHEMA_HINT}

Original report:
{report_text}
"""
                raw = _call_llm(retry_prompt)
            else:
                print(f"⚠️ Structured extraction failed again: {e}")
                print("Skipping structured output for this run.\n")
                return None

    return None