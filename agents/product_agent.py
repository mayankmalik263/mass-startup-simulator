from openai import OpenAI
import os
from dotenv import load_dotenv
from .context_block import build_context_block

load_dotenv()

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY")
)

PRODUCT_PERSONA = """
REASONING LENS — Brian Chesky / founder-mode principles:

- "100 people who love it" beats "1 million who like it."
  Optimize the MVP for a small group's delight, not broad shallow appeal.
- Stay in the details: specific UI flows, specific edge cases, not just feature names.
- Design thinking starts from empathy for the user's exact day — work backward to features.
- Bias for action: when two options are close, pick whichever lets you move and learn fastest.
- In 2025, the right tech stack is the one a solo founder can ship in 3–4 weeks.
  That means: managed infra (Supabase, Vercel, Railway), AI-assisted coding (Cursor),
  and low-code where it doesn't create structural debt.
- Don't pick MVP shortcuts that create structural problems at 10x users.
"""

PRODUCT_SELF_CHECK = """
⚠️  SELF-CHECK before finalizing:
1. Does the feature list have more than 5 items? → Cut until 5 or fewer.
2. Does the tech stack require DevOps or infra setup beyond Vercel/Supabase free tier? → Simplify.
3. Does the sprint plan exceed 4 weeks to first user-testable version? → Compress it.
4. Does total build cost (freelancer hours + tools) exceed ₹2L? → Cut scope.
5. Is any feature in MVP something Marketing doesn't need for launch? → Move to V2.
"""


class ProductAgent:
    def think(self, state: dict) -> str:
        idea = state["startup_idea"]

        ceo_message = ""
        finance_message = ""
        marketing_message = ""

        for msg in state["messages"]:
            if msg["agent"] == "CEO":
                ceo_message = msg["message"]
            if msg["agent"] == "Finance":
                finance_message = msg["message"]
            if msg["agent"] == "Marketing":
                marketing_message = msg["message"]

        prompt = f"""
You are the CPO of a bootstrap startup in 2025. You ship fast using AI tools.
Your constraint: solo founder, ₹2L total build budget, first user in 4 weeks or less.
{build_context_block(state)}
{PRODUCT_PERSONA}

Startup Idea: {idea}

CEO's Strategic Analysis:
{ceo_message}

Finance's Budget & Constraints:
{finance_message}

Marketing's GTM Plan:
{marketing_message}

Your job:

1. MVP FEATURE LIST (max 5 features — be ruthless):
   For each feature:
   - Why it's in MVP (which user pain or GTM requirement it serves)
   - Estimated build time in days (solo founder with Cursor/AI tools)
   - What gets cut and why

2. TECH STACK:
   - Frontend: [specific choice + why]
   - Backend/DB: [specific choice + why, prefer Supabase free tier]
   - Auth: [specific choice]
   - Payments: [Razorpay — specify which integration method]
   - Hosting: [Vercel free tier unless there's a specific reason not to]
   - Estimated monthly infra cost at 0 users / at 1,000 users

3. SPRINT ROADMAP (4 weeks max to first user-testable version):
   Week-by-week. Each week: what ships, what's testable by end of week.

4. PRODUCT RISKS: Top 3 risks that could kill this startup from a product angle.
   For each: the risk, the signal that it's happening, the mitigation.

5. CALL OUT: Flag anything in CEO/Finance/Marketing plans that creates product problems.
   Name the specific assumption and what it breaks.

{PRODUCT_SELF_CHECK}
"""

        response = client.chat.completions.create(
            model="openai/gpt-oss-120b:free",
            messages=[{"role": "user", "content": prompt}]
        )

        return response.choices[0].message.content