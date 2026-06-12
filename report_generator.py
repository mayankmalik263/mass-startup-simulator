from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY")
)

def generate_report(state: dict) -> str:
    idea = state["startup_idea"]
    
    # collect all agent outputs
    ceo_message = ""
    finance_message = ""
    marketing_message = ""
    product_message = ""
    sales_message = ""
    
    for msg in state["messages"]:
        if msg["agent"] == "CEO":
            ceo_message = msg["message"]
        if msg["agent"] == "Finance":
            finance_message = msg["message"]
        if msg["agent"] == "Marketing":
            marketing_message = msg["message"]
        if msg["agent"] == "Product":
            product_message = msg["message"]
        if msg["agent"] == "Sales":
            sales_message = msg["message"]
    
    prompt = f"""
You are a senior business analyst. You have just observed a full startup planning session between 5 expert agents. Your job is to distill everything into one clean, structured final report.

Startup Idea: {idea}

CEO's Analysis:
{ceo_message}

Finance's Analysis:
{finance_message}

Marketing's Analysis:
{marketing_message}

Product's Analysis:
{product_message}

Sales's Analysis:
{sales_message}

Write a final startup report with EXACTLY these sections:

---
STARTUP PLAN: {idea}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. MISSION
One sentence. What this startup does and who it's for.

2. THE PROBLEM
2-3 sentences. What pain are we solving?

3. TARGET CUSTOMER
Specific. Age, income, behavior, pain point.

4. BUSINESS MODEL
How do we make money? Tiers and prices.

5. FINANCIAL SNAPSHOT
- Monthly burn
- Funding needed
- Runway
- Break-even target

6. GO-TO-MARKET (FIRST 30 DAYS)
Top 3 tactics only. Specific and actionable.

7. PRODUCT MVP
5 features only. One line each.

8. REVENUE TARGETS
Day 30 / Day 60 / Day 90 MRR.

9. KEY CONFLICTS DETECTED
Top 3 disagreements between agents. What was debated.

10. FINAL VERDICT
3-5 sentences. Is this idea viable? What must go right? What could kill it?

---
Be concise. No fluff. Each section maximum 5 lines.
"""
    
    response = client.chat.completions.create(
        model="openai/gpt-oss-120b:free",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    
    return response.choices[0].message.content