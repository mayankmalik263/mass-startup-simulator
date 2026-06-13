from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY")
)
def _context_block(state: dict) -> str:
    market = state.get('market', 'not specified')
    audience = state.get('target_audience', 'not specified')
    revenue = state.get('revenue_model', 'not specified')
    constraints = state.get('constraints', 'none')
    
    violations = []
    
    if "india" in market.lower():
        violations.append("❌ Never use USD salaries — use INR (₹)")
        violations.append("❌ Never suggest $10k+/month burn — India dev teams cost ₹3-8L/month total")
        violations.append("❌ Never price in USD — use ₹99-₹499/month range")
        violations.append("❌ Never reference SF/NYC/Bay Area talent rates")
        violations.append("❌ Never mention US VCs, Y Combinator, or US investors")
        violations.append("✅ Use Indian SaaS examples: Zoho, Razorpay, Zerodha, CRED")
        violations.append("✅ Reference Indian corporate wellness context")
        violations.append("✅ Consider UPI, Razorpay for payments not Stripe")
    
    if "bootstrap" in constraints.lower() or "bootstrapped" in constraints.lower():
        violations.append("❌ Never suggest raising external funding")
        violations.append("❌ Never mention seed round, Series A, angel investors, SAFE notes")
        violations.append("❌ Never suggest burn over ₹5L/month if India market")
        violations.append("❌ Never build a team bigger than 3-4 people at start")
        violations.append("✅ Revenue must start month 1 or 2")
        violations.append("✅ Every decision must be profitable or near-profitable quickly")
        violations.append("✅ Use freelancers and contractors not full-time hires")
    
    violations_text = "\n".join(violations) if violations else "None specific — use general good judgment."
    
    return f"""
CRITICAL CONTEXT — THIS OVERRIDES YOUR DEFAULT ASSUMPTIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Market          : {market}
Target Audience : {audience}
Revenue Model   : {revenue}
Constraints     : {constraints}

RULES FOR THIS SPECIFIC CONTEXT:
{violations_text}

Before every number, price, or recommendation you write —
ask: "Does this make sense for {market} under {constraints}?"
If not, rewrite it until it does.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""
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