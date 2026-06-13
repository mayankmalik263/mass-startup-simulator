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