'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { startSimulation, getSimulationStatus } from '@/lib/api';
import type {
  SimulateRequest,
  SimulationJob,
  BusinessPlan,
} from '@/types/simulation';

/* ─── Agent display config ─────────────────────────── */
const AGENTS = [
  { name: 'CEO', icon: 'person_apron', emoji: '🤖' },
  { name: 'Finance', icon: 'payments', emoji: '💰' },
  { name: 'Supervisor', icon: 'hub', emoji: '🎯' },
  { name: 'Marketing', icon: 'campaign', emoji: '📣' },
  { name: 'Product', icon: 'inventory_2', emoji: '🛠️' },
  { name: 'Sales', icon: 'trending_up', emoji: '🤝' },
  { name: 'Report', icon: 'description', emoji: '📊' },
];

/* ─── Phase enum ───────────────────────────────────── */
type Phase = 'form' | 'running' | 'done' | 'error';

export default function SimulatePage() {
  /* Form state */
  const [form, setForm] = useState<SimulateRequest>({
    idea: '',
    target_audience: '',
    market: '',
    revenue_model: '',
    constraints: '',
  });

  /* Job state */
  const [phase, setPhase] = useState<Phase>('form');
  const [jobId, setJobId] = useState<string | null>(null);
  const [result, setResult] = useState<SimulationJob | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeAgent, setActiveAgent] = useState(0);

  /* ─── Polling ────────────────────────────────────── */
  const poll = useCallback(async (id: string) => {
    try {
      const job = await getSimulationStatus(id);

      if (job.status === 'done') {
        setResult(job);
        setPhase('done');
        return true; // stop polling
      }
      if (job.status === 'error') {
        setErrorMsg(job.error || 'Simulation failed');
        setPhase('error');
        return true;
      }
      return false; // keep polling
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Connection lost');
      setPhase('error');
      return true;
    }
  }, []);

  useEffect(() => {
    if (phase !== 'running' || !jobId) return;

    // Cycle agent indicator
    const agentTimer = setInterval(() => {
      setActiveAgent((prev) => (prev + 1) % AGENTS.length);
    }, 3000);

    // Poll every 2s
    const pollTimer = setInterval(async () => {
      const done = await poll(jobId);
      if (done) {
        clearInterval(pollTimer);
        clearInterval(agentTimer);
      }
    }, 2000);

    return () => {
      clearInterval(pollTimer);
      clearInterval(agentTimer);
    };
  }, [phase, jobId, poll]);

  /* ─── Submit ─────────────────────────────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.idea.trim()) return;

    setPhase('running');
    setActiveAgent(0);
    setErrorMsg('');

    try {
      const job = await startSimulation(form);
      setJobId(job.job_id);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to start simulation');
      setPhase('error');
    }
  };

  const handleReset = () => {
    setPhase('form');
    setJobId(null);
    setResult(null);
    setErrorMsg('');
    setForm({ idea: '', target_audience: '', market: '', revenue_model: '', constraints: '' });
  };

  /* ─── Render ─────────────────────────────────────── */
  return (
    <div className="min-h-screen">
      {/* Nav bar */}
      <header className="fixed top-0 w-full z-50 bg-background border-b border-outline-variant">
        <nav className="flex justify-between items-center px-margin-desktop py-md max-w-[80rem] mx-auto">
          <Link href="/" className="font-display text-xl text-primary tracking-tighter font-extrabold uppercase">
            MASS
          </Link>
          <div className="flex items-center gap-md">
            <Link href="/" className="font-label-mono text-on-surface-variant hover:text-primary transition-colors">
              ← Back
            </Link>
          </div>
        </nav>
      </header>

      <main className="pt-[120px] pb-2xl px-margin-mobile md:px-margin-desktop max-w-[64rem] mx-auto">
        {/* Page header */}
        <div className="mb-2xl text-center">
          <h1 className="font-display text-[48px] md:text-[64px] font-extrabold tracking-tighter mb-md leading-tight">
            {phase === 'form' && 'Launch Simulation'}
            {phase === 'running' && 'Agents Debating...'}
            {phase === 'done' && 'Simulation Complete'}
            {phase === 'error' && 'Simulation Error'}
          </h1>
          <p className="font-body-lg text-on-surface-variant max-w-[42rem] mx-auto">
            {phase === 'form' && 'Submit your startup idea and let the AI council analyze, debate, and produce a structured business plan.'}
            {phase === 'running' && 'Your idea is being stress-tested by 5 specialized AI agents. This takes about 60 seconds.'}
            {phase === 'done' && 'The council has reached consensus. Here\'s your structured startup plan.'}
            {phase === 'error' && 'Something went wrong during the simulation.'}
          </p>
        </div>

        {/* ═══ FORM PHASE ═══ */}
        {phase === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-lg">
            {/* Main idea */}
            <div className="border border-outline-variant bg-surface-container-lowest p-lg">
              <label className="font-label-mono text-primary mb-sm block uppercase">
                Startup Idea *
              </label>
              <textarea
                value={form.idea}
                onChange={(e) => setForm({ ...form, idea: e.target.value })}
                placeholder="Describe your startup idea in a few sentences..."
                required
                rows={4}
                className="w-full bg-transparent border-b border-outline focus:border-primary outline-none text-on-surface font-body-lg py-sm resize-none transition-colors placeholder:text-on-surface-variant/40"
              />
            </div>

            {/* Context fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div className="border border-outline-variant bg-surface-container-lowest p-lg">
                <label className="font-label-mono text-on-surface-variant mb-sm block uppercase text-[11px]">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={form.target_audience}
                  onChange={(e) => setForm({ ...form, target_audience: e.target.value })}
                  placeholder="e.g. college students, B2B SaaS teams"
                  className="w-full bg-transparent border-b border-outline focus:border-primary outline-none text-on-surface font-body-sm py-xs transition-colors placeholder:text-on-surface-variant/40"
                />
              </div>

              <div className="border border-outline-variant bg-surface-container-lowest p-lg">
                <label className="font-label-mono text-on-surface-variant mb-sm block uppercase text-[11px]">
                  Market / Geography
                </label>
                <input
                  type="text"
                  value={form.market}
                  onChange={(e) => setForm({ ...form, market: e.target.value })}
                  placeholder="e.g. India, US, global"
                  className="w-full bg-transparent border-b border-outline focus:border-primary outline-none text-on-surface font-body-sm py-xs transition-colors placeholder:text-on-surface-variant/40"
                />
              </div>

              <div className="border border-outline-variant bg-surface-container-lowest p-lg">
                <label className="font-label-mono text-on-surface-variant mb-sm block uppercase text-[11px]">
                  Revenue Model
                </label>
                <input
                  type="text"
                  value={form.revenue_model}
                  onChange={(e) => setForm({ ...form, revenue_model: e.target.value })}
                  placeholder="e.g. freemium, subscription, B2B enterprise"
                  className="w-full bg-transparent border-b border-outline focus:border-primary outline-none text-on-surface font-body-sm py-xs transition-colors placeholder:text-on-surface-variant/40"
                />
              </div>

              <div className="border border-outline-variant bg-surface-container-lowest p-lg">
                <label className="font-label-mono text-on-surface-variant mb-sm block uppercase text-[11px]">
                  Constraints
                </label>
                <input
                  type="text"
                  value={form.constraints}
                  onChange={(e) => setForm({ ...form, constraints: e.target.value })}
                  placeholder="e.g. bootstrapped, mobile-first"
                  className="w-full bg-transparent border-b border-outline focus:border-primary outline-none text-on-surface font-body-sm py-xs transition-colors placeholder:text-on-surface-variant/40"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-center pt-md">
              <button
                type="submit"
                className="bg-primary text-on-primary font-label-mono px-2xl py-md rounded border border-primary-container hover:brightness-125 transition-all text-base"
              >
                Start Simulation →
              </button>
            </div>
          </form>
        )}

        {/* ═══ RUNNING PHASE ═══ */}
        {phase === 'running' && (
          <div className="border border-outline-variant bg-surface-container-lowest p-xl">
            {/* Terminal header */}
            <div className="flex justify-between items-center mb-xl border-b border-outline-variant pb-md">
              <div className="flex gap-xs">
                <div className="w-3 h-3 bg-error rounded-full" />
                <div className="w-3 h-3 bg-tertiary rounded-full" />
                <div className="w-3 h-3 bg-primary rounded-full" />
              </div>
              <div className="font-label-mono text-[10px] text-outline">
                SIMULATION // STATUS: RUNNING
              </div>
            </div>

            {/* Agent grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-md mb-xl">
              {AGENTS.map((agent, i) => (
                <div
                  key={agent.name}
                  className={`p-md border text-center transition-all duration-500 ${
                    i === activeAgent
                      ? 'border-primary bg-primary/10 glow-border'
                      : i < activeAgent
                        ? 'border-outline-variant bg-surface-container-low opacity-50'
                        : 'border-outline-variant bg-surface-container-lowest opacity-30'
                  }`}
                >
                  <span className="material-symbols-outlined text-primary text-[28px] mb-sm block">
                    {agent.icon}
                  </span>
                  <div className="font-label-mono text-xs">
                    {agent.name}
                  </div>
                  {i === activeAgent && (
                    <div className="font-label-mono text-[10px] text-primary mt-xs animate-pulse">
                      THINKING...
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Terminal log */}
            <div className="bg-black border border-outline-variant p-md font-mono text-xs space-y-1 max-h-[200px] overflow-y-auto">
              <div className="text-outline">$ mass simulate --idea &quot;{form.idea.substring(0, 60)}...&quot;</div>
              <div className="text-on-surface-variant">→ Job ID: {jobId || '...'}</div>
              <div className="text-primary animate-pulse">→ {AGENTS[activeAgent]?.emoji} {AGENTS[activeAgent]?.name} agent processing...</div>
            </div>
          </div>
        )}

        {/* ═══ ERROR PHASE ═══ */}
        {phase === 'error' && (
          <div className="border border-error bg-error/5 p-xl text-center">
            <span className="material-symbols-outlined text-error text-[48px] mb-md block">error</span>
            <p className="font-body-lg text-error mb-lg">{errorMsg}</p>
            <p className="font-body-sm text-on-surface-variant mb-xl">
              Make sure the backend is running: <code className="font-mono text-primary">uvicorn api:app --reload</code>
            </p>
            <button
              onClick={handleReset}
              className="bg-transparent border border-outline text-on-surface font-label-mono px-xl py-sm rounded hover:border-primary transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ═══ DONE PHASE — Results ═══ */}
        {phase === 'done' && result?.result && (
          <div className="space-y-lg">
            {/* Action bar */}
            <div className="flex justify-between items-center">
              <div className="font-label-mono text-on-surface-variant">
                {result.result.debate_rounds} DEBATE ROUNDS • {result.result.messages_count} MESSAGES
              </div>
              <button
                onClick={handleReset}
                className="bg-transparent border border-outline text-on-surface font-label-mono px-lg py-xs rounded hover:border-primary transition-colors text-xs"
              >
                New Simulation
              </button>
            </div>

            <ResultsDisplay plan={result.result.business_plan} />

            {/* Raw report toggle */}
            <details className="border border-outline-variant bg-surface-container-lowest">
              <summary className="p-lg font-label-mono text-primary cursor-pointer hover:bg-surface-container-low transition-colors">
                VIEW RAW REPORT
              </summary>
              <div className="p-lg border-t border-outline-variant">
                <pre className="font-mono text-xs text-on-surface-variant whitespace-pre-wrap leading-relaxed">
                  {result.result.final_report}
                </pre>
              </div>
            </details>
          </div>
        )}
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Results Display Component
   ═══════════════════════════════════════════════════════ */

function ResultsDisplay({ plan }: { plan: BusinessPlan }) {
  if (!plan) return null;

  return (
    <div className="space-y-md">
      {/* Mission & Problem */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        <Card label="MISSION" icon="rocket_launch">
          <p className="font-body-lg">{plan.mission}</p>
        </Card>
        <Card label="THE PROBLEM" icon="report_problem">
          <p className="font-body-sm text-on-surface-variant">{plan.problem}</p>
        </Card>
      </div>

      {/* Target Customer */}
      <Card label="TARGET CUSTOMER" icon="groups">
        <p className="font-body-lg">{plan.target_customer}</p>
      </Card>

      {/* Business Model */}
      <Card label="BUSINESS MODEL" icon="payments">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-sm">
          {plan.business_model?.map((tier, i) => (
            <div key={i} className="border border-outline-variant p-md bg-black">
              <div className="font-label-mono text-primary mb-xs">{tier.name}</div>
              <div className="font-stats-lg text-on-surface mb-sm">{tier.price}</div>
              <ul className="space-y-1">
                {tier.features?.map((f, j) => (
                  <li key={j} className="font-body-sm text-on-surface-variant flex items-start gap-xs">
                    <span className="text-primary mt-[2px]">•</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      {/* Financial Snapshot */}
      <Card label="FINANCIAL SNAPSHOT" icon="account_balance">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-sm">
          {plan.financial_snapshot && Object.entries(plan.financial_snapshot).map(([key, val]) => (
            <div key={key} className="text-center border border-outline-variant p-md bg-black">
              <div className="font-label-mono text-[10px] text-on-surface-variant uppercase mb-xs">
                {key.replace(/_/g, ' ')}
              </div>
              <div className="font-stats-lg text-primary">{val}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Go-to-Market + MVP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        <Card label="GO-TO-MARKET (30 DAYS)" icon="campaign">
          <ol className="space-y-sm">
            {plan.go_to_market?.map((tactic, i) => (
              <li key={i} className="font-body-sm text-on-surface-variant flex items-start gap-sm">
                <span className="font-label-mono text-primary shrink-0">{String(i + 1).padStart(2, '0')}</span>
                {tactic}
              </li>
            ))}
          </ol>
        </Card>
        <Card label="PRODUCT MVP" icon="build">
          <ul className="space-y-sm">
            {plan.product_mvp?.map((feat, i) => (
              <li key={i} className="font-body-sm text-on-surface-variant flex items-start gap-sm">
                <span className="text-primary">→</span> {feat}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Revenue Targets */}
      <Card label="REVENUE TARGETS" icon="trending_up">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-sm">
          {plan.revenue_targets?.map((target, i) => (
            <div key={i} className="border border-outline-variant p-md bg-black text-center">
              <div className="font-label-mono text-on-surface-variant mb-xs">DAY {target.day}</div>
              <div className="font-stats-lg text-primary mb-xs">{target.mrr}</div>
              {target.notes && (
                <div className="font-body-sm text-on-surface-variant text-xs">{target.notes}</div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Conflicts */}
      {plan.key_conflicts?.length > 0 && (
        <Card label="KEY CONFLICTS DETECTED" icon="warning">
          <div className="space-y-sm">
            {plan.key_conflicts.map((conflict, i) => (
              <div key={i} className="border-l-2 border-tertiary pl-md">
                <div className="font-headline-md text-sm mb-xs">{conflict.title}</div>
                <p className="font-body-sm text-on-surface-variant">{conflict.description}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Final Verdict */}
      <Card label="FINAL VERDICT" icon="gavel" highlight>
        <p className="font-body-lg">{plan.final_verdict}</p>
      </Card>
    </div>
  );
}

/* ─── Reusable card wrapper ────────────────────────── */

function Card({
  label,
  icon,
  highlight,
  children,
}: {
  label: string;
  icon: string;
  highlight?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`border p-lg ${
        highlight
          ? 'border-primary bg-primary/5 glow-border'
          : 'border-outline-variant bg-surface-container-lowest'
      }`}
    >
      <div className="flex items-center gap-sm mb-md">
        <span className="material-symbols-outlined text-primary text-[20px]">{icon}</span>
        <span className="font-label-mono text-primary">{label}</span>
      </div>
      {children}
    </div>
  );
}
