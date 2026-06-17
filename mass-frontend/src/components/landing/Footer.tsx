'use client';

export default function Footer() {
  const links = [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Github', href: 'https://github.com/mayankmalik263/MASS', external: true },
    { label: 'Twitter', href: 'https://twitter.com', external: true },
  ];

  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant">
      <div className="flex flex-col md:flex-row justify-between items-center px-margin-desktop py-xl w-full max-w-[80rem] mx-auto">
        <div className="mb-lg md:mb-0">
          <div className="font-display text-on-surface font-bold uppercase mb-xs tracking-widest">
            MASS
          </div>
          <p className="font-label-mono text-[10px] text-outline">v1.2.0-STABLE</p>
        </div>
        <div className="flex gap-xl mb-lg md:mb-0">
          {links.map((link) => (
            <a
              key={link.label}
              className="font-label-mono text-outline hover:text-primary-container transition-colors"
              href={link.href}
              {...(link.external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="font-label-mono text-tertiary">
          © 2026 MASS SIMULATOR. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
}
