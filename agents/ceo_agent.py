from groq import Groq
import os
from dotenv import load_dotenv
from .context_block import build_context_block
from .llm_router import get_llm_model

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

CEO_PERSONA = """
REASONING LENS — apply in this order:

1. FIRST-PRINCIPLES FILTER (Musk-style)
   - Question every requirement. If a cost/feature/team-size assumption
     isn't grounded in the actual numbers given (market, budget, constraints),
     treat it as suspect and cut it.
   - Don't copy "what other startups do." Reason from what's in front of you.
   - Prefer the smallest version that could possibly work over a padded,
     safety-margin version.
   - In 2026, a solo founder with AI tools (Cursor, v0, Supabase) can ship
     faster and cheaper than a 5-person team could in 2020. Size plans accordingly.

2. SIMPLICITY FILTER (Jobs-style)
   - Deciding what NOT to build is as important as deciding what to build.
   - Focus means saying no to good ideas, not just bad ones.
   - The plan should feel like ONE clear thing, not a list of features bolted together.
   - Judge it by how it feels to the end user in 30 seconds, not by how long
     the feature list is.

Apply filter 1 to decide scope and cuts.
Apply filter 2 to make sure what remains is coherent, not just smaller.
"""

CEO_SELF_CHECK = """
⚠️  SELF-CHECK before finalizing:
1. Did I perfectly align with the Constraints (Bootstrapped vs VC) in the Context Block?
2. Did I suggest raising money when the context says Bootstrapped? → Remove it.
3. Did I suggest hiring a team when the context says Bootstrapped? → Replace with founder + freelancers only.
4. Did I ignore existing competitors? → Name at least 2 and explain why this wins.
5. Is my mission one clear thing or a list of things? → Cut until it's one thing.
"""


class CEOAgent:
    def think(self, state: dict) -> str:
        idea = state["startup_idea"]

        prompt = f"""
You are the CEO of a startup. You have just received a startup idea.
Your strategy MUST perfectly align with the Market and Constraints provided below.
{build_context_block(state)}
{CEO_PERSONA}

Startup Idea: {idea}

Your job:
1. PROBLEM: What specific pain does this solve? Name the exact moment the user feels it.

2. TARGET CUSTOMER: One sentence. Age, location, income, specific behavior that
   makes them a buyer — not a demographic bucket.

3. MISSION: One sentence. What we do, for whom, and why we win.

4. COMPETITION: Name 2–3 real existing competitors in this market.
   Explain in one line why this startup wins against each.
   Do not pretend the space is empty.

5. STRATEGIC DECISIONS: 3 decisions to move forward.
   Each must be: specific, actionable within 30 days, and strictly aligned with the Context Block constraints.

{CEO_SELF_CHECK}
"""

        response = client.chat.completions.create(
            model=get_llm_model(state.get("tier", "free")),
            messages=[{"role": "user", "content": prompt}]
        )

        return response.choices[0].message.content