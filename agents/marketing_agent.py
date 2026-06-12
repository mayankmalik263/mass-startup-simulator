from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY")
)

class MarketingAgent:
    def think(self, state: dict) -> str:
        idea = state["startup_idea"]
        
        # read both CEO and Finance from state
        ceo_message = ""
        finance_message = ""
        for msg in state["messages"]:
            if msg["agent"] == "CEO":
                ceo_message = msg["message"]
            if msg["agent"] == "Finance":
                finance_message = msg["message"]
        
        prompt = f"""
You are the CMO of a startup. You are creative, data-driven, and obsessed with customer psychology.

Startup Idea: {idea}

CEO's Strategic Analysis:
{ceo_message}

Finance's Budget & Pricing Analysis:
{finance_message}

Your job:
1. Define the marketing strategy (which channels and why)
2. Write the core brand message in one sentence (what makes us different)
3. Plan the launch campaign (first 30 days, specific actions)
4. Identify the top 3 growth levers for this product
5. Challenge any unrealistic marketing assumptions from CEO or Finance

Be specific. No generic advice. Real tactics, real numbers.
"""
        
        response = client.chat.completions.create(
            model="openai/gpt-oss-120b:free",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        return response.choices[0].message.content