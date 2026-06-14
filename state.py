from typing import TypedDict

class StartupState(TypedDict):
    startup_idea: str
    messages: list
    decisions: list
    final_report: str
    business_plan: dict
    
    # Phase 2
    iteration: int
    max_iterations: int
    ceo_finance_agreed: bool
    conflicts: list
    current_speaker: str
    
    # User context (new)
    target_audience: str
    market: str
    revenue_model: str
    constraints: str

def create_state(
    idea: str,
    target_audience: str = "",
    market: str = "",
    revenue_model: str = "",
    constraints: str = ""
) -> StartupState:
    return {
        "startup_idea": idea,
        "messages": [],
        "decisions": [],
        "final_report": "",
        "business_plan": {},
        
        "iteration": 0,
        "max_iterations": 3,
        "ceo_finance_agreed": False,
        "conflicts": [],
        "current_speaker": "CEO",
        
        "target_audience": target_audience,
        "market": market,
        "revenue_model": revenue_model,
        "constraints": constraints
    }