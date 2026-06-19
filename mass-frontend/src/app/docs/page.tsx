import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documentation | MASS',
  description:
    'Complete documentation for MASS — Multi-Agent Startup Simulator. Architecture, API reference, agent details, and setup guide.',
};

/* ─── Agent data ─────────────────────────────────── */
const agents = [
  {
    name: 'CEO Agent',
    icon: 'person_apron',
    emoji: '🤖',
    persona: 'Steve Jobs + Elon Musk',
    role: 'Sets the startup direction, defines the mission, identifies the problem, names competitors, and makes strategic decisions. Applies first-principles thinking (Musk) and simplicity filtering (Jobs).',
  },
  {
    name: 'Finance Agent',
    icon: 'payments',
    emoji: '💰',
    persona: 'Naval Ravikant',
    role: 'Challenges the CEO on pricing, burn rate, runway, and financial feasibility. Pushes back on unrealistic projections and ensures the numbers work for the given constraints.',
  },
  {
    name: 'Supervisor Agent',
    icon: 'hub',
    emoji: '🎯',
    persona: 'Strict consensus evaluator',
    role: 'Checks whether CEO and Finance have truly agreed. Runs violation checks against user constraints (e.g., bootstrap, India market). Only passes the plan forward if both sides lock on the same numbers.',
  },
  {
    name: 'Marketing Agent',
    icon: 'campaign',
    emoji: '📣',
    persona: 'Alex Hormozi',
    role: 'Designs the go-to-market strategy for the first 30 days. Focuses on customer acquisition channels, messaging, and growth tactics suited to the target audience.',
  },
  {
    name: 'Product Agent',
    icon: 'inventory_2',
    emoji: '🛠️',
    persona: 'Brian Chesky (Airbnb)',
    role: 'Defines the MVP scope. Decides what to build and what to cut. Focuses on the core user experience that can ship fast with minimal resources.',
  },
  {
    name: 'Sales Agent',
    icon: 'trending_up',
    emoji: '🤝',
    persona: 'Jason Lemkin (SaaStr)',
    role: 'Sets revenue targets, designs the sales funnel, and defines pricing tiers. Projects Day 30/60/90 MRR goals based on the business model.',
  },
];

/* ─── API endpoints ──────────────────────────────── */
const endpoints = [
  {
    method: 'GET',
    path: '/',
    description: 'Health check — returns API status.',
    response: '{ "status": "MASS API running", "docs": "/docs" }',
  },
  {
    method: 'POST',
    path: '/simulate',
    description: 'Start a new simulation. Returns a job ID for tracking.',
    body: '{\n  "idea": "AI resume builder for students",\n  "target_audience": "college students",\n  "market": "India",\n  "revenue_model": "freemium",\n  "constraints": "bootstrapped"\n}',
    response: '{ "job_id": "abc-123", "status": "pending" }',
  },
  {
    method: 'GET',
    path: '/simulate/{job_id}',
    description: 'Poll job status. Returns results when done.',
    response: '{\n  "job_id": "abc-123",\n  "status": "done",\n  "result": {\n    "final_report": "...",\n    "business_plan": { ... },\n    "debate_rounds": 2,\n    "messages_count": 8\n  }\n}',
  },
  {
    method: 'GET',
    path: '/simulate/{job_id}/stream',
    description: 'SSE stream of real-time agent activity events.',
    response: 'data: {"type":"agent_start","agent":"CEO","round":1}\ndata: {"type":"agent_done","agent":"CEO","summary":"..."}\ndata: {"type":"supervisor_result","agreed":false,...}\ndata: {"type":"debate_loop","round":2}\ndata: {"type":"job_done"}',
  },
];

