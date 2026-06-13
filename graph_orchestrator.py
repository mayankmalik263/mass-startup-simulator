from langgraph.graph import StateGraph, END
from state import StartupState, create_state
from agents.ceo_agent import CEOAgent
from agents.finance_agent import FinanceAgent
from agents.marketing_agent import MarketingAgent
from agents.product_agent import ProductAgent
from agents.sales_agent import SalesAgent
from agents.supervisor_agent import SupervisorAgent
from report_generator import generate_report
from save_report import save_state

# ── node functions ──────────────────────────────────────

def ceo_node(state: StartupState) -> StartupState:
    print(f"\n🤖 CEO Agent thinking... (round {state['iteration'] + 1})\n")
    agent = CEOAgent()
    response = agent.think(state)
    
    state["messages"].append({
        "agent": "CEO",
        "round": state["iteration"],
        "message": response
    })
    return state

def finance_node(state: StartupState) -> StartupState:
    print(f"💰 Finance Agent thinking... (round {state['iteration'] + 1})\n")
    agent = FinanceAgent()
    response = agent.think(state)
    
    state["messages"].append({
        "agent": "Finance",
        "round": state["iteration"],
        "message": response
    })
    return state

def marketing_node(state: StartupState) -> StartupState:
    print("📣 Marketing Agent thinking...\n")
    agent = MarketingAgent()
    response = agent.think(state)
    state["messages"].append({
        "agent": "Marketing",
        "round": state["iteration"],
        "message": response
    })
    return state

def product_node(state: StartupState) -> StartupState:
    print("🛠️ Product Agent thinking...\n")
    agent = ProductAgent()
    response = agent.think(state)
    state["messages"].append({
        "agent": "Product",
        "round": state["iteration"],
        "message": response
    })
    return state

def sales_node(state: StartupState) -> StartupState:
    print("🤝 Sales Agent thinking...\n")
    agent = SalesAgent()
    response = agent.think(state)
    state["messages"].append({
        "agent": "Sales",
        "round": state["iteration"],
        "message": response
    })
    return state

def supervisor_node(state: StartupState) -> StartupState:
    print("🎯 Supervisor checking consensus...\n")
    agent = SupervisorAgent()
    result = agent.evaluate(state)
    
    # supervisor returns structured decision
    state["ceo_finance_agreed"] = result["agreed"]
    state["iteration"] = state["iteration"] + 1
    
    if result.get("conflicts"):
        state["conflicts"].extend(result["conflicts"])
    
    if result.get("decisions"):
        state["decisions"].extend(result["decisions"])
    
    return state

def report_node(state: StartupState) -> StartupState:
    print("📊 Generating final report...\n")
    report = generate_report(state)
    state["final_report"] = report
    save_state(state, report)
    return state

# ── routing functions ────────────────────────────────────

def should_debate_more(state: StartupState) -> str:
    """
    After supervisor checks CEO + Finance:
    - if agreed → move to Marketing
    - if not agreed AND rounds left → loop back to CEO
    - if not agreed AND max rounds hit → force move on
    """
    if state["ceo_finance_agreed"]:
        print("✅ CEO + Finance agreed. Moving to Marketing.\n")
        return "agreed"
    
    if state["iteration"] >= state["max_iterations"]:
        print("⚠️ Max debate rounds hit. Forcing consensus.\n")
        return "agreed"
    
    print(f"🔄 No consensus yet. Round {state['iteration'] + 1} starting.\n")
    return "debate_more"

# ── build graph ──────────────────────────────────────────

def build_graph():
    graph = StateGraph(StartupState)
    
    # add all nodes
    graph.add_node("ceo", ceo_node)
    graph.add_node("finance", finance_node)
    graph.add_node("supervisor", supervisor_node)
    graph.add_node("marketing", marketing_node)
    graph.add_node("product", product_node)
    graph.add_node("sales", sales_node)
    graph.add_node("report", report_node)
    
    # entry point
    graph.set_entry_point("ceo")
    
    # CEO → Finance → Supervisor
    graph.add_edge("ceo", "finance")
    graph.add_edge("finance", "supervisor")
    
    # Supervisor → conditional branch
    graph.add_conditional_edges(
        "supervisor",
        should_debate_more,
        {
            "agreed": "marketing",      # consensus → next agent
            "debate_more": "ceo"        # no consensus → CEO revises
        }
    )
    
    # rest of chain is sequential after consensus
    graph.add_edge("marketing", "product")
    graph.add_edge("product", "sales")
    graph.add_edge("sales", "report")
    graph.add_edge("report", END)
    
    return graph.compile()

# ── run ──────────────────────────────────────────────────

def run(idea: str, context: dict = None):
    if context is None:
        context = {}
    
    state = create_state(
        idea=idea,
        target_audience=context.get("target_audience", ""),
        market=context.get("market", ""),
        revenue_model=context.get("revenue_model", ""),
        constraints=context.get("constraints", "")
    )
    
    app = build_graph()
    
    final_state = app.invoke(state)
    
    # print all outputs
    printed = set()
    for msg in final_state["messages"]:
        key = f"{msg['agent']}-{msg.get('round', 0)}"
        if key not in printed:
            print("\n" + "=" * 50)
            print(f"{msg['agent'].upper()} (Round {msg.get('round', 0) + 1})")
            print("=" * 50)
            print(msg["message"])
            printed.add(key)
    
    print("\n" + "=" * 50)
    print("FINAL REPORT")
    print("=" * 50)
    print(final_state["final_report"])
    
    print(f"\n📋 STATE SNAPSHOT:")
    print(f"Messages logged: {len(final_state['messages'])}")
    print(f"Debate rounds: {final_state['iteration']}")
    print(f"Conflicts detected: {len(final_state['conflicts'])}")
    for msg in final_state["messages"]:
        print(f"  → {msg['agent']} spoke (round {msg.get('round', 0) + 1})")
    
    return final_state