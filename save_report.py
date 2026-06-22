import json
import os
from datetime import datetime
from supabase_client import get_supabase

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
    
    plan_dict = None
    if business_plan is not None:
        plan_dict = business_plan.model_dump(mode='json')
        plan_path = f"{filename}_plan.json"
        with open(plan_path, "w", encoding="utf-8") as f:
            f.write(business_plan.model_dump_json(indent=2))
        print(f"[STRUCTURED] Structured plan saved to: {plan_path}")
    
    # Save to Supabase
    job_id = state.get("job_id")
    if job_id:
        try:
            supabase = get_supabase()
            record = {
                "job_id": job_id,
                "idea": state.get("startup_idea", ""),
                "target_audience": state.get("target_audience", ""),
                "market": state.get("market", ""),
                "revenue_model": state.get("revenue_model", ""),
                "constraints": state.get("constraints", ""),
                "business_plan": plan_dict,
                "final_report": report
            }
            supabase.table("simulations").insert(record).execute()
            print(f"[SUPABASE] Simulation saved to database.")
        except Exception as e:
            print(f"[ERROR] Failed to save to Supabase: {e}")
            
    return filename