import os

def get_llm_model(tier: str) -> str:
    """
    Returns the appropriate OpenRouter model string based on the user's tier.
    Using free models for both tiers during development (Zero-Cost Strategy).
    Once launched, the PRO tier will be switched to Claude 3.5 Sonnet.
    """
    if tier.lower() == "pro":
        # Dev fallback: Llama 3.3 70B is frequently rate-limited on the free tier, 
        # so using Gemini 2.0 Flash as the most stable free model for dev.
        return "google/gemini-2.0-flash-exp:free"
        
        # Production ready (commented out until launch):
        # return "anthropic/claude-3.5-sonnet"
    else:
        # Default Free Tier
        return "google/gemini-2.0-flash-exp:free"
