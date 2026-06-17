"""
context_block.py — shared utility for all MASS agents.

Single source of truth for market/constraint violations.
Import this in every agent file instead of copy-pasting _context_block().

Usage:
    from context_block import build_context_block
    ...
    prompt = f\"\"\"
    {build_context_block(state)}
    ...
    \"\"\"
"""


def build_context_block(state: dict) -> str:
    market = state.get("market", "not specified")
    audience = state.get("target_audience", "not specified")
    revenue = state.get("revenue_model", "not specified")
    constraints = state.get("constraints", "none")

    violations = []

    # ── India-specific rules ──────────────────────────────────────────────────
    if "india" in market.lower():
        violations.append("❌ Never use USD — all numbers in INR (₹)")
        violations.append("❌ Never reference SF/NYC/Bay Area salary or talent rates")
        violations.append("❌ Never mention US VCs, Y Combinator, or US investors")
        violations.append("❌ Never price in USD — India SaaS B2C range: ₹99–₹999/month")
        violations.append("❌ Never assume US-style CAC or LTV benchmarks")
        violations.append("✅ Use Indian examples: Zoho, Razorpay, Zerodha, CRED, HealthifyMe")
        violations.append("✅ Payments via Razorpay / UPI — not Stripe")
        violations.append("✅ Indian B2B sales cycle = 3–6 months minimum (procurement + IT approval)")
        violations.append("✅ Indian freemium → paid conversion realistic rate: 2–5%, not 8–10%")

    # ── Bootstrap-specific rules ──────────────────────────────────────────────
    if "bootstrap" in constraints.lower() or "bootstrapped" in constraints.lower():
        violations.append("❌ Never suggest raising external funding of any kind")
        violations.append("❌ Never mention seed round, Series A, angel investors, SAFE notes, or any investor")
        violations.append("❌ Never suggest a full-time hired team — founder builds, uses freelancers only")
        violations.append("❌ Never suggest monthly burn over ₹1.5L before first ₹1L MRR")
        violations.append("❌ Never suggest total MVP build cost over ₹2L")
        violations.append("❌ Never suggest CAC that exceeds 3-month LTV")
        violations.append("✅ 2025 reality: solo founder + AI tools (Cursor, v0, Supabase free tier, Vercel free)")
        violations.append("✅   can ship a working MVP in 3–4 weeks for under ₹2L total")
        violations.append("✅ Revenue must begin month 1 or month 2 — no 'build first, monetize later'")
        violations.append("✅ Every expense needs a direct revenue justification")
        violations.append("✅ Use freelancers for tasks founder cannot do — cap freelance at ₹30–50k/month")

    violations_text = (
        "\n".join(violations)
        if violations
        else "None specific — apply general good judgment."
    )

    return f"""
CRITICAL CONTEXT — THIS OVERRIDES ALL DEFAULT ASSUMPTIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Market          : {market}
Target Audience : {audience}
Revenue Model   : {revenue}
Constraints     : {constraints}

HARD RULES FOR THIS CONTEXT:
{violations_text}

Before every number, price, team size, or recommendation —
ask: "Does this hold for {market} under {constraints}?"
If not, rewrite it until it does.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""