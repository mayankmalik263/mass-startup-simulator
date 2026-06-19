'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { startSimulation, getSimulationStatus, streamSimulation } from '@/lib/api';
import type {
  SimulateRequest,
  SimulationJob,
  BusinessPlan,
  AgentEvent,
} from '@/types/simulation';

/* ─── Agent display config ─────────────────────────── */
const AGENTS = [
  { key: 'CEO', icon: 'person_apron', emoji: '🤖' },
  { key: 'Finance', icon: 'payments', emoji: '💰' },
  { key: 'Supervisor', icon: 'hub', emoji: '🎯' },
  { key: 'Marketing', icon: 'campaign', emoji: '📣' },
  { key: 'Product', icon: 'inventory_2', emoji: '🛠️' },
  { key: 'Sales', icon: 'trending_up', emoji: '🤝' },
  { key: 'Report', icon: 'description', emoji: '📊' },
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

  /* Live agent state — driven by SSE */
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [completedAgents, setCompletedAgents] = useState<string[]>([]);
  const [activityLog, setActivityLog] = useState<AgentEvent[]>([]);
  const [currentRound, setCurrentRound] = useState(1);

  const cleanupRef = useRef<(() => void) | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  /* Auto-scroll activity log */
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activityLog]);

  /* ─── SSE event handler ─────────────────────────── */
  const handleAgentEvent = useCallback((event: AgentEvent) => {
    setActivityLog((prev) => [...prev, event]);

    switch (event.type) {
      case 'agent_start':
        setActiveAgent(event.agent || null);
        if (event.round && event.round > currentRound) {
          setCurrentRound(event.round);
        }
        break;

      case 'agent_done':
        setCompletedAgents((prev) =>
          prev.includes(event.agent || '') ? prev : [...prev, event.agent || '']
        );
        setActiveAgent(null);
        break;

      case 'supervisor_result':
        setCompletedAgents((prev) =>
          prev.includes('Supervisor') ? prev : [...prev, 'Supervisor']
        );
        setActiveAgent(null);
        break;

      case 'debate_loop':
        // Reset completed agents for the new debate round (CEO + Finance + Supervisor will re-run)
        setCompletedAgents((prev) =>
          prev.filter((a) => !['CEO', 'Finance', 'Supervisor'].includes(a))
        );
        if (event.round) setCurrentRound(event.round);
        break;

      case 'job_done':
        // SSE is done — polling will pick up the final result
        break;

      case 'job_error':
        setErrorMsg(event.error || 'Simulation failed');
        setPhase('error');
        break;
    }
  }, [currentRound]);

  /* ─── Polling (fallback + final result fetch) ──── */
  const poll = useCallback(async (id: string) => {
    try {
      const job = await getSimulationStatus(id);

      if (job.status === 'done') {
        setResult(job);
        setPhase('done');
        return true;
      }
      if (job.status === 'error') {
        setErrorMsg(job.error || 'Simulation failed');
        setPhase('error');
        return true;
      }
      return false;
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Connection lost');
      setPhase('error');
      return true;
    }
  }, []);

  /* ─── SSE + Polling lifecycle ───────────────────── */
  useEffect(() => {
    if (phase !== 'running' || !jobId) return;

    // Start SSE stream
    const cleanup = streamSimulation(
      jobId,
      handleAgentEvent,
      () => {
        // SSE error — we still have polling as fallback
        console.warn('SSE connection lost, relying on polling fallback');
      }
    );
    cleanupRef.current = cleanup;

    // Poll every 3s as fallback (in case SSE drops)
    const pollTimer = setInterval(async () => {
      const done = await poll(jobId);
      if (done) {
        clearInterval(pollTimer);
        cleanup();
      }
    }, 3000);

    return () => {
      clearInterval(pollTimer);
      cleanup();
      cleanupRef.current = null;
    };
  }, [phase, jobId, poll, handleAgentEvent]);

  /* ─── Submit ─────────────────────────────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.idea.trim()) return;

    setPhase('running');
    setActiveAgent(null);
    setCompletedAgents([]);
    setActivityLog([]);
    setCurrentRound(1);
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
    if (cleanupRef.current) cleanupRef.current();
    setPhase('form');
    setJobId(null);
    setResult(null);
    setErrorMsg('');
    setActiveAgent(null);
    setCompletedAgents([]);
    setActivityLog([]);
    setCurrentRound(1);
    setForm({ idea: '', target_audience: '', market: '', revenue_model: '', constraints: '' });
  };

  /* ─── Helper: get agent status ──────────────────── */
  const getAgentStatus = (agentKey: string) => {
    if (activeAgent === agentKey) return 'active';
    if (completedAgents.includes(agentKey)) return 'completed';
    return 'waiting';
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
            {phase === 'running' && 'Your idea is being stress-tested by 5 specialized AI agents. Watch the debate unfold in real-time.'}
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
          <div className="space-y-lg">
            {/* Terminal-style container */}
            <div className="border border-outline-variant bg-surface-container-lowest p-xl">
              {/* Terminal header */}
              <div className="flex justify-between items-center mb-xl border-b border-outline-variant pb-md">
                <div className="flex gap-xs">
                  <div className="w-3 h-3 bg-error rounded-full" />
                  <div className="w-3 h-3 bg-tertiary rounded-full" />
                  <div className="w-3 h-3 bg-primary rounded-full" />
                </div>
                <div className="font-label-mono text-[10px] text-outline">
                  SIMULATION // ROUND {currentRound} // STATUS: RUNNING
                </div>
              </div>

              {/* Agent grid — synced with backend */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-md mb-xl">
                {AGENTS.map((agent) => {
                  const status = getAgentStatus(agent.key);
                  return (
                    <div
                      key={agent.key}
                      className={`p-md border text-center transition-all duration-500 ${
                        status === 'active'
                          ? 'border-primary bg-primary/10 glow-border'
                          : status === 'completed'
                            ? 'border-primary/40 bg-primary/5'
                            : 'border-outline-variant bg-surface-container-lowest opacity-30'
                      }`}
                    >
                      <span className="material-symbols-outlined text-primary text-[28px] mb-sm block">
                        {agent.icon}
                      </span>
                      <div className="font-label-mono text-xs">
                        {agent.key}
                      </div>
                      {status === 'active' && (
                        <div className="font-label-mono text-[10px] text-primary mt-xs animate-pulse">
                          THINKING...
                        </div>
                      )}
                      {status === 'completed' && (
                        <div className="font-label-mono text-[10px] text-primary/60 mt-xs">
                          ✓ DONE
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ─── Live Activity Feed ─────────────────── */}
            <div className="border border-outline-variant bg-surface-container-lowest">
              <div className="flex items-center gap-sm p-lg border-b border-outline-variant">
                <span className="material-symbols-outlined text-primary text-[18px]">
                  stream
                </span>
                <span className="font-label-mono text-primary text-xs">
                  LIVE ACTIVITY
                </span>
                <div className="ml-auto flex items-center gap-xs">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="font-label-mono text-[10px] text-outline">STREAMING</span>
                </div>
              </div>

              <div className="p-lg max-h-[400px] overflow-y-auto space-y-0">
                {activityLog.length === 0 && (
                  <div className="text-center py-xl">
                    <span className="material-symbols-outlined text-outline text-[32px] mb-sm block animate-pulse">
                      hourglass_top
                    </span>
                    <div className="font-label-mono text-[11px] text-outline">
                      Waiting for agents to start...
                    </div>
                  </div>
                )}

                {activityLog.map((event, i) => (
                  <ActivityLogEntry key={i} event={event} />
                ))}
                <div ref={logEndRef} />
              </div>
            </div>

            {/* Terminal command log */}
            <div className="bg-black border border-outline-variant p-md font-mono text-xs space-y-1 max-h-[120px] overflow-y-auto">
              <div className="text-outline">$ mass simulate --idea &quot;{form.idea.substring(0, 60)}...&quot;</div>
              <div className="text-on-surface-variant">→ Job ID: {jobId || '...'}</div>
              {activeAgent && (
                <div className="text-primary animate-pulse">
                  → {AGENTS.find(a => a.key === activeAgent)?.emoji} {activeAgent} agent processing...
                </div>
              )}
              {!activeAgent && activityLog.length > 0 && (
                <div className="text-on-surface-variant">
                  → Waiting for next agent...
                </div>
              )}
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
   Activity Log Entry — renders a single SSE event
   ═══════════════════════════════════════════════════════ */

function ActivityLogEntry({ event }: { event: AgentEvent }) {
  const agent = AGENTS.find((a) => a.key === event.agent);

  switch (event.type) {
    case 'agent_start':
      return (
        <div className="flex items-start gap-sm py-sm border-b border-outline-variant/30 last:border-b-0">
          <span className="text-sm mt-[1px]">{agent?.emoji || '⚙️'}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-sm">
              <span className="font-label-mono text-xs text-on-surface">
                {event.agent}
              </span>
              {event.round && (
                <span className="font-label-mono text-[10px] text-outline">
                  ROUND {event.round}
                </span>
              )}
            </div>
            <div className="font-body-sm text-primary text-xs animate-pulse mt-[2px]">
              Thinking...
            </div>
          </div>
        </div>
      );

    case 'agent_done':
      return (
        <div className="flex items-start gap-sm py-sm border-b border-outline-variant/30 last:border-b-0">
          <span className="text-sm mt-[1px]">{agent?.emoji || '✅'}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-sm">
              <span className="font-label-mono text-xs text-on-surface">
                {event.agent}
              </span>
              <span className="font-label-mono text-[10px] text-primary/60">✓ DONE</span>
            </div>
            {event.summary && (
              <div className="font-body-sm text-on-surface-variant text-xs mt-[2px] leading-relaxed italic">
                &ldquo;{event.summary}&rdquo;
              </div>
            )}
          </div>
        </div>
      );

    case 'supervisor_result':
      return (
        <div className={`my-sm border-l-2 pl-md py-sm ${
          event.forced
            ? 'border-tertiary bg-tertiary/5'
            : event.agreed
              ? 'border-primary bg-primary/5'
              : 'border-error bg-error/5'
        }`}>
          <div className="flex items-center gap-sm mb-xs">
            <span className="text-sm">🎯</span>
            <span className="font-label-mono text-xs text-on-surface">
              Supervisor Verdict
            </span>
            <span className="font-label-mono text-[10px] text-outline">
              ROUND {event.round}
            </span>
          </div>

          {/* Consensus status badge */}
          {event.forced ? (
            <div className="font-label-mono text-xs text-tertiary mb-xs flex items-center gap-xs">
              <span className="material-symbols-outlined text-[14px]">warning</span>
              CONSENSUS FORCED — Max debate rounds reached
            </div>
          ) : event.agreed ? (
            <div className="font-label-mono text-xs text-primary mb-xs flex items-center gap-xs">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              CEO &amp; FINANCE REACHED CONSENSUS
            </div>
          ) : (
            <div className="font-label-mono text-xs text-error mb-xs flex items-center gap-xs">
              <span className="material-symbols-outlined text-[14px]">cancel</span>
              NO CONSENSUS
            </div>
          )}

          {/* Reason */}
          {event.reason && (
            <div className="font-body-sm text-on-surface-variant text-xs mb-xs leading-relaxed">
              {event.reason}
            </div>
          )}

          {/* Conflicts */}
          {event.conflicts && event.conflicts.length > 0 && (
            <div className="mt-xs">
              <div className="font-label-mono text-[10px] text-error/80 mb-[2px]">CONFLICTS:</div>
              {event.conflicts.map((c, i) => (
                <div key={i} className="font-body-sm text-xs text-on-surface-variant flex items-start gap-xs">
                  <span className="text-error mt-[1px]">•</span>
                  <span>{c}</span>
                </div>
              ))}
            </div>
          )}

          {/* Decisions */}
          {event.decisions && event.decisions.length > 0 && (
            <div className="mt-xs">
              <div className="font-label-mono text-[10px] text-primary/80 mb-[2px]">LOCKED DECISIONS:</div>
              {event.decisions.map((d, i) => (
                <div key={i} className="font-body-sm text-xs text-on-surface-variant flex items-start gap-xs">
                  <span className="text-primary mt-[1px]">→</span>
                  <span>{d}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      );

    case 'debate_loop':
      return (
        <div className="my-sm py-sm px-md bg-tertiary/10 border border-tertiary/20 flex items-center gap-sm">
          <span className="material-symbols-outlined text-tertiary text-[16px] animate-spin">
            sync
          </span>
          <div>
            <div className="font-label-mono text-xs text-tertiary">
              🔄 LOOPING BACK — Round {event.round} starting
            </div>
            {event.reason && (
              <div className="font-body-sm text-xs text-on-surface-variant mt-[2px]">
                {event.reason}
              </div>
            )}
          </div>
        </div>
      );

    case 'job_done':
      return (
        <div className="my-sm py-sm px-md bg-primary/10 border border-primary/20 flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary text-[16px]">
            task_alt
          </span>
          <div className="font-label-mono text-xs text-primary">
            SIMULATION COMPLETE — Preparing results...
          </div>
        </div>
      );

    case 'job_error':
      return (
        <div className="my-sm py-sm px-md bg-error/10 border border-error/20 flex items-center gap-sm">
          <span className="material-symbols-outlined text-error text-[16px]">
            error
          </span>
          <div className="font-label-mono text-xs text-error">
            ERROR: {event.error || 'Simulation failed'}
          </div>
        </div>
      );

    default:
      return null;
  }
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
