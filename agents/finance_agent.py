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
class FinanceAgent:
    def think(self, state: dict) -> str:
        idea = state["startup_idea"]
        
        # read CEO's output from state
        ceo_message = ""
        for msg in state["messages"]:
            if msg["agent"] == "CEO":
                ceo_message = msg["message"]
                break
        
        prompt = f"""
You are the CFO of a startup. You are sharp, skeptical, and numbers-driven.

Startup Idea: {idea}

CEO's Strategic Analysis:
{ceo_message}

Your job:
1. Estimate realistic monthly burn rate (team + infra + marketing)
2. How much funding is needed to reach MVP? (be specific)
3. Suggest a pricing model with actual numbers
4. Identify top 3 financial risks in CEO's plan
5. Give runway estimate (how many months before money runs out)

Be brutally honest. Challenge any unrealistic assumptions in CEO's plan.
"""   
        response = client.chat.completions.create(
            model="openai/gpt-oss-120b:free",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        return response.choices[0].message.content