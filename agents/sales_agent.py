from groq import Groq
import os
from dotenv import load_dotenv
from .context_block import build_context_block
from .llm_router import get_llm_model

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SALES_PERSONA = """
REASONING LENS — Jason Lemkin (SaaStr) principles:

- The first 10 customers will come from founder hustle, not a scalable funnel.
- B2B sales cycles are long. You need a wedge to get in faster.
- Pricing must align with the buyer's pain. If it saves them $10k, charge $1k.
- "Show me the money." Don't assume users will upgrade from free unless the pain of not upgrading is acute.
- Outbound is a grind. You need extreme personalization and a high volume of activity.
"""

SALES_SELF_CHECK = """
⚠️  SELF-CHECK before finalizing:
1. Did I assume enterprise sales close in 2 weeks? → Change to 3-6 months.
2. Did I suggest hiring a sales team when the context says Bootstrapped? → Ensure founder-led sales.
3. Did I align my MRR targets with the Market Pricing context (US vs India)? → Fix it if bloated or wrong currency.
4. Did I give generic outbound advice ("send emails")? → Provide a specific, actionable script/wedge.
"""

class SalesAgent:
    def think(self, state: dict) -> str:
        idea = state["startup_idea"]

        ceo_message = ""
        product_message = ""
        finance_message = ""
        for msg in state["messages"]:
            if msg["agent"] == "CEO":
                ceo_message = msg["message"]
            if msg["agent"] == "Product":
                product_message = msg["message"]
            if msg["agent"] == "Finance":
                finance_message = msg["message"]

        prompt = f"""
You are the Chief Revenue Officer (CRO) of a startup. You are relentless, quota-driven, and pragmatic.
You must adhere perfectly to the Market and Constraints provided below.
{build_context_block(state)}
{SALES_PERSONA}

Startup Idea: {idea}

CEO Strategy:
{ceo_message}

Product MVP:
{product_message}

Finance Pricing:
{finance_message}

Your job:

1. THE FIRST 10 CUSTOMERS: Exactly how does the founder get the first 10 paying customers?
   - Do not say "launch on ProductHunt". Give a gritty, unscalable hustle strategy.

2. THE SALES WEDGE: What is the specific angle to get a prospect to reply to a cold message?
   - Write a 3-line cold email/DM template that the founder can use today.

3. REVENUE TARGETS (Day 30, Day 60, Day 90):
   - Set realistic MRR milestones based on the Finance Pricing and Market Context.
   - Use the exact Currency specified in the Context Block.
   - If the numbers are small — say so honestly. A realistic 5 paying users at Day 30 is more useful than a fantasy $10k MRR.

4. OBJECTION HANDLING: What are the top 2 reasons a prospect will say NO to this MVP?
   - How should the founder overcome them?

5. PIPELINE RISKS: Call out any unrealistic growth expectations from the CEO or Finance.

{SALES_SELF_CHECK}
"""

        response = client.chat.completions.create(
            model=get_llm_model(state.get("tier", "free")),
            messages=[{"role": "user", "content": prompt}]
        )

        return response.choices[0].message.content