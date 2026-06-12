from typing import TypedDict

class StartupState(TypedDict):
    startup_idea: str
    messages: list
    decisions: list
    final_report: str
    
def create_state(idea: str) -> StartupState:
    return {
        "startup_idea": idea,
        "messages": [],
        "decisions": [],
        "final_report": ""
    }