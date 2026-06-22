'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';

export default function Navigation() {
  const [session, setSession] = useState<any>(null);
  const [activeHash, setActiveHash] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setActiveHash(window.location.hash || '#hero');
    
    // Listen to hash changes in case of browser back/forward or manual URL edits
    const handleHashChange = () => {
      setActiveHash(window.location.hash || '#hero');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [pathname]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isSimulatorActive = pathname === '/' && (activeHash === '#hero' || activeHash === '');
  const isCouncilActive = pathname === '/' && activeHash === '#council';
  const isDocsActive = pathname === '/docs';

  return (
    <header className="fixed top-0 w-full z-50 bg-background border-b border-outline-variant">
      <nav className="flex justify-between items-center px-margin-desktop py-md max-w-[80rem] mx-auto">
        <Link
          href="/"
          className="font-display text-xl text-primary tracking-tighter font-extrabold uppercase"
        >
          MASS
        </Link>
        <div className="hidden md:flex items-center gap-xl">
          <Link
            href="/#hero"
            onClick={() => setActiveHash('#hero')}
            className={`font-label-mono pb-1 transition-colors bg-transparent border-b-2 ${
              isSimulatorActive
                ? 'text-primary font-bold border-primary'
                : 'text-on-surface-variant border-transparent hover:text-primary'
            }`}
          >
            Simulator
          </Link>
          <Link
            href="/#council"
            onClick={() => setActiveHash('#council')}
            className={`font-label-mono pb-1 transition-colors bg-transparent border-b-2 ${
              isCouncilActive
                ? 'text-primary font-bold border-primary'
                : 'text-on-surface-variant border-transparent hover:text-primary'
            }`}
          >
            Council
          </Link>
          <Link
            href="/docs"
            className={`font-label-mono pb-1 transition-colors bg-transparent border-b-2 ${
              isDocsActive
                ? 'text-primary font-bold border-primary'
                : 'text-on-surface-variant border-transparent hover:text-primary'
            }`}
          >
            Docs
          </Link>
        </div>
        <div className="flex items-center gap-md">
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="hidden md:block font-label-mono text-on-surface-variant border-b-2 border-transparent pb-1 hover:text-primary transition-all"
              >
                Dashboard
              </Link>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push('/');
                }}
                className="font-label-mono text-on-surface-variant border-b-2 border-transparent pb-1 hover:text-error transition-all"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden md:block font-label-mono text-on-surface-variant hover:text-primary transition-all"
              >
                Login
              </Link>
              <Link
                href="/simulate"
                className="bg-primary text-on-primary px-lg py-sm rounded border border-primary-container font-label-mono hover:brightness-110 transition-all"
              >
                Start Free
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
