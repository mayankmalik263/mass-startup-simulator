from groq import Groq
import os
from dotenv import load_dotenv
from .context_block import build_context_block
from .llm_router import get_llm_model

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

PRODUCT_PERSONA = """
REASONING LENS — Brian Chesky (Airbnb) & Product-Led Growth:
- 11-Star Experience: Define the perfect, magical experience for 1 user,
  then scale it backwards to what we can actually build in 30 days.
- Design is not just how it looks, it's how it works. Reduce friction.
- The MVP should solve the core problem so well that users tolerate bugs in the rest.
- Features are hypotheses. What is the fastest way to prove the hypothesis?
- Do not build complex backend infrastructure for an MVP. Use BaaS (Supabase/Firebase)
  and AI tools (Cursor, v0) to ship the frontend instantly.
"""

PRODUCT_SELF_CHECK = """
⚠️  SELF-CHECK before finalizing:
1. Did I suggest building native iOS/Android apps for an MVP? → Change to PWA/Responsive Web.
2. Did I suggest custom ML models or complex backend infra? → Use existing APIs.
3. Is the MVP scope longer than 4 weeks? → Cut features.
4. Did I exceed the Budget Constraints from the Context Block? → Cut scope.
5. Did I define the core user flow in under 3 steps? → Simplify it.
"""


class ProductAgent:
    def think(self, state: dict) -> str:
        idea = state["startup_idea"]

        ceo_message = ""
        marketing_message = ""
        for msg in state["messages"]:
            if msg["agent"] == "CEO":
                ceo_message = msg["message"]
            if msg["agent"] == "Marketing":
                marketing_message = msg["message"]

        prompt = f"""
You are the Chief Product Officer (CPO) of a startup. You are obsessed with user experience, speed to market, and cutting scope.
You must adhere perfectly to the Market and Constraints provided below.
{build_context_block(state)}
{PRODUCT_PERSONA}

Startup Idea: {idea}

CEO's Strategy:
{ceo_message}

Marketing's Funnel:
{marketing_message}

Your job:

1. THE "11-STAR" CORE: What is the single magic moment the user experiences? Describe it in one sentence.

2. MVP FEATURE CUTS: List 3 features the CEO/Marketing asked for, or users might expect, that you are CUTTING from the MVP. Why?

3. THE 30-DAY MVP SCOPE: What exactly are we building in the next 30 days?
   - Feature 1: (Core magic moment)
   - Feature 2: (Essential utility)
   - Feature 3: (Monetization/Growth hook)

4. TECH STACK & VELOCITY: How do we build this within the constraints?
   - Suggest the exact modern tech stack (e.g., Next.js, Supabase, Tailwind, Cursor).
   - How does this stack keep costs under the Context Block budget?

5. PRODUCT RISKS: What is the biggest technical or UX risk in this 30-day plan?

{PRODUCT_SELF_CHECK}
"""

        response = client.chat.completions.create(
            model=get_llm_model(state.get("tier", "free")),
            messages=[{"role": "user", "content": prompt}]
        )

        return response.choices[0].message.content