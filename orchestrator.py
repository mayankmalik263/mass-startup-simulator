from state import create_state
from agents.ceo_agent import CEOAgent
from agents.finance_agent import FinanceAgent
from agents.marketing_agent import MarketingAgent
from agents.product_agent import ProductAgent
from agents.sales_agent import SalesAgent
from report_generator import generate_report
from save_report import save_state

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
    
    # Finance reacts to CEO
    print("💰 Finance Agent thinking...\n")
    finance = FinanceAgent()
    finance_response = finance.think(state)
    state["messages"].append({
        "agent": "Finance",
        "message": finance_response
    })
    
    # Marketing reacts to CEO + Finance
    print("📣 Marketing Agent thinking...\n")
    marketing = MarketingAgent()
    marketing_response = marketing.think(state)
    state["messages"].append({
        "agent": "Marketing",
        "message": marketing_response
    })
    
    # Product reads everyone
    print("🛠️ Product Agent thinking...\n")
    product = ProductAgent()
    product_response = product.think(state)
    state["messages"].append({
        "agent": "Product",
        "message": product_response
    })
    
    # Sales reads everyone
    print("🤝 Sales Agent thinking...\n")
    sales = SalesAgent()
    sales_response = sales.think(state)
    state["messages"].append({
        "agent": "Sales",
        "message": sales_response
    })
    
    # Final report
    print("📊 Generating final report...\n")
    report = generate_report(state)
    state["final_report"] = report
    
    # print individual agents
    print("=" * 50)
    print("CEO ANALYSIS")
    print("=" * 50)
    print(ceo_response)
    
    print("\n" + "=" * 50)
    print("FINANCE ANALYSIS")
    print("=" * 50)
    print(finance_response)
    
    print("\n" + "=" * 50)
    print("MARKETING ANALYSIS")
    print("=" * 50)
    print(marketing_response)
    
    print("\n" + "=" * 50)
    print("PRODUCT ROADMAP")
    print("=" * 50)
    print(product_response)
    
    print("\n" + "=" * 50)
    print("SALES STRATEGY")
    print("=" * 50)
    print(sales_response)
    
    # print final report
    print("\n" + "=" * 50)
    print("FINAL STARTUP REPORT")
    print("=" * 50)
    print(report)
    
    # save everything
    save_state(state, report)
    
    print("\n📋 STATE SNAPSHOT:")
    print(f"Messages logged: {len(state['messages'])}")
    for msg in state["messages"]:
        print(f"  → {msg['agent']} spoke")
    
    return state