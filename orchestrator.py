from state import create_state
from agents.ceo_agent import CEOAgent
from agents.finance_agent import FinanceAgent

def run(idea: str):
    state = create_state(idea)
    
    # CEO thinks
    print("\n🤖 CEO Agent thinking...\n")
    ceo = CEOAgent()
    ceo_response = ceo.think(state)
    state["messages"].append({
        "agent": "CEO",
        "message": ceo_response
    })
    
    # Finance reads CEO output → reacts
    print("💰 Finance Agent thinking...\n")
    finance = FinanceAgent()
    finance_response = finance.think(state)
    state["messages"].append({
        "agent": "Finance",
        "message": finance_response
    })
    
    # print both
    print("=" * 50)
    print("CEO ANALYSIS")
    print("=" * 50)
    print(ceo_response)
    
    print("\n" + "=" * 50)
    print("FINANCE ANALYSIS")
    print("=" * 50)
    print(finance_response)
    
    print("\n📋 STATE SNAPSHOT:")
    print(f"Messages logged: {len(state['messages'])}")
    for msg in state["messages"]:
        print(f"  → {msg['agent']} spoke")
    
    return state