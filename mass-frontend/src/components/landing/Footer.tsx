'use client';

import Link from 'next/link';

export default function Footer() {
  const links = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Docs', href: '/docs' },
    { label: 'Github', href: 'https://github.com/mayankmalik263/Mass-Multi-Agent-STARTUP-Simulator-', external: true },
    { label: '𝕏', href: 'https://x.com/systemslearner', external: true },
  ];

  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant">
      <div className="flex flex-col md:flex-row justify-between items-center px-margin-desktop py-xl w-full max-w-[80rem] mx-auto">
        <div className="mb-lg md:mb-0">
          <Link href="/" className="font-display text-on-surface font-bold uppercase mb-xs tracking-widest block">
            MASS
          </Link>
          <p className="font-label-mono text-[10px] text-outline">v1.2.0-STABLE</p>
        </div>
        <div className="flex gap-xl mb-lg md:mb-0 flex-wrap justify-center">
          {links.map((link) =>
            link.external ? (
              <a
                key={link.label}
                className="font-label-mono text-outline hover:text-primary-container transition-colors"
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                className="font-label-mono text-outline hover:text-primary-container transition-colors"
                href={link.href}
              >
                {link.label}
              </Link>
            )
          )}
        </div>
        <div className="font-label-mono text-tertiary text-center md:text-right">
          © 2026 Mayank Malik. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
