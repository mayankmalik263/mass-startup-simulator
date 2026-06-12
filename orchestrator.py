from state import create_state
from agents.ceo_agent import CEOAgent

def run(idea: str):
    # Step 1: create shared brain
    state = create_state(idea)
    
    # Step 2: call CEO
    print("\n🤖 CEO Agent thinking...\n")
    ceo = CEOAgent()
    ceo_response = ceo.think(state)
    
    # Step 3: store in state
    state["messages"].append({
        "agent": "CEO",
        "message": ceo_response
    })
    
    # Step 4: print output
    print("=" * 50)
    print("CEO ANALYSIS")
    print("=" * 50)
    print(ceo_response)
    print("\n📋 STATE SNAPSHOT:")
    print(f"Messages logged: {len(state['messages'])}")
    print(f"First message by: {state['messages'][0]['agent']}")
    
    return state