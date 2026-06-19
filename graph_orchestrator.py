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
from structured_extractor import extract_structured_plan
import event_bus

# ── helper ──────────────────────────────────────────────

def _summarize(text: str, max_len: int = 150) -> str:
    """Extract a short summary from an agent's response for SSE display."""
    if not text:
        return ""
    # Take first meaningful line that isn't a heading/header
    lines = text.strip().split("\n")
    summary = ""
    for line in lines:
        clean = line.strip().strip("#").strip("*").strip("-").strip()
        if len(clean) > 20:
            summary = clean
            break
    if not summary:
        summary = text.strip()
    if len(summary) > max_len:
        summary = summary[:max_len].rsplit(" ", 1)[0] + "..."
    return summary

# ── node functions ──────────────────────────────────────

def ceo_node(state: StartupState) -> StartupState:
    job_id = state.get("job_id", "")
    round_num = state["iteration"] + 1
    print(f"\n🤖 CEO Agent thinking... (round {round_num})\n")

    event_bus.publish(job_id, {"type": "agent_start", "agent": "CEO", "round": round_num})

    agent = CEOAgent()
    response = agent.think(state)
    
    state["messages"].append({
        "agent": "CEO",
        "round": state["iteration"],
        "message": response
    })

    event_bus.publish(job_id, {
        "type": "agent_done",
        "agent": "CEO",
        "round": round_num,
        "summary": _summarize(response)
    })

    return state

def finance_node(state: StartupState) -> StartupState:
    job_id = state.get("job_id", "")
    round_num = state["iteration"] + 1
    print(f"💰 Finance Agent thinking... (round {round_num})\n")

    event_bus.publish(job_id, {"type": "agent_start", "agent": "Finance", "round": round_num})

    agent = FinanceAgent()
    response = agent.think(state)
    
    state["messages"].append({
        "agent": "Finance",
        "round": state["iteration"],
        "message": response
    })

    event_bus.publish(job_id, {
        "type": "agent_done",
        "agent": "Finance",
        "round": round_num,
        "summary": _summarize(response)
    })

    return state

def marketing_node(state: StartupState) -> StartupState:
    job_id = state.get("job_id", "")
    print("📣 Marketing Agent thinking...\n")

    event_bus.publish(job_id, {"type": "agent_start", "agent": "Marketing", "round": state["iteration"]})

    agent = MarketingAgent()
    response = agent.think(state)
    state["messages"].append({
        "agent": "Marketing",
        "round": state["iteration"],
        "message": response
    })

    event_bus.publish(job_id, {
        "type": "agent_done",
        "agent": "Marketing",
        "round": state["iteration"],
        "summary": _summarize(response)
    })

    return state

def product_node(state: StartupState) -> StartupState:
    job_id = state.get("job_id", "")
    print("🛠️ Product Agent thinking...\n")

    event_bus.publish(job_id, {"type": "agent_start", "agent": "Product", "round": state["iteration"]})

    agent = ProductAgent()
    response = agent.think(state)
    state["messages"].append({
        "agent": "Product",
        "round": state["iteration"],
        "message": response
    })

    event_bus.publish(job_id, {
        "type": "agent_done",
        "agent": "Product",
        "round": state["iteration"],
        "summary": _summarize(response)
    })

    return state

def sales_node(state: StartupState) -> StartupState:
    job_id = state.get("job_id", "")
    print("🤝 Sales Agent thinking...\n")

    event_bus.publish(job_id, {"type": "agent_start", "agent": "Sales", "round": state["iteration"]})

    agent = SalesAgent()
    response = agent.think(state)
    state["messages"].append({
        "agent": "Sales",
        "round": state["iteration"],
        "message": response
    })

    event_bus.publish(job_id, {
        "type": "agent_done",
        "agent": "Sales",
        "round": state["iteration"],
        "summary": _summarize(response)
    })

    return state

def supervisor_node(state: StartupState) -> StartupState:
    job_id = state.get("job_id", "")
    round_num = state["iteration"] + 1
    print("🎯 Supervisor checking consensus...\n")

    event_bus.publish(job_id, {"type": "agent_start", "agent": "Supervisor", "round": round_num})

    agent = SupervisorAgent()
    result = agent.evaluate(state)
    
    # supervisor returns structured decision
    state["ceo_finance_agreed"] = result["agreed"]
    state["iteration"] = state["iteration"] + 1
    
    if result.get("conflicts"):
        state["conflicts"].extend(result["conflicts"])
    
    if result.get("decisions"):
        state["decisions"].extend(result["decisions"])

    # Determine if consensus is being forced
    forced = False
    if not result["agreed"] and state["iteration"] >= state["max_iterations"]:
        forced = True

    event_bus.publish(job_id, {
        "type": "supervisor_result",
        "agent": "Supervisor",
        "round": round_num,
        "agreed": result["agreed"],
        "reason": result.get("reason", ""),
        "conflicts": result.get("conflicts", []),
        "decisions": result.get("decisions", []),
        "forced": forced
    })

    return state

def report_node(state: StartupState) -> StartupState:
    job_id = state.get("job_id", "")
    print("📊 Generating final report...\n")

    event_bus.publish(job_id, {"type": "agent_start", "agent": "Report", "round": state["iteration"]})

    report = generate_report(state)
    state["final_report"] = report
    
    print("🧱 Extracting structured business plan...\n")
    business_plan = extract_structured_plan(report, state["startup_idea"])
    
    save_state(state, report, business_plan)
    
    if business_plan:
        state["business_plan"] = business_plan.model_dump()

    event_bus.publish(job_id, {
        "type": "agent_done",
        "agent": "Report",
        "round": state["iteration"],
        "summary": "Final report generated and business plan extracted."
    })

    return state

# ── routing functions ────────────────────────────────────

def should_debate_more(state: StartupState) -> str:
    """
    After supervisor checks CEO + Finance:
    - if agreed → move to Marketing
    - if not agreed AND rounds left → loop back to CEO
    - if not agreed AND max rounds hit → force move on
    """
    job_id = state.get("job_id", "")

    if state["ceo_finance_agreed"]:
        print("✅ CEO + Finance agreed. Moving to Marketing.\n")
        return "agreed"
    
    if state["iteration"] >= state["max_iterations"]:
        print("⚠️ Max debate rounds hit. Forcing consensus.\n")
        return "agreed"
    
    print(f"🔄 No consensus yet. Round {state['iteration'] + 1} starting.\n")

    event_bus.publish(job_id, {
        "type": "debate_loop",
        "round": state["iteration"] + 1,
        "reason": "CEO and Finance have not reached consensus. Starting another round."
    })

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

def run(idea: str, context: dict = None, job_id: str = ""):
    if context is None:
        context = {}
    
    state = create_state(
        idea=idea,
        target_audience=context.get("target_audience", ""),
        market=context.get("market", ""),
        revenue_model=context.get("revenue_model", ""),
        constraints=context.get("constraints", ""),
        job_id=job_id
    )
    print("\n🔍 DEBUG STATE:", {
    "market": state.get("market"),
    "target_audience": state.get("target_audience"),
    "revenue_model": state.get("revenue_model"),
    "constraints": state.get("constraints")
}, "\n")
    
    app = build_graph()
    
    final_state = app.invoke(state)

    # Emit job_done event
    event_bus.publish(job_id, {"type": "job_done"})
    
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