from openai import OpenAI
import os
import json
from dotenv import load_dotenv
from .context_block import build_context_block

load_dotenv()

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY")
)


class SupervisorAgent:
    def evaluate(self, state: dict) -> dict:
        idea = state["startup_idea"]
        iteration = state["iteration"]
        constraints = state.get("constraints", "none")
        market = state.get("market", "not specified")

        # Get latest CEO and Finance messages
        ceo_messages = [m for m in state["messages"] if m["agent"] == "CEO"]
        finance_messages = [m for m in state["messages"] if m["agent"] == "Finance"]

        latest_ceo = ceo_messages[-1]["message"] if ceo_messages else ""
        latest_finance = finance_messages[-1]["message"] if finance_messages else ""

        # Build bootstrap/india violation checklist for supervisor
        violation_checks = []
        if "bootstrap" in constraints.lower() or "bootstrapped" in constraints.lower():
            violation_checks.append(
                "- Does either plan mention raising funding, seed round, angel investors, or SAFE notes? "
                "If yes → NOT agreed, conflict = 'funding suggestion violates bootstrap constraint'"
            )
            violation_checks.append(
                "- Does either plan suggest monthly burn over ₹1.5L before first revenue? "
                "If yes → NOT agreed, conflict = 'burn rate exceeds bootstrap ceiling'"
            )
            violation_checks.append(
                "- Does either plan suggest an MVP build cost over ₹2L? "
                "If yes → NOT agreed, conflict = 'MVP cost unrealistic for bootstrap in 2025'"
            )
            violation_checks.append(
                "- Does either plan suggest hiring a full-time team (not freelancers)? "
                "If yes → NOT agreed, conflict = 'full-time team violates bootstrap constraint'"
            )
        if "india" in market.lower():
            violation_checks.append(
                "- Does either plan use USD amounts or US-market benchmarks? "
                "If yes → NOT agreed, conflict = 'USD values used in India market plan'"
            )
            violation_checks.append(
                "- Does either plan assume free→paid conversion above 5%? "
                "If yes → NOT agreed, conflict = 'conversion rate unrealistic for Indian freemium apps'"
            )

        violation_check_text = (
            "\n".join(violation_checks)
            if violation_checks
            else "No specific violation checks for this context."
        )

        prompt = f"""
You are a strict supervisor overseeing a startup planning debate.
Your job is to catch bad plans, not just rubber-stamp them.

Startup Idea: {idea}
{build_context_block(state)}
Debate Round: {iteration + 1}

CEO's Latest Position:
{latest_ceo}

Finance's Latest Position:
{latest_finance}

STEP 1 — VIOLATION CHECK (do this first):
{violation_check_text}

STEP 2 — CONSENSUS CHECK:
Consensus requires ALL of the following to be true:
- No violations found in Step 1
- Finance explicitly accepts the burn rate and cost structure as realistic
- CEO has acknowledged the financial constraints and adjusted scope
- Both parties agree on a specific pricing model with actual numbers
- There is no fundamental blocker (unresolved assumption that could kill the plan)

"Finance accepts with reservations" is NOT consensus.
"CEO will consider the feedback" is NOT consensus.
Consensus = both parties locked on the same numbers and direction.

Respond ONLY with valid JSON in this exact format:
{{
  "agreed": true or false,
  "reason": "one specific sentence — name the exact agreement or the exact blocker",
  "conflicts": ["list each unresolved conflict with specifics, empty list only if truly agreed"],
  "decisions": ["list each thing both parties explicitly locked on with numbers"]
}}

No text before or after the JSON. No markdown fences.
"""

        response = client.chat.completions.create(
            model="openai/gpt-oss-120b:free",
            messages=[{"role": "user", "content": prompt}]
        )

        raw = response.choices[0].message.content.strip()

        # Parse JSON — strip fences if present
        try:
            if raw.startswith("```"):
                raw = raw.split("```")[1]
                if raw.startswith("json"):
                    raw = raw[4:]
            result = json.loads(raw.strip())

            # Validate expected keys exist
            assert "agreed" in result
            assert isinstance(result.get("conflicts"), list)
            assert isinstance(result.get("decisions"), list)

        except (json.JSONDecodeError, AssertionError, IndexError) as e:
            # CHANGED: parse failure → NOT agreed (safe default, not agreed)
            # Rationale: better to loop once more than to pass a bad plan through
            print(f"⚠️  Supervisor JSON parse failed ({e}). Defaulting to NOT agreed.")
            result = {
                "agreed": False,
                "reason": "Supervisor parse error — treating as unresolved to prevent bad plan passing through",
                "conflicts": ["Supervisor could not evaluate this round — retry"],
                "decisions": []
            }

        print(f"  Supervisor verdict: {'✅ AGREED' if result['agreed'] else '❌ NOT AGREED'}")
        print(f"  Reason: {result.get('reason', '')}")
        if result.get("conflicts"):
            for c in result["conflicts"]:
                print(f"    conflict: {c}")
        print()

        return result