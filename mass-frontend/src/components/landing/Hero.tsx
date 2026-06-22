'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

export default function Hero() {
  const logoRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const logo = logoRef.current;
    if (!logo) return;

    const handleMouseOver = () => {
      logo.style.textShadow = '0 0 20px rgba(139, 92, 246, 0.4)';
      logo.style.transition = 'all 0.3s ease';
    };
    const handleMouseOut = () => {
      logo.style.textShadow = 'none';
    };

    logo.addEventListener('mouseover', handleMouseOver);
    logo.addEventListener('mouseout', handleMouseOut);

    return () => {
      logo.removeEventListener('mouseover', handleMouseOver);
      logo.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  const scrollToProcess = () => {
    document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col items-center justify-center relative px-margin-mobile md:px-margin-desktop text-center pt-2xl"
    >
      <div className="z-10 mt-xl">
        <h2 className="font-label-mono text-primary tracking-[0.3em] mb-md uppercase opacity-80">
          Multi-Agent Startup Simulator
        </h2>
        <h1
          ref={logoRef}
          className="font-display text-[80px] md:text-[140px] leading-none font-extrabold tracking-tighter mb-lg select-none"
        >
          MASS
        </h1>
        <p className="font-headline-lg text-on-surface max-w-[48rem] mx-auto mb-xl">
          Your startup idea. <span className="text-primary italic">Debated by AI executives.</span>
        </p>
        <p className="font-body-lg text-on-surface-variant max-w-[42rem] mx-auto mb-2xl">
          Watch a council of AI agents analyze, challenge, and refine your business idea before
          producing a structured startup plan.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-lg">
          <Link
            href="/simulate"
            className="w-full md:w-auto bg-primary text-on-primary font-label-mono px-xl py-md rounded border border-primary-container hover:brightness-125 transition-all text-center"
          >
            Start Simulation
          </Link>
          <Link
            href="/#process"
            className="w-full md:w-auto bg-transparent border border-outline text-on-surface font-label-mono px-xl py-md rounded hover:bg-surface-container-low transition-all inline-block"
          >
            How It Works
          </Link>
        </div>
      </div>

      {/* Hero Visual: The Council */}
      <div
        id="council"
        className="mt-2xl w-full max-w-[64rem] border border-outline-variant bg-surface-container-lowest p-lg relative overflow-hidden group"
      >
        <div className="flex justify-between items-center mb-xl border-b border-outline-variant pb-md">
          <div className="flex gap-xs">
            <div className="w-3 h-3 bg-error rounded-full"></div>
            <div className="w-3 h-3 bg-tertiary rounded-full"></div>
            <div className="w-3 h-3 bg-primary rounded-full"></div>
          </div>
          <div className="font-label-mono text-[10px] text-outline">TERMINAL_v1.2.0-STABLE // STATUS: STANDBY</div>
        </div>

        {/* Desktop Council Visualization */}
        <div className="hidden md:flex relative h-[400px] items-center justify-center">
          {/* Central Node */}
          <div className="z-20 w-24 h-24 bg-black border-2 border-primary flex items-center justify-center glow-border">
            <span className="material-symbols-outlined text-primary text-[40px]">hub</span>
          </div>

          {/* CEO */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="w-16 h-16 bg-surface-container-high border border-outline flex items-center justify-center">
              <span className="material-symbols-outlined text-on-surface">person_apron</span>
            </div>
            <span className="font-label-mono text-xs mt-sm bg-primary px-sm py-xs text-on-primary">CEO</span>
          </div>

          {/* CFO */}
          <div className="absolute top-1/4 left-0 flex flex-col items-center">
            <div className="w-16 h-16 bg-surface-container-high border border-outline flex items-center justify-center">
              <span className="material-symbols-outlined text-on-surface">payments</span>
            </div>
            <span className="font-label-mono text-xs mt-sm bg-surface-container-highest px-sm py-xs">
              CFO
            </span>
          </div>

          {/* CMO */}
          <div className="absolute top-1/4 right-0 flex flex-col items-center">
            <div className="w-16 h-16 bg-surface-container-high border border-outline flex items-center justify-center">
              <span className="material-symbols-outlined text-on-surface">campaign</span>
            </div>
            <span className="font-label-mono text-xs mt-sm bg-surface-container-highest px-sm py-xs">
              CMO
            </span>
          </div>

          {/* CPO */}
          <div className="absolute bottom-1/4 left-12 flex flex-col items-center">
            <div className="w-16 h-16 bg-surface-container-high border border-outline flex items-center justify-center">
              <span className="material-symbols-outlined text-on-surface">inventory_2</span>
            </div>
            <span className="font-label-mono text-xs mt-sm bg-surface-container-highest px-sm py-xs">
              CPO
            </span>
          </div>

          {/* CRO */}
          <div className="absolute bottom-1/4 right-12 flex flex-col items-center">
            <div className="w-16 h-16 bg-surface-container-high border border-outline flex items-center justify-center">
              <span className="material-symbols-outlined text-on-surface">trending_up</span>
            </div>
            <span className="font-label-mono text-xs mt-sm bg-surface-container-highest px-sm py-xs">
              CRO
            </span>
          </div>

          {/* SVG Connections */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
            viewBox="0 0 1000 400"
          >
            <line className="line-animation" stroke="#8B5CF6" strokeWidth="1" x1="500" x2="500" y1="20" y2="150" />
            <line className="line-animation" stroke="#8B5CF6" strokeWidth="1" x1="65" x2="450" y1="120" y2="180" />
            <line className="line-animation" stroke="#8B5CF6" strokeWidth="1" x1="935" x2="550" y1="120" y2="180" />
            <line className="line-animation" stroke="#8B5CF6" strokeWidth="1" x1="150" x2="460" y1="280" y2="230" />
            <line className="line-animation" stroke="#8B5CF6" strokeWidth="1" x1="850" x2="540" y1="280" y2="230" />
          </svg>
        </div>

        {/* Mobile Council Visualization (Stacked List) */}
        <div className="md:hidden flex flex-col gap-md py-md">
          <div className="flex items-center gap-md border border-outline p-md bg-black">
            <span className="material-symbols-outlined text-primary text-[24px]">hub</span>
            <div className="font-label-mono text-sm text-primary">Supervisor Node</div>
          </div>
          <div className="grid grid-cols-2 gap-sm pl-xl border-l border-primary/30 ml-md">
            <div className="border border-outline bg-surface-container-highest p-sm flex items-center gap-sm">
              <span className="material-symbols-outlined text-on-surface text-[18px]">person_apron</span>
              <span className="font-label-mono text-xs">CEO</span>
            </div>
            <div className="border border-outline bg-surface-container-highest p-sm flex items-center gap-sm">
              <span className="material-symbols-outlined text-on-surface text-[18px]">payments</span>
              <span className="font-label-mono text-xs">CFO</span>
            </div>
            <div className="border border-outline bg-surface-container-highest p-sm flex items-center gap-sm">
              <span className="material-symbols-outlined text-on-surface text-[18px]">campaign</span>
              <span className="font-label-mono text-xs">CMO</span>
            </div>
            <div className="border border-outline bg-surface-container-highest p-sm flex items-center gap-sm">
              <span className="material-symbols-outlined text-on-surface text-[18px]">inventory_2</span>
              <span className="font-label-mono text-xs">CPO</span>
            </div>
            <div className="col-span-2 border border-outline bg-surface-container-highest p-sm flex items-center justify-center gap-sm">
              <span className="material-symbols-outlined text-on-surface text-[18px]">trending_up</span>
              <span className="font-label-mono text-xs">CRO</span>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
}
