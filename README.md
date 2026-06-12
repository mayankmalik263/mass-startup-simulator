# MASS — Multi-Agent Startup Simulator

> One prompt. Five agents. A full startup plan.

```
"Launch a fitness app"
         ↓
  ┌──────────────┐
  │  Orchestrator │
  └──────┬───────┘
         │
    ┌────▼────┐
    │   CEO   │ → defines vision, mission, target customer
    └────┬────┘
         │
    ┌────▼──────┐
    │  Finance  │ → reads CEO → challenges numbers, sets burn rate
    └────┬──────┘
         │
    ┌────▼───────────┐
    │   Marketing    │ → reads CEO + Finance → builds GTM plan
    └────┬───────────┘
         │
    ┌────▼─────┐
    │  Product │ → reads all three → cuts scope, builds roadmap
    └────┬─────┘
         │
    ┌────▼──────┐
    │   Sales   │ → reads everyone → closes deals, sets revenue targets
    └────┬──────┘
         │
  ┌──────▼────────┐
  │  Final Report │ → clean business plan saved as JSON + TXT
  └───────────────┘
```

---

## What this project is

MASS is a Python system that simulates a startup founding team as AI agents. You give it one sentence. It gives you a complete business plan, written from five different expert perspectives, each one reacting to what the others said.

It is not a chatbot. It is not a template filler. Each agent reads the previous agents' outputs and builds on them, pushes back on them, or constrains them. The Finance agent challenges the CEO's timeline. The Product agent cuts features the Finance agent says they can't afford. The Sales agent calls out when Marketing's CAC assumptions don't hold up.

The result feels like a real internal company discussion, not a single generic answer.

---

## Why I built this

Almost nobody in college builds multi-agent systems. Most projects are CRUD apps, ML models wrapped in Flask, or todo lists with React. This is different.

This project taught me how real product decisions actually get made: not by one smart person, but by a team with competing constraints. The CEO wants the AI model. Finance says the budget doesn't support it. Product ships a rule-based fallback instead. That tension produces better decisions than any single agent thinking alone.

It is also a personal experiment in build-while-learning. The goal was never to use a framework and call it done. Every architectural decision here was made by hand, which means I actually understand why it works.

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
│   └── sales_agent.py
├── outputs/               ← saved JSON + TXT business plans
├── .env                   ← API key (never committed)
├── .env.example           ← template for setup
├── .gitignore
├── main.py                ← entry point
├── orchestrator.py        ← manages agent flow
├── report_generator.py    ← distills all outputs into final report
├── requirements.txt
├── save_report.py         ← saves state to disk
└── state.py               ← shared TypedDict memory
```

---

## How it works

Every agent shares one central memory object called `state`. It is a Python TypedDict that holds the startup idea, every agent's message, any agreed decisions, and the final report.

```python
class StartupState(TypedDict):
    startup_idea: str
    messages: list        # everything every agent said
    decisions: list       # what got agreed on
    final_report: str     # final distilled business plan
```

Agents don't call each other directly. They read from state and write to state. Like teammates leaving notes on a whiteboard, then reading what the others wrote before adding their own.

```python
# CEO reads the startup idea
idea = state["startup_idea"]

# Finance reads CEO's output
for msg in state["messages"]:
    if msg["agent"] == "CEO":
        ceo_message = msg["message"]

# Sales reads everyone
# (reads CEO, Finance, Marketing, Product all from state["messages"])
```

This is multi-agent communication without frameworks. One shared object. Clear boundaries. No magic.

---

## Tech stack

| Layer | Tool | Why |
|---|---|---|
| LLM calls | OpenAI-compatible via OpenRouter | Free models, same API across providers |
| State management | Python TypedDict | Type-safe shared memory |
| Output validation | Pydantic (Phase 2) | Structured business plan objects |
| Orchestration | Custom → LangGraph (Phase 2) | Start simple, add when complexity demands it |
| API layer | FastAPI (Phase 2) | Expose simulator as REST endpoint |
| Frontend | Next.js (Phase 2) | Watch agents debate live |
| Environment | python-dotenv | Keep API keys out of code |

---

## Current state (Phase 1 complete)

Phase 1 is a working CLI system. It runs in the terminal. It calls real LLM APIs. It produces real output.

```bash
python main.py
# Enter startup idea: Launch a fitness app

