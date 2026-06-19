'use client';

import Link from 'next/link';

export default function CTA() {
  return (
    <section className="py-2xl px-margin-mobile md:px-margin-desktop bg-surface-container-low border-t border-outline-variant relative overflow-hidden">
      <div className="max-w-[56rem] mx-auto text-center relative z-10">
        <h2 className="font-display text-[48px] md:text-[64px] font-extrabold mb-lg leading-tight">
          Ready to pressure-test your startup idea?
        </h2>
        <Link
          href="/simulate"
          className="inline-block bg-primary text-on-primary font-label-mono px-2xl py-md rounded border border-primary-container hover:scale-105 transition-transform mb-xl"
        >
          Start Free
        </Link>
        <div className="flex items-center justify-center gap-sm">
          <span className="material-symbols-outlined text-primary text-[20px]">
            rocket_launch
          </span>
          <span className="font-label-mono text-xs text-on-surface-variant">
            This platform just launched — be one of the first to try it!
          </span>
        </div>
      </div>
    </section>
  );
}
