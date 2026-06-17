from openai import OpenAI
import os
from dotenv import load_dotenv
from agents.context_block import build_context_block

load_dotenv()

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY")
)


def generate_report(state: dict) -> str:
    idea = state["startup_idea"]

    # Collect all agent outputs
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
You are a senior business analyst synthesizing a startup planning session into a final report.
Your job is NOT to copy agent outputs — it is to verify, reconcile, and produce a
internally consistent report where every number checks out.

{build_context_block(state)}

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

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BEFORE WRITING THE REPORT — DO THESE CHECKS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MATH VERIFICATION (do this silently, fix before writing):

1. BREAK-EVEN CHECK:
   - Identify the stated MRR break-even target (e.g. "₹X MRR")
   - Identify the pricing tier most users will be on (e.g. ₹99/mo)
   - Calculate: users needed = MRR target ÷ price per user
   - If the report says "₹2.5L MRR (≈ 25 users)" but 25 × ₹99 = ₹2,475 ≠ ₹2.5L → fix it
   - Either fix the MRR number OR fix the user count so they match

2. REVENUE TARGET CHECK:
   - Day 30 MRR = paying users × price per user. Verify the arithmetic.
   - Day 60 and Day 90 same check.
   - If any stated MRR ÷ price ≠ stated user count → fix the number that's wrong.

3. BURN vs RUNWAY CHECK:
   - Runway (months) = available capital ÷ monthly burn
   - If stated runway doesn't match this formula → fix it.

4. CAC vs LTV CHECK:
   - LTV = price per user × average months retained (use 6 months if unknown)
   - CAC must be < LTV. If any stated CAC exceeds LTV → flag it in KEY CONFLICTS.

5. BOOTSTRAP CONSISTENCY CHECK:
   - If any number implies external funding → remove it, replace with bootstrap equivalent.
   - If any cost assumes full-time hires → replace with freelancer rates.

6. COMPETITOR CHECK:
   - The report MUST name at least 2 real competitors in this space.
   - If CEO did not name any → add them yourself based on the market and idea.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Now write the final report with EXACTLY these sections:

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
How do we make money? Tiers with verified prices.

5. FINANCIAL SNAPSHOT
- Monthly burn: [amount] — line items summarized
- MVP build cost: [amount] — must be under ₹2L for bootstrap
- Runway: [X months at ₹Y capital] — show the division
- Break-even: [₹X MRR] (≈ [N] users at ₹[price]/mo) — numbers MUST multiply correctly

6. GO-TO-MARKET (FIRST 30 DAYS)
Top 3 tactics only. Each must include: channel, action, expected output, cost.

7. PRODUCT MVP
5 features only. One line each. No scope creep.

8. REVENUE TARGETS
- Day 30: ₹[X] MRR (≈ [N] paying users) — verified: N × price = X
- Day 60: ₹[X] MRR (≈ [N] paying users) — verified: N × price = X
- Day 90: ₹[X] MRR (≈ [N] paying users) — verified: N × price = X

9. KEY CONFLICTS DETECTED
Top 3 disagreements between agents. Include any math errors you found and corrected.

10. COMPETITION
Name 2-3 real competitors in this space. One line each: name + why this startup can win against them.

11. FINAL VERDICT
3-5 sentences. Is this idea viable? What must go right? What could kill it?

---
Be concise. No fluff. Each section maximum 5 lines.
Every number in the report must be internally consistent.
If a number doesn't check out — fix it, don't copy it.
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b:free",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    return response.choices[0].message.content