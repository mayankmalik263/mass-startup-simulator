# MASS — Multi-Agent Startup Simulator

> One sentence in. Five agents debate. A complete startup plan comes out.

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)
![LangGraph](https://img.shields.io/badge/Orchestration-LangGraph-green.svg)
![OpenRouter](https://img.shields.io/badge/LLM-OpenRouter-orange.svg)

---

## What this is

MASS is a Python system that simulates a startup founding team as AI agents. You give it one idea. It runs a structured debate between five domain experts, each one reading what the others said and reacting to it, until they reach consensus on a business plan.

It is not a template filler. The Finance agent challenges the CEO's budget assumptions. The Product agent cuts features Finance says they can't afford. The Sales agent calls out when Marketing's CAC numbers don't hold up. A Supervisor agent watches all of it, routes disagreements back for another round, and calls consensus when the team is aligned.

The output is a full startup brief, saved as JSON and plain text, covering mission, pricing, roadmap, financial snapshot, revenue targets, key conflicts, and a final verdict on viability.

---

## How the debate works

```
You type: "Launch a fitness app"
                ↓
         Orchestrator (LangGraph)
                ↓
          ┌─── CEO proposes vision
          │         ↓
          │    Finance reacts, challenges numbers
          │         ↓
          │    Supervisor checks: did they agree?
          │         │
          │    NO ──┘  (loop back, max 3 rounds)
          │         │
          │    YES ──────────────────────────────┐
          │                                      ↓
          │                              Marketing reacts
          │                                      ↓
          │                              Product scopes MVP
          │                                      ↓
          │                              Sales closes the loop
          └──────────────────────────────────────┓
                                                 ↓
                                        Final Report Generator
                                                 ↓
                              outputs/your_idea_timestamp.json
                              outputs/your_idea_timestamp.txt
```

Agents share one central memory object called `state`. Nobody calls anyone directly. They read from state, write to state, and the next agent picks up where the last one left off.

```python
class StartupState(TypedDict):
    startup_idea: str
    messages: list          # full debate transcript
    decisions: list         # what got agreed on
    conflicts: list         # what agents disagreed about
    iteration: int          # which debate round we're on
    ceo_finance_agreed: bool
    final_report: str
```

---

## What a real run looks like

```bash
python main.py
# Enter startup idea: Launch a fitness app

# 🤖 CEO Agent thinking... (round 1)
# 💰 Finance Agent thinking... (round 1)
# 🎯 Supervisor checking consensus...
#   Supervisor verdict: ❌ NOT AGREED
#   Reason: CEO wants ML engine, Finance says budget doesn't support it

# 🔄 No consensus yet. Round 2 starting.

# 🤖 CEO Agent thinking... (round 2)
# 💰 Finance Agent thinking... (round 2)
# 🎯 Supervisor checking consensus...
#   Supervisor verdict: ✅ AGREED
#   Reason: CEO accepted rule-based MVP first

# ✅ CEO + Finance agreed. Moving to Marketing.

# 📣 Marketing Agent thinking...
# 🛠️  Product Agent thinking...
# 🤝 Sales Agent thinking...
# 📊 Generating final report...

# Messages logged: 9
# Debate rounds: 2
# Conflicts detected: 6
```

The output covers ten sections: mission, the core problem, target customer, business model with pricing tiers, financial snapshot, first 30-day go-to-market plan, MVP feature list, revenue targets at Day 30/60/90, key conflicts detected between agents, and a final verdict.

---

## Project structure

```
MASS/
├── agents/
│   ├── __init__.py
│   ├── ceo_agent.py
│   ├── finance_agent.py
│   ├── marketing_agent.py
│   ├── product_agent.py
│   ├── sales_agent.py
│   └── supervisor_agent.py     ← Phase 2: debate controller
├── outputs/                    ← saved JSON + TXT reports
├── .env                        ← API key (never committed)
├── .env.example
├── .gitignore
├── graph_orchestrator.py       ← Phase 2: LangGraph state machine
├── main.py
├── orchestrator.py             ← Phase 1: sequential pipeline (kept)
├── report_generator.py
├── requirements.txt
├── save_report.py
├── state.py
└── LICENSE
```

---

## Setup

```bash
git clone https://github.com/mayankmalik263/Mass-Multi-Agent-STARTUP-Simulator-
cd Mass-Multi-Agent-STARTUP-Simulator-

python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

pip install -r requirements.txt

cp .env.example .env
# Add your OpenRouter API key to .env

python main.py
```

---

## Tech stack

| Layer | Tool |
|---|---|
| Agent orchestration | LangGraph (state machine with conditional edges) |
| LLM calls | OpenRouter (OpenAI-compatible, free models) |
| Shared state | Python TypedDict |
| Output format | JSON + plain text |
| API layer | FastAPI (planned) |
| Frontend | Next.js (planned) |

---

## Phase 1 vs Phase 2

**Phase 1** was a sequential pipeline. Each agent spoke once, in a fixed order, and that was it. No pushback, no revision, no routing.

**Phase 2** replaced that with a LangGraph state machine. The CEO and Finance agent now negotiate across multiple rounds before Marketing even speaks. A Supervisor agent watches the debate, detects when they're stuck, and either routes them back for another round or forces consensus if they hit the iteration limit. Conflicts get logged. Decisions get recorded. The final report reflects what actually got agreed on, not just what each agent said in isolation.

The debate loop is capped at 3 rounds by default to keep costs and runtime reasonable. That limit is configurable.

---

## What's planned next

**Pydantic structured output** — right now agents return free-form text. The next step is wrapping each output in a validated Pydantic model so the business plan is a typed Python object you can query and version.

**FastAPI endpoint** — expose the simulator as a REST API. Send a POST request with a startup idea, get back a structured business plan as JSON.

**Live frontend** — a Next.js interface where you can watch the agents debate in real time as tokens stream in.

---

## Why this project exists

Most college projects are CRUD apps, ML models in Flask, or todo lists. This one is different.

Multi-agent systems are how real AI products are being built right now. Companies like Harvey, Cognition, and most serious LLM startups are running systems where multiple agents with different roles coordinate, debate, and produce structured outputs together. MASS is a ground-up implementation of that pattern, built without relying on frameworks to hide what's actually happening.

The goal was to understand how agent communication works, why shared state matters, what makes a supervisor pattern useful, and how to structure a system that produces consistent output across unpredictable LLM responses. Every architectural decision here was made by hand.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

Copyright (c) 2026 Mayank Malik

---

## Ownership

All original work belongs to Mayank Malik. AI was used as a learning tool and for boilerplate. The architecture decisions, state design, agent boundaries, debate logic, and conflict-handling were built manually.