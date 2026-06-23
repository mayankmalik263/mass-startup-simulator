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
    market = state.get("market", "Global")
    audience = state.get("target_audience", "not specified")
    revenue = state.get("revenue_model", "not specified")
    constraints = state.get("constraints", "none")

    is_bootstrapped = "bootstrap" in constraints.lower() or "bootstrapped" in constraints.lower()
    is_vc = "venture" in constraints.lower() or "vc" in constraints.lower() or "funding" in constraints.lower()

    rules = []
    
    # ── Currency and Market Rules ──
    rules.append("✅ CURRENCY & MARKET: Analyze the location implied by the startup idea or context. If the target market or location is within India (e.g., Dehradun, Delhi, India), you MUST use Indian Rupees (₹/INR) for all financial estimates and assume realistic Indian benchmarks (UPI, Razorpay, Indian salaries). Otherwise, default to USD ($) and Global/US benchmarks (Stripe, standard US metrics).")

    # ── Funding Constraints ──
    if is_bootstrapped:
        rules.append("❌ FUNDING: Never suggest raising external capital (no VCs, no angels, no seed rounds).")
        rules.append("❌ TEAM: Never suggest hiring full-time employees. Founder builds using AI tools and minimal freelancers.")
        rules.append("✅ BUDGET: Max MVP build cost should be strictly under $500 (or ₹40,000 if India) using AI tools (Cursor, Supabase, Vercel).")
        rules.append("✅ BURN RATE: Keep monthly burn strictly under $500 (or ₹30,000 if India) before first revenue.")
        rules.append("✅ TIMELINE: Ship the MVP within 2 to 4 weeks. Revenue must start in Month 1 or 2.")
    elif is_vc:
        rules.append("✅ FUNDING: Assume venture-backed. Focus on aggressive growth, market capture, and high velocity.")
        rules.append("✅ TEAM: Founder can hire a lean, elite engineering and go-to-market team.")
        rules.append("✅ BUDGET: Seed stage. Assume 12-18 month runway of $1M to $3M (or ₹3Cr to ₹5Cr if India).")
    else:
        # Default reasonable constraints
        rules.append("✅ TIMELINE: Ship the MVP within 4 weeks. Use 2026 AI tools to drastically cut development costs.")

    # ── Y-Combinator & Specialist Business Logic ──
    rules.append("🧠 BUSINESS FRAMEWORK (Y-Combinator & Lean Startup):")
    rules.append("  - Do things that don't scale initially to acquire the first 100 passionate customers.")
    rules.append("  - A 2026 Solo Founder with AI tools is equivalent to a 5-person engineering team in 2020. Price accordingly.")
    rules.append("  - Be hyper-specific. Generic advice is useless. Identify the exact 'wedge' to enter the market.")
    rules.append("  - Validate the problem before writing any code (or use no-code/AI to validate instantly).")

    rules_text = "\n".join(rules)

    return f"""
CRITICAL CONTEXT — THIS OVERRIDES ALL DEFAULT ASSUMPTIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Startup Idea    : {state.get("startup_idea", "N/A")}
Market          : {market}
Target Audience : {audience}
Revenue Model   : {revenue}
Constraints     : {constraints}

HARD RULES FOR THIS CONTEXT:
{rules_text}

Before every number, price, team size, or recommendation —
ask: "Does this hold for {market} under {constraints}?"
If not, rewrite it until it does.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""