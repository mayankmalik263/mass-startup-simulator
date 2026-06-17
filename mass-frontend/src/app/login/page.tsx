'use client';

import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav bar */}
      <header className="fixed top-0 w-full z-50 bg-background border-b border-outline-variant">
        <nav className="flex justify-between items-center px-margin-desktop py-md max-w-[80rem] mx-auto">
          <Link href="/" className="font-display text-xl text-primary tracking-tighter font-extrabold uppercase">
            MASS
          </Link>
          <Link href="/" className="font-label-mono text-on-surface-variant hover:text-primary transition-colors">
            ← Back
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex items-center justify-center px-margin-mobile">
        <div className="w-full max-w-[28rem]">
          {/* Header */}
          <div className="text-center mb-2xl">
            <h1 className="font-display text-[48px] font-extrabold tracking-tighter mb-md">
              Login
            </h1>
            <p className="font-body-lg text-on-surface-variant">
              Access your simulation history and saved plans.
            </p>
          </div>

          {/* Coming soon notice */}
          <div className="border border-primary bg-primary/5 p-lg mb-xl text-center glow-border">
            <span className="material-symbols-outlined text-primary text-[32px] mb-sm block">
              lock
            </span>
            <p className="font-label-mono text-primary mb-xs">COMING SOON</p>
            <p className="font-body-sm text-on-surface-variant">
              Authentication is being built. For now, you can use the simulator without an account.
            </p>
          </div>

          {/* Form (disabled/visual only) */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="space-y-md"
          >
            <div className="border border-outline-variant bg-surface-container-lowest p-lg">
              <label className="font-label-mono text-on-surface-variant mb-sm block uppercase text-[11px]">
                Email
              </label>
              <input
                type="email"
                disabled
                placeholder="you@example.com"
                className="w-full bg-transparent border-b border-outline text-on-surface/40 font-mono py-xs cursor-not-allowed placeholder:text-on-surface-variant/30"
              />
            </div>

            <div className="border border-outline-variant bg-surface-container-lowest p-lg">
              <label className="font-label-mono text-on-surface-variant mb-sm block uppercase text-[11px]">
                Password
              </label>
              <input
                type="password"
                disabled
                placeholder="••••••••"
                className="w-full bg-transparent border-b border-outline text-on-surface/40 font-mono py-xs cursor-not-allowed placeholder:text-on-surface-variant/30"
              />
            </div>

            <button
              disabled
              className="w-full bg-surface-container-high text-on-surface-variant font-label-mono py-md rounded border border-outline cursor-not-allowed opacity-50"
            >
              Sign In
            </button>
          </form>

          {/* Redirect to simulator */}
          <div className="text-center mt-xl">
            <p className="font-body-sm text-on-surface-variant mb-sm">
              Want to try the simulator now?
            </p>
            <Link
              href="/simulate"
              className="font-label-mono text-primary hover:brightness-125 transition-all"
            >
              Launch Simulator →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
