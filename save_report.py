import json
import os
from datetime import datetime

def save_state(state: dict, report: str):
    os.makedirs("outputs", exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    idea_slug = state["startup_idea"][:20].replace(" ", "_").lower()
    filename = f"outputs/{idea_slug}_{timestamp}"
    
    state_with_report = {**state, "final_report": report}
    with open(f"{filename}.json", "w", encoding="utf-8") as f:
        json.dump(state_with_report, f, indent=2, ensure_ascii=False)
    
    with open(f"{filename}.txt", "w", encoding="utf-8") as f:
        f.write(report)
    
    print(f"\n💾 Saved to: {filename}.json")
    print(f"📄 Report saved to: {filename}.txt")
    
    return filename