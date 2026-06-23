from groq import Groq
import os
from dotenv import load_dotenv
from .context_block import build_context_block
from .llm_router import get_llm_model

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

FINANCE_PERSONA = """
REASONING LENS — Naval Ravikant principles:
- Specific knowledge compounds. Generic advice decays.
- Every number is a judgment call, not a formula output.
  Ask: "what happens long-term if this assumption is wrong?"
- Favor decisions that compound: recurring revenue, owned
  distribution, repeatable low-cost processes.
- State the assumption AND what it depends on.
  Don't bury risk in vague phrasing.
- Direction over speed: a slower plan pointed at a real,
  defensible position beats a faster plan heading nowhere.
- Judgment > speed. One correct decision beats ten fast ones.
- In 2026, a solo founder with AI tools ships faster and
  cheaper than a 5-person team did in 2020. Price accordingly.
"""

FINANCE_SELF_CHECK = """
⚠️  SELF-CHECK — Before finalizing your response, verify:
1. Do my estimates perfectly align with the Currency and Constraints (Bootstrap vs VC) defined in the Context Block?
2. Did I suggest hiring a full-time team when the context says Bootstrapped? → Replace with freelancer/founder rates.
3. Are my costs bloated? (An AI wrapper shouldn't cost $50k to build). → Force realistic 2026 AI-tool costs.
4. Did I suggest raising money when the context says Bootstrapped? → Delete it.

If you violated the Context Block rules, rewrite your section before responding.
"""


class FinanceAgent:
    def think(self, state: dict) -> str:
        idea = state["startup_idea"]

        # Read CEO's output from state
        ceo_message = ""
        for msg in state["messages"]:
            if msg["agent"] == "CEO":
                ceo_message = msg["message"]
                break

        prompt = f"""
You are the CFO of a startup. You are sharp, skeptical, and numbers-driven.
You operate in 2026, where AI tools have collapsed the cost of building software.
Your financial strategy MUST perfectly align with the Constraints (Bootstrapped vs VC-backed) provided below.
{build_context_block(state)}
{FINANCE_PERSONA}

Startup Idea: {idea}

CEO's Strategic Analysis:
{ceo_message}

Your job — answer each point within the exact constraints and currency provided:

1. BURN RATE: What is the realistic monthly burn?
   - Adhere strictly to the Context Block Budget constraints.
   - List each line item with exact amounts.

2. MVP COST: What is the minimum capital to reach a working MVP?
   - Adhere strictly to the Context Block Budget constraints.
   - Target extreme efficiency using AI tools (Cursor, v0, Supabase).
   - Justify every cost.

3. PRICING: Suggest a pricing model for this idea.
   - Base it strictly on the Target Market context (India vs Global/US).
   - B2B bulk pricing if applicable.
   - Justify why this price point will convert.

4. FINANCIAL RISKS: Identify top 3 risks in CEO's plan.
   - Be specific. Name the assumption that could break.
   - Give a mitigation for each.

5. RUNWAY: Given the standard starting capital for this constraint profile, how many months of runway exist before revenue/funding runs out?
   - Show the math.

{FINANCE_SELF_CHECK}
"""

        response = client.chat.completions.create(
            model=get_llm_model(state.get("tier", "free")),
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        return response.choices[0].message.content