'use client';

import Link from 'next/link';

export default function Navigation() {
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
            Launch Terminal
          </Link>
        </div>
      </nav>
    </header>
  );
}
