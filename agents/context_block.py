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

    is_india = "india" in market.lower()
    is_bootstrapped = "bootstrap" in constraints.lower() or "bootstrapped" in constraints.lower()
    is_vc = "venture" in constraints.lower() or "vc" in constraints.lower() or "funding" in constraints.lower()

    currency_sym = "₹ (INR)" if is_india else "$ (USD)"
    
    rules = []
    
    # ── Currency and Market Rules ──
    rules.append(f"✅ CURRENCY: You MUST use {currency_sym} for all financial estimates. Do not use any other currency.")
    if is_india:
        rules.append("✅ MARKET: India. Use Indian benchmarks (Razorpay, UPI, realistic Indian salaries and purchasing power).")
    else:
        rules.append("✅ MARKET: Global/US. Use Global/US benchmarks (Stripe, global SaaS pricing, standard US metrics).")

    # ── Funding Constraints ──
    if is_bootstrapped:
        rules.append("❌ FUNDING: Never suggest raising external capital (no VCs, no angels, no seed rounds).")
        rules.append("❌ TEAM: Never suggest hiring full-time employees. Founder builds using AI tools and minimal freelancers.")
        if is_india:
            rules.append("✅ BUDGET: Max MVP build cost should be strictly under ₹40,000 using AI tools.")
            rules.append("✅ BURN RATE: Keep monthly burn strictly under ₹30,000 before first revenue.")
        else:
            rules.append("✅ BUDGET: Max MVP build cost should be strictly under $500 using AI tools (Cursor, Supabase, Vercel).")
            rules.append("✅ BURN RATE: Keep monthly burn strictly under $500 before first revenue.")
        rules.append("✅ TIMELINE: Ship the MVP within 2 to 4 weeks. Revenue must start in Month 1 or 2.")
    elif is_vc:
        rules.append("✅ FUNDING: Assume venture-backed. Focus on aggressive growth, market capture, and high velocity.")
        rules.append("✅ TEAM: Founder can hire a lean, elite engineering and go-to-market team.")
        if is_india:
            rules.append("✅ BUDGET: Seed stage. Assume 12-18 month runway of ₹3Cr to ₹5Cr.")
        else:
            rules.append("✅ BUDGET: Seed stage. Assume 12-18 month runway of $1M to $3M.")
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