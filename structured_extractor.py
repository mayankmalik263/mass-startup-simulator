from openai import OpenAI
import os
import json
from dotenv import load_dotenv
from pydantic import ValidationError, BaseModel
from typing import get_args, get_origin, List, Union, Any
from models import StartupBusinessPlan

load_dotenv()

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY")
)


def generate_json_template(model: type[BaseModel]) -> dict:
    template = {}
    for field_name, field_info in model.model_fields.items():
        field_type = field_info.annotation
        template[field_name] = _get_default_val_for_type(field_type)
    return template


def _get_default_val_for_type(t: Any) -> Any:
    # Check if t is a subclass of BaseModel
    if isinstance(t, type) and issubclass(t, BaseModel):
        return generate_json_template(t)
    
    origin = get_origin(t)
    args = get_args(t)
    
    if origin is list or origin is List:
        item_type = args[0] if args else str
        return [_get_default_val_for_type(item_type)]
    
    if origin is Union:
        # Filter out NoneType (for Optionals)
        non_none_args = [a for a in args if a != type(None)]
        if non_none_args:
            return _get_default_val_for_type(non_none_args[0])
        return None
        
    if t is int:
        return 0
    if t is float:
        return 0.0
    if t is bool:
        return False
    return "string"


def get_schema_hint() -> str:
    template = generate_json_template(StartupBusinessPlan)
    return json.dumps(template, indent=2)


def _call_llm(prompt: str, temperature: float = 0.0) -> str:
    response = client.chat.completions.create(
        model="openai/gpt-oss-120b:free",
        messages=[{"role": "user", "content": prompt}],
        temperature=temperature
    )
    return response.choices[0].message.content.strip()


def _strip_fences(raw: str) -> str:
    if raw.startswith("```"):
        parts = raw.split("```")
        if len(parts) > 1:
            raw = parts[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return raw.strip()


def _format_validation_error(e: ValidationError) -> str:
    errors = []
    for err in e.errors():
        loc = " -> ".join(str(x) for x in err["loc"])
        msg = err["msg"]
        input_val = err.get("input", "N/A")
        errors.append(f"- Field '{loc}': {msg} (Provided value: {input_val})")
    return "\n".join(errors)


def extract_structured_plan(report_text: str, idea: str) -> StartupBusinessPlan | None:
    schema_hint = get_schema_hint()
    prompt = f"""
Convert the following startup business plan into JSON matching EXACTLY this schema structure:

{schema_hint}

Rules:
- Output ONLY valid JSON. No markdown fences, no preamble, no explanation.
- "startup_idea" must be: {idea}
- Extract real numbers/values from the report below. Do not invent data.
- revenue_targets must include entries for day 30, 60, and 90 if present.

REPORT TO CONVERT:
{report_text}
"""

    raw = _call_llm(prompt, temperature=0.0)

    max_attempts = 3
    for attempt in range(max_attempts):
        try:
            cleaned = _strip_fences(raw)
            data = json.loads(cleaned)
            return StartupBusinessPlan.model_validate(data)
        except (json.JSONDecodeError, ValidationError) as e:
            if attempt < max_attempts - 1:
                print(f"[WARNING] Structured extraction failed (attempt {attempt + 1}/{max_attempts}):")
                if isinstance(e, json.JSONDecodeError):
                    error_details = f"Invalid JSON format: {e}"
                else:
                    error_details = _format_validation_error(e)
                print(error_details)
                print("[RETRY] Retrying with error feedback...\n")
                
                retry_prompt = f"""
Your previous JSON output was invalid or failed validation.

Validation Errors:
{error_details}

Please correct the JSON and output ONLY valid JSON matching this schema:
{schema_hint}

Remember:
- Do not output markdown fences or explanations.
- Output ONLY valid JSON.
- Ensure the fields comply with all validation requirements (e.g., no placeholders, non-empty, proper formats).

Original report:
{report_text}
"""
                raw = _call_llm(retry_prompt, temperature=0.0)
            else:
                print(f"[ERROR] Structured extraction failed after {max_attempts} attempts.")
                if isinstance(e, json.JSONDecodeError):
                    print(f"JSON Error: {e}")
                else:
                    print("Validation Errors:")
                    print(_format_validation_error(e))
                print("Skipping structured output for this run.\n")
                return None

    return None