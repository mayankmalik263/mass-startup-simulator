import os

def get_llm_model(tier: str) -> str:
    """
    Returns the appropriate OpenRouter model string based on the user's tier.
    Using free models for both tiers during development (Zero-Cost Strategy).
    Once launched, the PRO tier will be switched to Claude 3.5 Sonnet.
    """
    if tier.lower() == "pro":
        # Dev fallback: We use Hermes 3 405B and Qwen3 Coder as they are incredibly 
        # strong for agentic workflows and roleplaying, while being less rate-limited.
        return "nousresearch/hermes-3-llama-3.1-405b:free,qwen/qwen3-coder-480b-a35b-instruct:free,openrouter/free"
        
        # Production ready (commented out until launch):
        # return "anthropic/claude-3.5-sonnet"
    else:
        # Default Free Tier
        return "nousresearch/hermes-3-llama-3.1-405b:free,openrouter/free"
