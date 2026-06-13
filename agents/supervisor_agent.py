from openai import OpenAI
import os
import json
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
class SupervisorAgent:
    def evaluate(self, state: dict) -> dict:
        idea = state["startup_idea"]
        iteration = state["iteration"]
        
        # get latest CEO and Finance messages
        ceo_messages = [m for m in state["messages"] if m["agent"] == "CEO"]
        finance_messages = [m for m in state["messages"] if m["agent"] == "Finance"]
        
        latest_ceo = ceo_messages[-1]["message"] if ceo_messages else ""
        latest_finance = finance_messages[-1]["message"] if finance_messages else ""
        
        prompt = f"""
You are a neutral supervisor overseeing a startup planning debate.

Startup Idea: {idea}
Debate Round: {iteration + 1}

CEO's Latest Position:
{latest_ceo}

Finance's Latest Position:
{latest_finance}

Your job: determine if CEO and Finance have reached workable consensus.

Consensus means:
- Finance accepts the core strategy (even with reservations)
- CEO has acknowledged financial constraints
- There is no fundamental blocker preventing moving forward

Respond ONLY with valid JSON in this exact format:
{{
  "agreed": true or false,
  "reason": "one sentence explaining why",
  "conflicts": ["list of unresolved conflicts, empty if agreed"],
  "decisions": ["list of things both parties agreed on"]
}}

No text before or after the JSON.
"""  
        response = client.chat.completions.create(
            model="openai/gpt-oss-120b:free",
            messages=[{"role": "user", "content": prompt}]
        )
        
        raw = response.choices[0].message.content.strip()
        
        # parse JSON response
        try:
            # strip markdown fences if present
            if raw.startswith("```"):
                raw = raw.split("```")[1]
                if raw.startswith("json"):
                    raw = raw[4:]
            result = json.loads(raw.strip())
        except json.JSONDecodeError:
            # if LLM doesn't return clean JSON → default to agreed
            # prevents infinite loops on bad responses
            print("⚠️ Supervisor JSON parse failed. Defaulting to agreed.")
            result = {
                "agreed": True,
                "reason": "Parse error — defaulting to consensus",
                "conflicts": [],
                "decisions": []
            }
        
        print(f"  Supervisor verdict: {'✅ AGREED' if result['agreed'] else '❌ NOT AGREED'}")
        print(f"  Reason: {result.get('reason', '')}\n")
        
        return result