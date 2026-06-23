import os

def get_llm_model(tier: str) -> str:
    """
    Returns the appropriate Groq model string based on the user's tier.
    Using Llama 3.3 70B Versatile for all tiers as requested by the founder.
    """
    return "llama-3.3-70b-versatile"
