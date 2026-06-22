'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSimulations } from '@/lib/api';
import { supabase } from '@/lib/supabase';

export default function HistoryPage() {
  const [simulations, setSimulations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login');
        return;
      }
      
      getSimulations()
        .then(setSimulations)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    });
  }, [router]);

  return (
    <div className="min-h-screen">
      <header className="fixed top-0 w-full z-50 bg-background border-b border-outline-variant">
        <nav className="flex justify-between items-center px-margin-desktop py-md max-w-[80rem] mx-auto">
          <Link href="/" className="font-display text-xl text-primary tracking-tighter font-extrabold uppercase">
            MASS
          </Link>
          <div className="flex items-center gap-md">
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                router.push('/login');
              }}
              className="font-label-mono text-on-surface-variant hover:text-error transition-colors bg-transparent border border-outline px-sm py-xs rounded text-xs"
            >
              Sign Out
            </button>
            <Link href="/" className="font-label-mono text-on-surface-variant hover:text-primary transition-colors">
              ← Back to Home
            </Link>
          </div>
        </nav>
      </header>

      <main className="pt-[120px] pb-2xl px-margin-mobile md:px-margin-desktop max-w-[64rem] mx-auto">
        <div className="mb-2xl text-center">
          <h1 className="font-display text-[48px] md:text-[64px] font-extrabold tracking-tighter mb-md leading-tight">
            Simulation History
          </h1>
          <p className="font-body-lg text-on-surface-variant max-w-[42rem] mx-auto">
            Review past startup debates and extracted business plans.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-2xl">
            <span className="material-symbols-outlined text-primary text-[32px] block animate-spin mb-sm">
              sync
            </span>
            <div className="font-label-mono text-primary text-xs">LOADING HISTORY...</div>
          </div>
        ) : error ? (
          <div className="border border-error bg-error/5 p-xl text-center">
            <p className="font-body-lg text-error mb-lg">{error}</p>
          </div>
        ) : simulations.length === 0 ? (
          <div className="border border-outline-variant bg-surface-container-lowest p-xl text-center">
            <p className="font-body-lg text-on-surface-variant">No simulations found.</p>
            <Link href="/simulate" className="inline-block mt-md text-primary hover:underline font-label-mono">
              Start a new simulation →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            {simulations.map((sim) => (
              <Link key={sim.id} href={`/history/${sim.id}`} className="block group">
                <div className="border border-outline-variant bg-surface-container-lowest p-lg hover:border-primary transition-colors h-full flex flex-col">
                  <div className="font-label-mono text-on-surface-variant text-[10px] mb-sm">
                    {new Date(sim.created_at).toLocaleString()}
                  </div>
                  <h3 className="font-body-lg text-on-surface group-hover:text-primary transition-colors line-clamp-3 mb-md flex-1">
                    "{sim.idea}"
                  </h3>
                  <div className="font-label-mono text-primary text-xs flex items-center gap-xs">
                    View Report <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