# 🤖 CEO Agent thinking...
# 💰 Finance Agent thinking...
# 📣 Marketing Agent thinking...
# 🛠️ Product Agent thinking...
# 🤝 Sales Agent thinking...
# 📊 Generating final report...

# outputs/launch_a_fitness_app_20260613.json ✓
# outputs/launch_a_fitness_app_20260613.txt  ✓
```

What comes out:

- Mission statement
- Target customer profile
- Business model with pricing tiers
- Financial snapshot (burn rate, runway, break-even)
- 30-day go-to-market plan
- MVP feature list (5 features, ruthlessly scoped)
- Revenue targets at Day 30, 60, 90
- Key conflicts detected between agents
- Final verdict on viability

The agents don't just agree with each other. The Finance agent told the CEO their 8-week ML timeline was unrealistic. The Sales agent called out that Marketing's CAC assumptions didn't match industry benchmarks. That pushback is what makes the output useful.

---

## What Phase 2 adds

Phase 1 is sequential. Each agent speaks once, in order. Phase 2 makes it dynamic.

```
Phase 1                          Phase 2
──────────────────────────       ──────────────────────────────────────
CEO → Finance → Marketing   →    CEO proposes
→ Product → Sales → Report       Finance pushes back
                                 CEO revises
                                 Finance approves
                                 → Marketing reacts
                                 → Product reacts
                                 → Sales reacts
                                 
                                 Supervisor detects conflict
                                 Routes back for resolution
                                 Consensus reached
                                 → Final structured report
```

Phase 2 components:

**Debate loop** — agents push back on each other across multiple rounds, not just once. CEO and Finance negotiate until they agree before Marketing even speaks.

**Supervisor agent** — a sixth agent whose only job is traffic control. It decides who speaks next, detects conflicts, routes disagreements back for resolution, and calls consensus when the team is aligned. This is the hardest part and the most impressive thing to build.

**Pydantic structured output** — instead of free-form text, each agent returns a validated object. The final business plan is a typed Python model with guaranteed fields.

**FastAPI endpoint** — the simulator becomes a REST API. Send a POST request with a startup idea, get back a full business plan JSON.

**Live frontend** — a Next.js interface where you can watch the agents debate in real time as the tokens stream in.

---

## Setup

```bash
# Clone the repo
git clone https://github.com/mayankmalik263/Mass-Multi-Agent-STARTUP-Simulator-
cd Mass-Multi-Agent-STARTUP-Simulator-

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Add your OpenRouter API key to .env

# Run
python main.py
```

---

## Output example

```
STARTUP PLAN: Launch a fitness app
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MISSION
Empower busy professionals to build lasting fitness habits through
calendar-aware micro-workouts that fit into any 5-minute gap in their day.

FINANCIAL SNAPSHOT
Monthly burn:     ~$106k
Funding needed:    $500k (pre-seed)
Runway:            ~6 months
Break-even:        ~9,000 paying users

KEY CONFLICTS DETECTED
1. CAC assumptions — Finance challenged Marketing's $15 CAC target
2. AI engine timeline — Product pushed back on 8-week ML build
3. Rewards marketplace — CEO wanted it at launch, Finance and Product said wait

FINAL VERDICT
Viable. The market need is clear and the MVP can ship in 8 weeks.
Success depends on keeping CAC under $30, closing at least one
enterprise pilot with cash upfront, and not touching ML until
there are 5k active users to train on.
```

---

## What this project covers technically

- Multi-agent architecture and communication
- Shared state design (TypedDict, later Pydantic)
- Sequential and cyclic agent orchestration
- Prompt engineering for distinct agent personas
- LLM API integration via OpenRouter
- Structured output and JSON persistence
- System design and component boundaries
- Conflict detection between agents
- Phase 2: LangGraph state machines and supervisor patterns
- Phase 2: FastAPI backend
- Phase 2: React frontend with streaming

---

## License and ownership

All original work in this repository belongs to Mayank Malik. AI was used as a learning tool and for boilerplate, not as the source of the core architecture, design decisions, or implementation logic. The decisions about how agents communicate, what state looks like, and how conflicts get resolved were made by hand.