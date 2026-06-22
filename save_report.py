import json
import os
from datetime import datetime

def save_state(state: dict, report: str, business_plan=None):
    os.makedirs("outputs", exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    idea_slug = state["startup_idea"][:20].replace(" ", "_").lower()
    filename = f"outputs/{idea_slug}_{timestamp}"
    
    state_with_report = {**state, "final_report": report}
    with open(f"{filename}.json", "w", encoding="utf-8") as f:
        json.dump(state_with_report, f, indent=2, ensure_ascii=False)
    
    with open(f"{filename}.txt", "w", encoding="utf-8") as f:
        f.write(report)
    
    print(f"\n[SAVE] Saved to: {filename}.json")
    print(f"[REPORT] Report saved to: {filename}.txt")
    
    if business_plan is not None:
        plan_path = f"{filename}_plan.json"
        with open(plan_path, "w", encoding="utf-8") as f:
            f.write(business_plan.model_dump_json(indent=2))
        print(f"[STRUCTURED] Structured plan saved to: {plan_path}")
    
    return filename