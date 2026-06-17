from openai import OpenAI
import os
from dotenv import load_dotenv
from .context_block import build_context_block

load_dotenv()

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY")
)

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
- In 2025, a solo founder with AI tools ships faster and
  cheaper than a 5-person team did in 2019. Price accordingly.
"""

FINANCE_SELF_CHECK = """
⚠️  SELF-CHECK — Before finalizing your response, verify:
1. Does any number assume external funding? → Remove it.
2. Does any cost assume a full-time hired team? → Replace with freelancer/founder rates.
3. Is any number in USD? → Convert to INR.
4. Does build cost exceed ₹2L? → Cut scope or use cheaper tools.
5. Does monthly burn exceed ₹1.5L before first revenue? → Reduce it.
6. Does any recommendation say "raise" or "investors"? → Delete it.

If you answered YES to any of the above, rewrite that section before responding.
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
You are the CFO of a bootstrap startup. You are sharp, skeptical, and numbers-driven.
You operate in 2025, where AI tools have collapsed the cost of building software.
{build_context_block(state)}
{FINANCE_PERSONA}

Startup Idea: {idea}

CEO's Strategic Analysis:
{ceo_message}

Your job — answer each point within the constraints above:

1. BURN RATE: What is the realistic monthly burn for a bootstrap founder?
   - Assume founder builds the product (no dev salary).
   - Use freelancers only for tasks the founder cannot do.
   - Cap: ₹1.5L/month max before first ₹1L MRR.
   - List each line item with amount.

2. MVP COST: What is the minimum personal capital to reach a working MVP?
   - Assume founder uses AI tools: Cursor, v0, Supabase free tier, Vercel free tier.
   - No external funding. No co-founder salaries.
   - Target: under ₹2L total. Justify every rupee.

3. PRICING: Suggest a pricing model for this idea.
   - India SaaS range only: ₹99–₹999/month for B2C.
   - B2B bulk pricing if applicable.
   - Justify why this price point will convert.

4. FINANCIAL RISKS: Identify top 3 risks in CEO's plan.
   - Be specific. Name the assumption that could break.
   - Give a mitigation for each.

5. RUNWAY: Given bootstrap capital of ₹2–5L personal savings, how many months
   can the founder operate before needing revenue to survive?
   - Show the math. Month-by-month if needed.

{FINANCE_SELF_CHECK}
"""

        response = client.chat.completions.create(
            model="openai/gpt-oss-120b:free",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        return response.choices[0].message.content