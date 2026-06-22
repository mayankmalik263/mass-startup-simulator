'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/history');
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // If email confirmation is enabled, it might require checking email
        router.push('/history');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

      <main className="flex-1 flex items-center justify-center px-margin-mobile pt-[100px]">
        <div className="w-full max-w-[28rem]">
          {/* Header */}
          <div className="text-center mb-2xl">
            <h1 className="font-display text-[48px] font-extrabold tracking-tighter mb-md">
              {isLogin ? 'Login' : 'Sign Up'}
            </h1>
            <p className="font-body-lg text-on-surface-variant">
              {isLogin ? 'Access your private simulation history.' : 'Create an account to save simulations.'}
            </p>
          </div>

          {error && (
            <div className="border border-error bg-error/10 p-md mb-xl text-center">
              <p className="font-body-sm text-error">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-md">
            <div className="border border-outline-variant bg-surface-container-lowest p-lg focus-within:border-primary focus-within:glow-border transition-all">
              <label className="font-label-mono text-primary mb-sm block uppercase text-[11px]">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent border-b border-outline text-on-surface font-mono py-xs focus:outline-none focus:border-primary placeholder:text-on-surface-variant/30"
              />
            </div>

            <div className="border border-outline-variant bg-surface-container-lowest p-lg focus-within:border-primary focus-within:glow-border transition-all">
              <label className="font-label-mono text-primary mb-sm block uppercase text-[11px]">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent border-b border-outline text-on-surface font-mono py-xs focus:outline-none focus:border-primary placeholder:text-on-surface-variant/30"
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-primary text-on-primary font-label-mono py-md rounded hover:brightness-110 transition-all disabled:opacity-50 flex justify-center items-center gap-sm"
            >
              {loading && <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>}
              {isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="text-center mt-xl border-t border-outline-variant pt-lg">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="font-body-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
