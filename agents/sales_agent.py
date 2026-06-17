from openai import OpenAI
import os
from dotenv import load_dotenv
from .context_block import build_context_block

load_dotenv()

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY")
)

SALES_PERSONA = """
REASONING LENS — Jason Lemkin / founder-led sales principles:

- Founder-led sales first. No sales hire until there's a repeatable, proven motion.
  The founder closes the first 10–20 customers personally.
- One sales cycle is enough data. If a channel/tactic isn't showing improvement
  within one cycle, it won't — call it and redirect immediately.
- Retention before scale. Don't plan aggressive acquisition on top of
  unproven retention. Leaky bucket kills bootstrap companies.
- 85–90% transparent projections: use realistic conversion rates and cycle times,
  not best-case numbers. If the math only works on best-case, the plan is broken.
- Revenue targets must be metric-led: tied to a specific funnel mechanism,
  not "we'll figure it out."
- B2B sales in India: procurement + IT approval + HR budget cycles = 3–6 months minimum.
  A Day-90 B2B revenue target is almost always fiction for a cold-start.
"""

SALES_SELF_CHECK = """
⚠️  SELF-CHECK before finalizing:
1. Do 30-day revenue targets assume more than 50 paying users from zero audience? → Revise down.
2. Do B2B targets assume closed deals within 90 days on cold outreach? → Flag as high-risk.
3. Does referral/affiliate math show CAC < 3-month LTV? → Calculate it explicitly.
4. Do any tactics require a sales team? → Replace with founder-only motion.
5. Are conversion rates above 5% for Indian freemium? → Justify or lower to 2–3%.
"""


class SalesAgent:
    def think(self, state: dict) -> str:
        idea = state["startup_idea"]

        ceo_message = ""
        finance_message = ""
        marketing_message = ""
        product_message = ""

        for msg in state["messages"]:
            if msg["agent"] == "CEO":
                ceo_message = msg["message"]
            if msg["agent"] == "Finance":
                finance_message = msg["message"]
            if msg["agent"] == "Marketing":
                marketing_message = msg["message"]
            if msg["agent"] == "Product":
                product_message = msg["message"]

        prompt = f"""
You are the CRO of a bootstrap startup. Aggressive, target-driven, obsessed with closing.
You don't accept vague plans — you want names, numbers, mechanisms, and dates.
You also don't accept fantasy numbers — if the math doesn't work, you say so.
{build_context_block(state)}
{SALES_PERSONA}

Startup Idea: {idea}

CEO's Strategic Analysis:
{ceo_message}

Finance's Budget & Pricing:
{finance_message}

Marketing's GTM Plan:
{marketing_message}

Product's Roadmap:
{product_message}

Your job:

1. B2C CONVERSION FUNNEL:
   - How does a free user become a paying user? Step by step.
   - Realistic conversion rate for this market (justify it).
   - What is the single highest-leverage action to improve conversion?

2. B2B SALES MOTION (if applicable):
   - Realistic timeline: how long from first outreach to signed contract in this market?
   - Step-by-step founder-led process (no sales team).
   - What is the minimum viable pilot offer that gets a "yes" in week 1?
   - Flag: if B2B revenue target is within 90 days of cold start → mark as HIGH RISK
     and explain why.

3. OBJECTION HANDLING (3 most common):
   For each: exact objection → exact founder response. Specific to this product.

4. REVENUE TARGETS — grounded math only:
   Start from: estimated launch audience size = 0 (cold start, no existing following).
   - Day 30: realistic paying users given cold start + marketing budget. Show the math.
   - Day 60: compound from Day 30 actuals + referral loop. Show the math.
   - Day 90: compound from Day 60. Show the math.
   If the numbers are small — say so honestly. A realistic ₹20k MRR at Day 30
   is more useful than a fantasy ₹3.5L MRR.

5. PIPELINE BREAKDOWN:
   Leads → signups → active free users → trials → paid. Numbers for each stage.
   Show assumed drop-off at each stage.

6. CALL OUT: Flag anything in other agents' plans that makes hitting revenue targets harder.
   Name the specific assumption and the risk it creates.

{SALES_SELF_CHECK}
"""

        response = client.chat.completions.create(
            model="openai/gpt-oss-120b:free",
            messages=[{"role": "user", "content": prompt}]
        )

        return response.choices[0].message.content