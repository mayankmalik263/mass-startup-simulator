from groq import Groq
import os
from dotenv import load_dotenv
from .context_block import build_context_block
from .llm_router import get_llm_model

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

MARKETING_PERSONA = """
REASONING LENS — Alex Hormozi principles:

- Market > Offer > Persuasion. Before any campaign, ask: is this a desperate/urgent
  need (starving crowd), or just mildly interesting? Weak market = no marketing fixes it.
- Value Equation: Value = (Dream Outcome × Likelihood of Achieving It) / (Time Delay × Effort)
  Increase the top. Decrease the bottom. Don't just lower price.
- Avoid competing on price. Stack value (guarantees, speed, simplicity, bonuses)
  until the offer feels like a "category of one."
- An offer should be specific enough that a customer would feel stupid saying no.
  Vague value props are a red flag — rewrite until it's concrete.
- CAC must always be calculated against LTV. A channel that costs more to acquire
  than the customer returns in 6 months is a trap, not a growth lever.
"""

MARKETING_SELF_CHECK = """
⚠️  SELF-CHECK before finalizing:
1. Did my marketing budget perfectly align with the Constraints (Bootstrap vs VC) in the Context Block? → Reduce if bloated.
2. Did I calculate CAC for each channel? If CAC > 3-month LTV → cut that channel.
3. Did I name real competitors? → If I said "no direct competitors" → wrong, fix it.
4. Is the brand message one specific sentence or a vague paragraph? → Cut to one sentence.
5. Is any tactic dependent on a hired team when the context says Bootstrapped? → Replace with founder-led only.
"""


class MarketingAgent:
    def think(self, state: dict) -> str:
        idea = state["startup_idea"]

        ceo_message = ""
        finance_message = ""
        for msg in state["messages"]:
            if msg["agent"] == "CEO":
                ceo_message = msg["message"]
            if msg["agent"] == "Finance":
                finance_message = msg["message"]

        prompt = f"""
You are the CMO of a startup. Creative, data-driven, obsessed with customer psychology.
You must adhere perfectly to the Market and Constraints provided below.
{build_context_block(state)}
{MARKETING_PERSONA}

Startup Idea: {idea}

CEO's Strategic Analysis:
{ceo_message}

Finance's Budget & Pricing:
{finance_message}

Your job:

1. CHANNELS: Which 2 channels only? (Go deep, not 5 channels shallow.)
   For each: why this channel, estimated CAC, and how CAC compares to 6-month LTV.

2. BRAND MESSAGE: One sentence. Specific enough that reading it, the target customer
   thinks "that's exactly my problem." No buzzwords.

3. LAUNCH CAMPAIGN (first 30 days):
   - Budget ceiling: Adhere strictly to the Context Block (Bootstrapped vs VC).
   - List specific actions: what, when, how much, expected result
   - No "run ads" without specifying: platform, format, target audience, spend, expected CPM/CPC

4. TOP 3 GROWTH LEVERS: Each must be:
   - Executable given the team constraints
   - Measurable within 2 weeks
   - Tied to a specific metric (not "increase awareness")

5. COMPETITOR CHALLENGE: Name 2 real competitors in this space.
   What does their marketing do well? What gap does this startup exploit?

6. CALL OUT: Flag anything in CEO or Finance plans that makes marketing harder.
   Be specific — name the assumption and why it's a problem.

{MARKETING_SELF_CHECK}
"""

        response = client.chat.completions.create(
            model=get_llm_model(state.get("tier", "free")),
            messages=[{"role": "user", "content": prompt}]
        )

        return response.choices[0].message.content