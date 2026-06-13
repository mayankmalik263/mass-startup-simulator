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
MANDATORY CONTEXT — DO NOT DEVIATE FROM THESE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Target Audience : {state.get('target_audience', 'not specified')}
Market          : {state.get('market', 'not specified')}
Revenue Model   : {state.get('revenue_model', 'not specified')}
Constraints     : {state.get('constraints', 'none')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Every number, strategy, and recommendation you make
must fit within these boundaries. Do not invent a
different audience or market.
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