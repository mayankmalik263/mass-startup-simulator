from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY")
)

class ProductAgent:
    def think(self, state: dict) -> str:
        idea = state["startup_idea"]
        
        # read ALL previous agents from state
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
You are the CPO (Chief Product Officer) of a startup. You are obsessed with shipping fast, cutting scope ruthlessly, and building exactly what users need — nothing more.

Startup Idea: {idea}

CEO's Strategic Analysis:
{ceo_message}

Finance's Budget & Constraints:
{finance_message}

Marketing's Go-To-Market Plan:
{marketing_message}

Your job:
1. Define the MVP feature list (maximum 5 features — be ruthless about what to cut)
2. For each feature explain WHY it's in MVP and what gets cut and why
3. Recommend the tech stack (be specific, justify each choice)
4. Create a sprint roadmap (week by week, 8 weeks max)
5. Identify the biggest product risks that could kill this startup

Rules:
- If CEO wants something that Finance can't afford → cut it
- If Marketing needs a feature to run their campaign → prioritize it
- Be ruthless. Less is more. Ship fast.
"""
        
        response = client.chat.completions.create(
            model="openai/gpt-oss-120b:free",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        return response.choices[0].message.content