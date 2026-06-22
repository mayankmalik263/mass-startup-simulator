'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSimulations } from '@/lib/api';
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {
  const [simulations, setSimulations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState<string>('');

  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login');
        return;
      }
      setUserEmail(session.user.email || '');
      
      getSimulations()
        .then(setSimulations)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    });
  }, [router]);

  return (
    <div className="min-h-screen flex bg-background">
      {/* ═══ SIDEBAR ═══ */}
      <aside className="w-64 border-r border-outline-variant bg-surface-container-lowest hidden md:flex flex-col">
        <div className="p-xl border-b border-outline-variant">
          <Link href="/" className="font-display text-2xl text-primary tracking-tighter font-extrabold uppercase">
            MASS
          </Link>
          <div className="font-label-mono text-[10px] text-on-surface-variant mt-xs">
            WORKSPACE
          </div>
        </div>

        <nav className="flex-1 p-md space-y-xs mt-md">
          <div className="px-md py-sm bg-primary/10 text-primary border-l-2 border-primary font-label-mono text-sm flex items-center gap-sm cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">grid_view</span>
            Overview
          </div>
          <Link href="/simulate" className="px-md py-sm text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface font-label-mono text-sm flex items-center gap-sm cursor-pointer transition-colors">
            <span className="material-symbols-outlined text-[18px]">terminal</span>
            New Simulation
          </Link>
          <div className="px-md py-sm text-on-surface-variant/50 font-label-mono text-sm flex items-center justify-between cursor-not-allowed">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-[18px]">analytics</span>
              Evaluation
            </div>
            <span className="material-symbols-outlined text-[14px]">lock</span>
          </div>
          <div className="px-md py-sm text-on-surface-variant/50 font-label-mono text-sm flex items-center justify-between cursor-not-allowed">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-[18px]">group</span>
              Team
            </div>
            <span className="material-symbols-outlined text-[14px]">lock</span>
          </div>
        </nav>

        <div className="p-lg border-t border-outline-variant">
          <div className="font-label-mono text-[11px] text-on-surface truncate mb-sm">
            {userEmail}
          </div>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/');
            }}
            className="w-full text-left font-label-mono text-xs text-error hover:brightness-125 transition-colors flex items-center gap-xs"
          >
            <span className="material-symbols-outlined text-[14px]">logout</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-md border-b border-outline-variant bg-surface-container-lowest">
          <Link href="/" className="font-display text-xl text-primary font-extrabold uppercase">
            MASS
          </Link>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/');
            }}
            className="font-label-mono text-xs text-error"
          >
            Sign Out
          </button>
        </header>

        <div className="flex-1 p-margin-mobile md:p-2xl max-w-[80rem] w-full mx-auto space-y-2xl">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
            <div>
              <h1 className="font-display text-[32px] font-extrabold tracking-tighter text-on-surface mb-xs">
                Welcome back.
              </h1>
              <p className="font-body-sm text-on-surface-variant">
                Here is an overview of your AI startup simulations.
              </p>
            </div>
            <Link
              href="/simulate"
              className="bg-primary text-on-primary px-xl py-sm rounded border border-primary-container font-label-mono hover:brightness-110 transition-all flex items-center gap-sm w-fit"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              New Simulation
            </Link>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            <div className="border border-outline-variant bg-surface-container-lowest p-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-lg opacity-5">
                <span className="material-symbols-outlined text-[64px]">database</span>
              </div>
              <div className="font-label-mono text-[10px] text-on-surface-variant mb-md">TOTAL SIMULATIONS</div>
              <div className="font-display text-[40px] font-extrabold text-primary leading-none">
                {loading ? '-' : simulations.length}
              </div>
            </div>
            <div className="border border-outline-variant bg-surface-container-lowest p-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-lg opacity-5">
                <span className="material-symbols-outlined text-[64px]">memory</span>
              </div>
              <div className="font-label-mono text-[10px] text-on-surface-variant mb-md">AI DEBATE ROUNDS</div>
              <div className="font-display text-[40px] font-extrabold text-on-surface leading-none">
                {loading ? '-' : simulations.length * 3}+
              </div>
            </div>
            <div className="border border-outline-variant bg-surface-container-lowest p-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-lg opacity-5">
                <span className="material-symbols-outlined text-[64px]">star</span>
              </div>
              <div className="font-label-mono text-[10px] text-on-surface-variant mb-md">EVALUATION SCORE</div>
              <div className="font-display text-[40px] font-extrabold text-tertiary leading-none flex items-center gap-sm">
                <span className="material-symbols-outlined text-[24px]">lock</span>
                PRO
              </div>
            </div>
          </div>

          {/* Recent Simulations */}
          <div>
            <div className="flex items-center gap-sm mb-lg border-b border-outline-variant pb-sm">
              <span className="material-symbols-outlined text-primary text-[20px]">history</span>
              <h2 className="font-label-mono text-sm text-on-surface">Recent Activity</h2>
            </div>

            {loading ? (
              <div className="text-center py-2xl">
                <span className="material-symbols-outlined text-primary text-[32px] block animate-spin mb-sm">
                  sync
                </span>
                <div className="font-label-mono text-primary text-xs">LOADING DATA...</div>
              </div>
            ) : error ? (
              <div className="border border-error bg-error/5 p-xl text-center">
                <p className="font-body-lg text-error mb-lg">{error}</p>
              </div>
            ) : simulations.length === 0 ? (
              <div className="border border-outline-variant border-dashed bg-transparent p-2xl text-center">
                <span className="material-symbols-outlined text-outline text-[48px] mb-md">inbox</span>
                <p className="font-body-lg text-on-surface-variant mb-md">Your workspace is empty.</p>
                <Link href="/simulate" className="inline-block text-primary hover:underline font-label-mono">
                  Launch your first simulation →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                {simulations.map((sim) => (
                  <Link key={sim.id} href={`/dashboard/${sim.id}`} className="block group">
                    <div className="border border-outline-variant bg-surface-container-lowest p-lg hover:border-primary transition-all hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)] h-full flex flex-col relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-primary transition-colors"></div>
                      <div className="flex justify-between items-start mb-sm">
                        <div className="font-label-mono text-on-surface-variant text-[10px]">
                          {new Date(sim.created_at).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                        <div className="font-label-mono text-[9px] bg-primary/10 text-primary px-sm py-[2px] rounded border border-primary/20">
                          COMPLETED
                        </div>
                      </div>
                      <h3 className="font-body-lg text-on-surface group-hover:text-primary transition-colors line-clamp-2 mb-md flex-1 pr-md leading-snug">
                        "{sim.idea}"
                      </h3>
                      <div className="font-label-mono text-primary text-xs flex items-center gap-xs mt-auto pt-sm border-t border-outline-variant/50">
                        View Complete Plan <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
