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
          <div className="z-20 flex flex-col items-center animate-float" style={{ animationDelay: '0s' }}>
            <div className="w-24 h-24 bg-black border-2 border-primary flex items-center justify-center glow-border rounded-xl">
              <span className="material-symbols-outlined text-primary text-[40px] animate-pulse">fact_check</span>
            </div>
            <span className="font-label-mono text-[10px] text-primary/80 mt-sm bg-black/80 px-sm py-[2px] rounded border border-outline-variant">Consensus Check</span>
          </div>

          {/* CEO */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center group/node cursor-default animate-float" style={{ animationDelay: '0.2s' }}>
            <div className="w-16 h-16 bg-surface-container-highest border border-outline flex items-center justify-center rounded-xl transition-all duration-300 group-hover/node:scale-110 group-hover/node:border-primary group-hover/node:shadow-[0_0_15px_rgba(139,92,246,0.4)] relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover/node:opacity-100 transition-opacity" />
              <span className="material-symbols-outlined text-[28px] text-on-surface group-hover/node:text-primary group-hover/node:scale-110 transition-all duration-300 relative z-10">rocket_launch</span>
            </div>
            <div className="flex flex-col items-center mt-sm">
              <span className="font-label-mono text-xs bg-primary px-sm py-[2px] text-on-primary rounded border border-primary z-20 shadow-md">CEO</span>
              <span className="font-label-mono text-[9px] text-primary/80 mt-xs">Steve Jobs / Musk</span>
            </div>
          </div>

          {/* CFO */}
          <div className="absolute top-1/4 left-0 flex flex-col items-center group/node cursor-default animate-float" style={{ animationDelay: '0.8s' }}>
            <div className="w-16 h-16 bg-surface-container-highest border border-outline flex items-center justify-center rounded-xl transition-all duration-300 group-hover/node:scale-110 group-hover/node:border-primary group-hover/node:shadow-[0_0_15px_rgba(139,92,246,0.4)] relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover/node:opacity-100 transition-opacity" />
              <span className="material-symbols-outlined text-[28px] text-on-surface group-hover/node:text-primary group-hover/node:scale-110 transition-all duration-300 relative z-10">account_balance</span>
            </div>
            <div className="flex flex-col items-center mt-sm">
              <span className="font-label-mono text-xs bg-surface-container-highest px-sm py-[2px] rounded border border-outline-variant z-20 group-hover/node:border-primary transition-colors">CFO</span>
              <span className="font-label-mono text-[9px] text-primary/80 mt-xs">Naval Ravikant</span>
            </div>
          </div>

          {/* CMO */}
          <div className="absolute top-1/4 right-0 flex flex-col items-center group/node cursor-default animate-float" style={{ animationDelay: '0.4s' }}>
            <div className="w-16 h-16 bg-surface-container-highest border border-outline flex items-center justify-center rounded-xl transition-all duration-300 group-hover/node:scale-110 group-hover/node:border-primary group-hover/node:shadow-[0_0_15px_rgba(139,92,246,0.4)] relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover/node:opacity-100 transition-opacity" />
              <span className="material-symbols-outlined text-[28px] text-on-surface group-hover/node:text-primary group-hover/node:scale-110 transition-all duration-300 relative z-10">campaign</span>
            </div>
            <div className="flex flex-col items-center mt-sm">
              <span className="font-label-mono text-xs bg-surface-container-highest px-sm py-[2px] rounded border border-outline-variant z-20 group-hover/node:border-primary transition-colors">CMO</span>
              <span className="font-label-mono text-[9px] text-primary/80 mt-xs">Alex Hormozi</span>
            </div>
          </div>

          {/* CPO */}
          <div className="absolute bottom-1/4 left-12 flex flex-col items-center group/node cursor-default animate-float" style={{ animationDelay: '0.6s' }}>
            <div className="w-16 h-16 bg-surface-container-highest border border-outline flex items-center justify-center rounded-xl transition-all duration-300 group-hover/node:scale-110 group-hover/node:border-primary group-hover/node:shadow-[0_0_15px_rgba(139,92,246,0.4)] relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover/node:opacity-100 transition-opacity" />
              <span className="material-symbols-outlined text-[28px] text-on-surface group-hover/node:text-primary group-hover/node:scale-110 transition-all duration-300 relative z-10">architecture</span>
            </div>
            <div className="flex flex-col items-center mt-sm">
              <span className="font-label-mono text-xs bg-surface-container-highest px-sm py-[2px] rounded border border-outline-variant z-20 group-hover/node:border-primary transition-colors">CPO</span>
              <span className="font-label-mono text-[9px] text-primary/80 mt-xs">Brian Chesky</span>
            </div>
          </div>

          {/* CRO */}
          <div className="absolute bottom-1/4 right-12 flex flex-col items-center group/node cursor-default animate-float" style={{ animationDelay: '1.0s' }}>
            <div className="w-16 h-16 bg-surface-container-highest border border-outline flex items-center justify-center rounded-xl transition-all duration-300 group-hover/node:scale-110 group-hover/node:border-primary group-hover/node:shadow-[0_0_15px_rgba(139,92,246,0.4)] relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover/node:opacity-100 transition-opacity" />
              <span className="material-symbols-outlined text-[28px] text-on-surface group-hover/node:text-primary group-hover/node:scale-110 transition-all duration-300 relative z-10">handshake</span>
            </div>
            <div className="flex flex-col items-center mt-sm">
              <span className="font-label-mono text-xs bg-surface-container-highest px-sm py-[2px] rounded border border-outline-variant z-20 group-hover/node:border-primary transition-colors">CRO</span>
              <span className="font-label-mono text-[9px] text-primary/80 mt-xs">Jason Lemkin</span>
            </div>
          </div>

          {/* SVG Connections */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
            viewBox="0 0 1000 400"
          >
            <line className="line-animation" stroke="#8B5CF6" strokeWidth="1" x1="500" x2="500" y1="20" y2="150" />
            <line className="line-animation" stroke="#8B5CF6" strokeWidth="1" x1="65" x2="450" y1="120" y2="180" />
            <line className="line-animation" stroke="#8B5CF6" strokeWidth="1" x1="935" x2="550" y1="120" y2="180" />
            <line className="line-animation" stroke="#8B5CF6" strokeWidth="1" x1="150" x2="460" y1="280" y2="230" />
            <line className="line-animation" stroke="#8B5CF6" strokeWidth="1" x1="850" x2="540" y1="280" y2="230" />
          </svg>
        </div>

        <div className="md:hidden flex flex-col gap-md py-md">
          <div className="flex flex-col border border-outline p-md bg-black glow-border rounded-xl">
            <div className="flex items-center gap-md mb-xs">
              <span className="material-symbols-outlined text-primary text-[24px] animate-pulse">fact_check</span>
              <div className="font-label-mono text-sm text-primary font-bold">Supervisor Node</div>
            </div>
            <div className="font-label-mono text-[10px] text-outline ml-[40px]">Strict consensus evaluator</div>
          </div>
          
          <div className="flex flex-col gap-sm pl-md border-l border-primary/30 ml-md">
            
            <div className="border border-outline bg-surface-container-highest p-sm flex items-center gap-md rounded-lg">
              <div className="w-10 h-10 bg-surface-container-low border border-outline flex items-center justify-center rounded">
                <span className="material-symbols-outlined text-on-surface text-[20px]">rocket_launch</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-sm">
                  <span className="font-label-mono text-xs bg-primary px-xs py-[2px] rounded text-on-primary">CEO</span>
                  <span className="font-label-mono text-[10px] text-primary/80">Jobs & Musk</span>
                </div>
              </div>
            </div>

            <div className="border border-outline bg-surface-container-highest p-sm flex items-center gap-md rounded-lg">
              <div className="w-10 h-10 bg-surface-container-low border border-outline flex items-center justify-center rounded">
                <span className="material-symbols-outlined text-on-surface text-[20px]">account_balance</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-sm">
                  <span className="font-label-mono text-xs bg-surface-container-lowest border border-outline-variant px-xs py-[2px] rounded text-on-surface">CFO</span>
                  <span className="font-label-mono text-[10px] text-primary/80">Naval Ravikant</span>
                </div>
              </div>
            </div>

            <div className="border border-outline bg-surface-container-highest p-sm flex items-center gap-md rounded-lg">
              <div className="w-10 h-10 bg-surface-container-low border border-outline flex items-center justify-center rounded">
                <span className="material-symbols-outlined text-on-surface text-[20px]">campaign</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-sm">
                  <span className="font-label-mono text-xs bg-surface-container-lowest border border-outline-variant px-xs py-[2px] rounded text-on-surface">CMO</span>
                  <span className="font-label-mono text-[10px] text-primary/80">Alex Hormozi</span>
                </div>
              </div>
            </div>

            <div className="border border-outline bg-surface-container-highest p-sm flex items-center gap-md rounded-lg">
              <div className="w-10 h-10 bg-surface-container-low border border-outline flex items-center justify-center rounded">
                <span className="material-symbols-outlined text-on-surface text-[20px]">architecture</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-sm">
                  <span className="font-label-mono text-xs bg-surface-container-lowest border border-outline-variant px-xs py-[2px] rounded text-on-surface">CPO</span>
                  <span className="font-label-mono text-[10px] text-primary/80">Brian Chesky</span>
                </div>
              </div>
            </div>

            <div className="border border-outline bg-surface-container-highest p-sm flex items-center gap-md rounded-lg">
              <div className="w-10 h-10 bg-surface-container-low border border-outline flex items-center justify-center rounded">
                <span className="material-symbols-outlined text-on-surface text-[20px]">handshake</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-sm">
                  <span className="font-label-mono text-xs bg-surface-container-lowest border border-outline-variant px-xs py-[2px] rounded text-on-surface">CRO</span>
                  <span className="font-label-mono text-[10px] text-primary/80">Jason Lemkin</span>
                </div>
              </div>
            </div>

          </div>
        </div>


      </div>
    </section>
  );
}
