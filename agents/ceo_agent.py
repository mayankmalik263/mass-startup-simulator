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
class CEOAgent:
    def think(self, state: dict) -> str:
        idea = state["startup_idea"]
        
        prompt = f"""
You are the CEO of a startup. You have just received a startup idea.

Startup Idea: {idea}
{_context_block(state)}

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