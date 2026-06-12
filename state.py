from typing import TypedDict

class StartupState(TypedDict):
    startup_idea: str
    messages: list
    decisions: list
    final_report: str
    
    # Phase 2 additions
    iteration: int          # which debate round are we on
    max_iterations: int     # stop infinite loops
    ceo_finance_agreed: bool    # did CEO + Finance reach consensus?
    conflicts: list         # what agents disagreed on
    current_speaker: str    # who speaks next (supervisor uses this)
    
def create_state(idea: str) -> StartupState:
    return {
        "startup_idea": idea,
        "messages": [],
        "decisions": [],
        "final_report": "",
        
        # Phase 2 defaults
        "iteration": 0,
        "max_iterations": 3,
        "ceo_finance_agreed": False,
        "conflicts": [],
        "current_speaker": "CEO"
    }