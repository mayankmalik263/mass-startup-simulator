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
          </div>
        ) : null}
      </main>
    </div>
  );
}
