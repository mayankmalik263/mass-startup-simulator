from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY")
)
def _context_block(state: dict) -> str:
    return f"""
HARD CONSTRAINTS — TREAT THESE AS ABSOLUTE RULES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Market          : {state.get('market', 'not specified')}
Target Audience : {state.get('target_audience', 'not specified')}
Revenue Model   : {state.get('revenue_model', 'not specified')}
Constraints     : {state.get('constraints', 'none')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VIOLATIONS THAT WILL MAKE YOUR OUTPUT WRONG:
❌ DO NOT suggest US/SF salary benchmarks if market is India
❌ DO NOT suggest VC funding if constraint is bootstrapped
❌ DO NOT suggest Series A if constraint is bootstrapped
❌ DO NOT use USD pricing if market is India (use INR)
❌ DO NOT reference US consumer behavior if market is India

WHAT CORRECT OUTPUT LOOKS LIKE FOR THIS CONTEXT:
✅ Salaries in INR at Indian market rates
✅ Bootstrap-friendly burn (under ₹5-10L/month)
✅ Revenue from day 1, no external funding
✅ Indian SaaS/app pricing (₹99-₹999/month)
✅ Indian corporate wellness context
"""
class SalesAgent:
    def think(self, state: dict) -> str:
        idea = state["startup_idea"]
        
        # read ALL agents from state
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
You are the CRO (Chief Revenue Officer) of a startup. You are aggressive, target-driven, and obsessed with closing deals. You don't accept vague plans — you want names, numbers, and dates.

Startup Idea: {idea}

CEO's Strategic Analysis:
{ceo_message}

Finance's Budget & Pricing:
{finance_message}

Marketing's GTM Plan:
{marketing_message}

Product's Roadmap & Features:
{product_message}

Your job:
1. Define the B2C sales strategy (how do free users become paying users?)
2. Define the B2B sales strategy (how do we close corporate deals step by step?)
3. Write 3 real objection-handling scripts (most common objections + exact responses)
4. Set 30/60/90 day revenue targets with specific numbers
5. Build a pipeline breakdown (how many leads → demos → trials → closed deals)
6. Call out anything in the other agents' plans that makes your job harder to hit targets

Be brutally specific. No vague goals. Real numbers, real tactics, real scripts.
"""
        response = client.chat.completions.create(
            model="openai/gpt-oss-120b:free",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        return response.choices[0].message.content