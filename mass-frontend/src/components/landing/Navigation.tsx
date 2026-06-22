'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Navigation() {
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

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

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

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
          <button
            onClick={() => scrollTo('hero')}
            className="font-body-lg text-primary font-bold border-b-2 border-primary pb-1 hover:text-primary transition-colors bg-transparent"
          >
            Simulator
          </button>
          <button
            onClick={() => scrollTo('council')}
            className="font-body-lg text-on-surface-variant hover:text-primary transition-colors bg-transparent"
          >
            Council
          </button>
          {session && (
            <Link
              className="font-body-lg text-on-surface-variant hover:text-primary transition-colors"
              href="/dashboard"
            >
              Dashboard
            </Link>
          )}
          <Link
            className="font-body-lg text-on-surface-variant hover:text-primary transition-colors"
            href="/docs"
          >
            Docs
          </Link>
          <button
            onClick={() => scrollTo('stats')}
            className="font-body-lg text-on-surface-variant hover:text-primary transition-colors bg-transparent"
          >
            Pricing
          </button>
        </div>
        <div className="flex items-center gap-md">
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="hidden md:block font-label-mono text-on-surface-variant hover:text-primary transition-all"
              >
                Dashboard
              </Link>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push('/');
                }}
                className="font-label-mono text-on-surface-variant hover:text-error transition-all"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="hidden md:block font-label-mono text-on-surface-variant hover:text-primary transition-all"
            >
              Login
            </Link>
          )}
          <Link
            href="/simulate"
            className="bg-primary text-on-primary px-lg py-sm rounded border border-primary-container font-label-mono hover:brightness-110 transition-all"
          >
            {session ? 'Launch Terminal' : 'Start Free Demo'}
          </Link>
        </div>
      </nav>
    </header>
  );
}
