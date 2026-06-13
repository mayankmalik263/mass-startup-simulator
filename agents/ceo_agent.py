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
class CEOAgent:
    def think(self, state: dict) -> str:
        idea = state["startup_idea"]
        
        prompt = f"""
You are the CEO of a startup. You have just received a startup idea.

Startup Idea: {idea}

Your job:
1. Identify the core problem this solves
2. Define the target customer (be specific)
3. State the startup's mission in one sentence
4. Give 3 key strategic decisions to move forward

Be direct. Be strategic. No fluff.
"""  
        response = client.chat.completions.create(
            model="openai/gpt-oss-120b:free",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        return response.choices[0].message.content