'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getSimulationById } from '@/lib/api';
import { ResultsDisplay } from '@/components/ResultsDisplay';

export default function HistoryDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [simulation, setSimulation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Chat State
  const [chatMessages, setChatMessages] = useState<{role: string, content: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const [userTier] = useState('pro'); // Mock PRO tier for development

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatting) return;

    const newMessages = [...chatMessages, { role: 'user', content: chatInput }];
    setChatMessages(newMessages);
    setChatInput('');
    setIsChatting(true);

    try {
      const { chatWithCouncil } = await import('@/lib/api');
      const res = await chatWithCouncil(simulation.job_id, newMessages, userTier);
      setChatMessages([...newMessages, { role: 'assistant', content: res.reply }]);
    } catch (err) {
      setChatMessages([...newMessages, { role: 'assistant', content: `Error: ${err}` }]);
    } finally {
      setIsChatting(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    getSimulationById(id)
      .then(setSimulation)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen">
      <header className="fixed top-0 w-full z-50 bg-background border-b border-outline-variant">
        <nav className="flex justify-between items-center px-margin-desktop py-md max-w-[80rem] mx-auto">
          <Link href="/" className="font-display text-xl text-primary tracking-tighter font-extrabold uppercase">
            MASS
          </Link>
          <div className="flex items-center gap-md">
            <Link href="/dashboard" className="font-label-mono text-on-surface-variant hover:text-primary transition-colors">
              ← Back to Dashboard
            </Link>
          </div>
        </nav>
      </header>

      <main className="pt-[120px] pb-2xl px-margin-mobile md:px-margin-desktop max-w-[64rem] mx-auto">
        {loading ? (
          <div className="text-center py-2xl">
            <span className="material-symbols-outlined text-primary text-[32px] block animate-spin mb-sm">
              sync
            </span>
            <div className="font-label-mono text-primary text-xs">LOADING REPORT...</div>
          </div>
        ) : error ? (
          <div className="border border-error bg-error/5 p-xl text-center">
            <p className="font-body-lg text-error mb-lg">{error}</p>
            <Link href="/dashboard" className="bg-transparent border border-outline text-on-surface font-label-mono px-xl py-sm rounded hover:border-primary transition-colors">
              Return to Dashboard
            </Link>
          </div>
        ) : simulation ? (
          <div className="space-y-lg">
            <div className="mb-xl">
              <h1 className="font-display text-[32px] md:text-[40px] font-extrabold tracking-tighter mb-sm leading-tight">
                Simulation Report
              </h1>
              <div className="font-label-mono text-on-surface-variant text-xs flex items-center gap-md">
                <span>{new Date(simulation.created_at).toLocaleString()}</span>
                {simulation.job_id && (
                  <span className="opacity-60">JOB: {simulation.job_id}</span>
                )}
              </div>
            </div>

            <div className="border border-outline-variant bg-surface-container-lowest p-lg mb-xl">
              <div className="font-label-mono text-primary mb-xs uppercase">Original Idea</div>
              <p className="font-body-lg text-on-surface italic">"{simulation.idea}"</p>
              
              {/* Context display */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-md mt-md pt-md border-t border-outline-variant/30">
                {['target_audience', 'market', 'revenue_model', 'constraints'].map(key => (
                  <div key={key}>
                    <div className="font-label-mono text-[10px] text-outline mb-[2px]">{key.replace('_', ' ').toUpperCase()}</div>
                    <div className="font-body-sm text-on-surface-variant truncate">{simulation[key] || '-'}</div>
                  </div>
                ))}
              </div>
            </div>

            {simulation.business_plan && (
              <ResultsDisplay plan={simulation.business_plan} />
            )}

            <details className="border border-outline-variant bg-surface-container-lowest">
              <summary className="p-lg font-label-mono text-primary cursor-pointer hover:bg-surface-container-low transition-colors">
                VIEW RAW REPORT
              </summary>
              <div className="p-lg border-t border-outline-variant">
                <pre className="font-mono text-xs text-on-surface-variant whitespace-pre-wrap leading-relaxed">
                  {simulation.final_report}
                </pre>
              </div>
            </details>

            {/* Pro Chat UI */}
            <div className="border border-outline-variant bg-surface-container-lowest p-lg mt-xl relative overflow-hidden">
              <div className="font-display text-[24px] font-extrabold tracking-tighter mb-sm text-primary flex items-center gap-sm">
                Follow-up Questions
                <span className="font-label-mono text-[10px] bg-tertiary/20 text-tertiary px-sm py-[2px] rounded-full border border-tertiary/30">
                  PRO
                </span>
              </div>
              <p className="font-body-sm text-on-surface-variant mb-md">
                Ask the council specific questions about this report. Mention a role (e.g., @Finance) to get a targeted answer.
              </p>

              {userTier === 'free' ? (
                 <div className="bg-surface-container p-xl text-center rounded border border-outline-variant/50">
                   <span className="material-symbols-outlined text-outline text-[32px] mb-sm block">lock</span>
                   <p className="font-body-sm text-on-surface-variant">Upgrade to Pro to chat with the council about your report.</p>
                 </div>
              ) : (
                <div className="flex flex-col gap-md">
                  <div className="max-h-[300px] overflow-y-auto flex flex-col gap-md p-md bg-surface-container/30 border border-outline-variant/30 rounded min-h-[100px]">
                    {chatMessages.length === 0 && (
                      <div className="text-center font-body-sm text-on-surface-variant italic py-md">
                        No questions yet. Ask the council!
                      </div>
                    )}
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-sm rounded text-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-primary/10 border border-primary/20 text-primary' : 'bg-surface-container border border-outline-variant text-on-surface-variant'}`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {isChatting && (
                      <div className="flex justify-start">
                        <div className="max-w-[85%] p-sm rounded text-sm bg-surface-container border border-outline-variant text-primary animate-pulse">
                          Council is typing...
                        </div>
                      </div>
                    )}
                  </div>
                  <form onSubmit={handleChatSubmit} className="flex gap-sm">
                    <input 
                      type="text" 
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      placeholder="Ask the council... e.g. @CMO what if we run Facebook ads instead?"
                      className="flex-1 bg-surface-container-low border border-outline focus:border-primary outline-none text-on-surface font-body-sm px-md py-sm transition-colors placeholder:text-on-surface-variant/40 rounded"
                    />
                    <button 
                      type="submit" 
                      disabled={isChatting || !chatInput.trim()}
                      className="bg-primary text-on-primary font-label-mono px-lg py-sm rounded border border-primary-container hover:brightness-125 transition-all text-sm disabled:opacity-50"
                    >
                      Send
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