const techStack = [
  { layer: 'Agent Orchestration', tool: 'LangGraph state machine' },
  { layer: 'LLM Access', tool: 'OpenRouter (OpenAI-compatible)' },
  { layer: 'Backend', tool: 'Python + FastAPI' },
  { layer: 'Real-time Streaming', tool: 'Server-Sent Events (SSE)' },
  { layer: 'Frontend', tool: 'Next.js 16, Tailwind CSS v4, TypeScript' },
  { layer: 'Shared State', tool: 'TypedDict' },
  { layer: 'Structured Output', tool: 'Pydantic models' },
  { layer: 'Output Formats', tool: 'JSON, TXT, structured plan' },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen">
      {/* Nav bar */}
      <header className="fixed top-0 w-full z-50 bg-background border-b border-outline-variant">
        <nav className="flex justify-between items-center px-margin-desktop py-md max-w-[80rem] mx-auto">
          <Link href="/" className="font-display text-xl text-primary tracking-tighter font-extrabold uppercase">
            MASS
          </Link>
          <div className="flex items-center gap-md">
            <a
              href="https://github.com/mayankmalik263/MASS"
              target="_blank"
              rel="noopener noreferrer"
              className="font-label-mono text-on-surface-variant hover:text-primary transition-colors text-xs"
            >
              GitHub ↗
            </a>
            <Link href="/" className="font-label-mono text-on-surface-variant hover:text-primary transition-colors">
              ← Back
            </Link>
          </div>
        </nav>
      </header>

      <main className="pt-[120px] pb-2xl px-margin-mobile md:px-margin-desktop max-w-[64rem] mx-auto">
        {/* Page header */}
        <div className="mb-2xl">
          <div className="font-label-mono text-primary text-xs mb-sm uppercase tracking-widest">Documentation</div>
          <h1 className="font-display text-[48px] md:text-[64px] font-extrabold tracking-tighter mb-md leading-tight">
            MASS Docs
          </h1>
          <p className="font-body-lg text-on-surface-variant max-w-[42rem]">
            Everything you need to understand how MASS works, from the agent architecture to the API reference.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="border border-outline-variant bg-surface-container-lowest p-lg mb-2xl">
          <h2 className="font-label-mono text-primary mb-md uppercase text-sm">Table of Contents</h2>
          <nav className="grid grid-cols-1 md:grid-cols-2 gap-xs">
            {[
              ['#overview', 'Overview'],
              ['#how-it-works', 'How It Works'],
              ['#agents', 'The Agent Council'],
              ['#tech-stack', 'Tech Stack'],
              ['#api', 'API Reference'],
              ['#sse', 'Real-Time SSE Events'],
              ['#setup', 'Getting Started'],
              ['#license', 'License & Ownership'],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="font-body-sm text-on-surface-variant hover:text-primary transition-colors flex items-center gap-xs py-xs"
              >
                <span className="text-primary">→</span> {label}
              </a>
            ))}
          </nav>
        </div>

        <div className="space-y-2xl">
          {/* ═══ OVERVIEW ═══ */}
          <section id="overview">
            <SectionHeader icon="info" title="Overview" />
            <div className="border border-outline-variant bg-surface-container-lowest p-lg">
              <p className="font-body-sm text-on-surface-variant leading-relaxed mb-md">
                MASS is a multi-agent startup simulator that turns a single business idea into a structured
                founder-style debate. Instead of generating a one-shot answer, it runs the idea through specialized
                AI agents — CEO, Finance, Marketing, Product, Sales — and a Supervisor that checks whether the team
                has actually reached workable consensus.
              </p>
              <p className="font-body-sm text-on-surface-variant leading-relaxed mb-md">
                The result is a practical startup brief covering: mission, problem statement, target customer,
                business model, financial snapshot, go-to-market plan, MVP scope, revenue targets, key conflicts,
                and a final verdict.
              </p>
              <p className="font-body-sm text-on-surface-variant leading-relaxed">
                The project ships with a <strong className="text-on-surface">Python backend</strong> (LangGraph +
                FastAPI) for multi-agent orchestration and a <strong className="text-on-surface">Next.js frontend</strong>{' '}
                with a terminal-inspired dark UI where users can submit ideas, watch agents debate in real time via SSE,
                and view structured results.
              </p>
            </div>
          </section>

          {/* ═══ HOW IT WORKS ═══ */}
          <section id="how-it-works">
            <SectionHeader icon="account_tree" title="How It Works" />
            <div className="border border-outline-variant bg-surface-container-lowest p-lg">
              <p className="font-body-sm text-on-surface-variant leading-relaxed mb-lg">
                The simulation follows a LangGraph state machine with conditional branching:
              </p>

              {/* Flow diagram */}
              <div className="bg-black border border-outline-variant p-lg font-mono text-xs overflow-x-auto mb-lg">
                <div className="text-outline mb-sm">// Agent execution flow</div>
                <div className="space-y-xs">
                  <div><span className="text-primary">USER</span> <span className="text-outline">──→</span> Submit startup idea + context</div>
                  <div className="text-outline">  │</div>
                  <div><span className="text-primary">CEO</span> <span className="text-outline">──→</span> Vision, mission, competition, strategy</div>
                  <div className="text-outline">  │</div>
                  <div><span className="text-primary">FINANCE</span> <span className="text-outline">──→</span> Pricing, burn rate, runway, feasibility</div>
                  <div className="text-outline">  │</div>
                  <div><span className="text-primary">SUPERVISOR</span> <span className="text-outline">──→</span> Consensus check</div>
                  <div className="text-outline">  │</div>
                  <div className="text-on-surface-variant">  ├── <span className="text-error">NO</span> consensus + rounds left → <span className="text-tertiary">loop back to CEO</span></div>
                  <div className="text-on-surface-variant">  ├── <span className="text-error">NO</span> consensus + max rounds (3) → <span className="text-tertiary">force move on</span></div>
                  <div className="text-on-surface-variant">  └── <span className="text-primary">YES</span> consensus → continue</div>
                  <div className="text-outline">  │</div>
                  <div><span className="text-primary">MARKETING</span> <span className="text-outline">──→</span> Go-to-market strategy (30 days)</div>
                  <div className="text-outline">  │</div>
                  <div><span className="text-primary">PRODUCT</span> <span className="text-outline">──→</span> MVP scope and features</div>
                  <div className="text-outline">  │</div>
                  <div><span className="text-primary">SALES</span> <span className="text-outline">──→</span> Revenue targets and pricing tiers</div>
                  <div className="text-outline">  │</div>
                  <div><span className="text-primary">REPORT</span> <span className="text-outline">──→</span> Final report + structured business plan</div>
                </div>
              </div>

              <p className="font-body-sm text-on-surface-variant leading-relaxed">
                All agents read from and write to one shared state object. This keeps the workflow deterministic
                enough to inspect, while still allowing the LLMs to debate and revise their positions.
              </p>
            </div>
          </section>

          {/* ═══ AGENTS ═══ */}
          <section id="agents">
            <SectionHeader icon="groups" title="The Agent Council" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              {agents.map((agent) => (
                <div key={agent.name} className="border border-outline-variant bg-surface-container-lowest p-lg">
                  <div className="flex items-center gap-sm mb-md">
                    <span className="material-symbols-outlined text-primary text-[24px]">{agent.icon}</span>
                    <div>
                      <div className="font-label-mono text-on-surface text-sm">{agent.name}</div>
                      <div className="font-label-mono text-[10px] text-outline">Persona: {agent.persona}</div>
                    </div>
                  </div>
                  <p className="font-body-sm text-on-surface-variant leading-relaxed">{agent.role}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ═══ TECH STACK ═══ */}
          <section id="tech-stack">
            <SectionHeader icon="code" title="Tech Stack" />
            <div className="border border-outline-variant bg-surface-container-lowest overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-container-low">
                    <th className="font-label-mono text-primary text-xs text-left p-md uppercase">Layer</th>
                    <th className="font-label-mono text-primary text-xs text-left p-md uppercase">Technology</th>
                  </tr>
                </thead>
                <tbody>
                  {techStack.map((row, i) => (
                    <tr key={row.layer} className={i % 2 === 0 ? '' : 'bg-surface-container-low/30'}>
                      <td className="font-label-mono text-on-surface text-xs p-md">{row.layer}</td>
                      <td className="font-body-sm text-on-surface-variant p-md">{row.tool}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ═══ API REFERENCE ═══ */}
          <section id="api">
            <SectionHeader icon="api" title="API Reference" />
            <div className="space-y-md">
              {endpoints.map((ep) => (
                <div key={ep.path} className="border border-outline-variant bg-surface-container-lowest p-lg">
                  <div className="flex items-center gap-sm mb-md">
                    <span className={`font-label-mono text-xs px-sm py-[2px] border ${
                      ep.method === 'GET'
                        ? 'text-primary border-primary/30 bg-primary/10'
                        : 'text-tertiary border-tertiary/30 bg-tertiary/10'
                    }`}>
                      {ep.method}
                    </span>
                    <code className="font-mono text-on-surface text-sm">{ep.path}</code>
                  </div>
                  <p className="font-body-sm text-on-surface-variant mb-md">{ep.description}</p>

                  {ep.body && (
                    <div className="mb-md">
                      <div className="font-label-mono text-[10px] text-outline mb-xs uppercase">Request Body</div>
                      <pre className="bg-black border border-outline-variant p-md font-mono text-[11px] text-on-surface-variant overflow-x-auto">
                        {ep.body}
                      </pre>
                    </div>
                  )}

                  <div>
                    <div className="font-label-mono text-[10px] text-outline mb-xs uppercase">Response</div>
                    <pre className="bg-black border border-outline-variant p-md font-mono text-[11px] text-on-surface-variant overflow-x-auto">
                      {ep.response}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ═══ SSE EVENTS ═══ */}
          <section id="sse">
            <SectionHeader icon="stream" title="Real-Time SSE Events" />
            <div className="border border-outline-variant bg-surface-container-lowest p-lg">
              <p className="font-body-sm text-on-surface-variant leading-relaxed mb-lg">
                Connect to <code className="font-mono text-primary text-xs">GET /simulate/&#123;job_id&#125;/stream</code>{' '}
                to receive real-time agent activity events via Server-Sent Events:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-outline-variant">
                      <th className="font-label-mono text-primary text-[10px] text-left p-sm uppercase">Event</th>
                      <th className="font-label-mono text-primary text-[10px] text-left p-sm uppercase">When</th>
                      <th className="font-label-mono text-primary text-[10px] text-left p-sm uppercase">Key Fields</th>
                    </tr>
                  </thead>
                  <tbody className="font-body-sm text-on-surface-variant">
                    <tr className="border-b border-outline-variant/30">
                      <td className="p-sm"><code className="font-mono text-xs">agent_start</code></td>
                      <td className="p-sm">Agent begins thinking</td>
                      <td className="p-sm">agent, round</td>
                    </tr>
                    <tr className="border-b border-outline-variant/30">
                      <td className="p-sm"><code className="font-mono text-xs">agent_done</code></td>
                      <td className="p-sm">Agent finishes</td>
                      <td className="p-sm">agent, round, summary</td>
                    </tr>
                    <tr className="border-b border-outline-variant/30">
                      <td className="p-sm"><code className="font-mono text-xs">supervisor_result</code></td>
                      <td className="p-sm">Supervisor verdict</td>
                      <td className="p-sm">agreed, reason, conflicts, forced</td>
                    </tr>
                    <tr className="border-b border-outline-variant/30">
                      <td className="p-sm"><code className="font-mono text-xs">debate_loop</code></td>
                      <td className="p-sm">Looping back to CEO</td>
                      <td className="p-sm">round, reason</td>
                    </tr>
                    <tr className="border-b border-outline-variant/30">
                      <td className="p-sm"><code className="font-mono text-xs">job_done</code></td>
                      <td className="p-sm">Simulation complete</td>
                      <td className="p-sm">—</td>
                    </tr>
                    <tr>
                      <td className="p-sm"><code className="font-mono text-xs">job_error</code></td>
                      <td className="p-sm">Simulation failed</td>
                      <td className="p-sm">error</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* ═══ GETTING STARTED ═══ */}
          <section id="setup">
            <SectionHeader icon="terminal" title="Getting Started" />
            <div className="border border-outline-variant bg-surface-container-lowest p-lg space-y-lg">
              <div>
                <h3 className="font-label-mono text-on-surface text-sm mb-sm">Prerequisites</h3>
                <ul className="font-body-sm text-on-surface-variant space-y-xs ml-md">
                  <li className="flex items-start gap-xs"><span className="text-primary">→</span> Python 3.10+</li>
                  <li className="flex items-start gap-xs"><span className="text-primary">→</span> Node.js 18+</li>
                  <li className="flex items-start gap-xs"><span className="text-primary">→</span> An OpenRouter API key</li>
                </ul>
              </div>

              <div>
                <h3 className="font-label-mono text-on-surface text-sm mb-sm">Backend Setup</h3>
                <pre className="bg-black border border-outline-variant p-md font-mono text-[11px] text-on-surface-variant overflow-x-auto">
{`git clone https://github.com/mayankmalik263/MASS.git
cd MASS

python -m venv venv
venv\\Scripts\\activate        # Windows
# source venv/bin/activate   # macOS/Linux

pip install -r requirements.txt

copy .env.example .env
# Add your OPENROUTER_API_KEY to .env`}
                </pre>
              </div>

              <div>
                <h3 className="font-label-mono text-on-surface text-sm mb-sm">Frontend Setup</h3>
                <pre className="bg-black border border-outline-variant p-md font-mono text-[11px] text-on-surface-variant overflow-x-auto">
{`cd mass-frontend
npm install`}
                </pre>
              </div>

              <div>
                <h3 className="font-label-mono text-on-surface text-sm mb-sm">Running the App</h3>
                <pre className="bg-black border border-outline-variant p-md font-mono text-[11px] text-on-surface-variant overflow-x-auto">
{`# Terminal 1 — Start the API server
uvicorn api:app --reload

# Terminal 2 — Start the frontend
cd mass-frontend
npm run dev`}
                </pre>
                <p className="font-body-sm text-on-surface-variant mt-sm">
                  Then open <code className="font-mono text-primary text-xs">http://localhost:3000</code> in your browser.
                </p>
              </div>
            </div>
          </section>

          {/* ═══ LICENSE & OWNERSHIP ═══ */}
          <section id="license">
            <SectionHeader icon="gavel" title="License & Ownership" />
            <div className="space-y-md">
              <div className="border border-primary/30 bg-primary/5 p-lg">
                <h3 className="font-label-mono text-primary mb-md uppercase text-sm">Ownership</h3>
                <p className="font-body-sm text-on-surface-variant leading-relaxed mb-md">
                  MASS — Multi-Agent Startup Simulator — is the original work of{' '}
                  <strong className="text-primary">Mayank Malik</strong>. The architecture, agent boundaries, debate
                  flow, prompt engineering, state design, and UI were developed by Mayank Malik. AI tools were used as
                  a productivity aid during development.
                </p>
                <p className="font-body-sm text-on-surface-variant leading-relaxed">
                  <strong className="text-on-surface">Copyright © 2026 Mayank Malik. All rights reserved.</strong>
                </p>
              </div>

              <div className="border border-outline-variant bg-surface-container-lowest p-lg">
                <h3 className="font-label-mono text-primary mb-md uppercase text-sm">MIT License</h3>
                <p className="font-body-sm text-on-surface-variant leading-relaxed mb-md">
                  This project is licensed under the MIT License. You are free to use, modify, and distribute
                  the code provided that:
                </p>
                <ul className="font-body-sm text-on-surface-variant space-y-xs ml-md mb-md">
                  <li className="flex items-start gap-xs">
                    <span className="text-primary mt-[2px]">→</span>
                    The original copyright notice and license text are included in all copies.
                  </li>
                  <li className="flex items-start gap-xs">
                    <span className="text-primary mt-[2px]">→</span>
                    Proper attribution to Mayank Malik as the original author is maintained.
                  </li>
                </ul>
                <p className="font-body-sm text-on-surface-variant leading-relaxed">
                  See the full license text in the{' '}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{' '}
                  or the{' '}
                  <a href="https://github.com/mayankmalik263/MASS/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    LICENSE file on GitHub
                  </a>.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* ─── Reusable section header ────────────────────── */
function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-sm mb-lg">
      <span className="material-symbols-outlined text-primary text-[24px]">{icon}</span>
      <h2 className="font-display text-2xl font-extrabold tracking-tight">{title}</h2>
    </div>
  );
}
