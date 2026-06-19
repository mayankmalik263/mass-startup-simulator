import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | MASS',
  description: 'Privacy Policy for MASS — Multi-Agent Startup Simulator. Learn how we handle your data.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
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

      <main className="pt-[120px] pb-2xl px-margin-mobile md:px-margin-desktop max-w-[48rem] mx-auto">
        <div className="mb-2xl">
          <div className="font-label-mono text-primary text-xs mb-sm uppercase tracking-widest">Legal</div>
          <h1 className="font-display text-[48px] md:text-[64px] font-extrabold tracking-tighter mb-md leading-tight">
            Privacy Policy
          </h1>
          <p className="font-label-mono text-outline text-xs">
            Last updated: June 19, 2026
          </p>
        </div>

        <div className="space-y-xl">
          <Section title="1. Introduction">
            <p>
              MASS (&ldquo;Multi-Agent Startup Simulator&rdquo;) is an open-source project created and maintained by{' '}
              <strong className="text-primary">Mayank Malik</strong>. This Privacy Policy explains how we collect, use,
              and protect information when you use the MASS platform at{' '}
              <a href="https://mass-multi-agent-startup-simulator.vercel.app" className="text-primary hover:underline">
                mass-multi-agent-startup-simulator.vercel.app
              </a>.
            </p>
          </Section>

          <Section title="2. Information We Collect">
            <h4 className="font-label-mono text-on-surface text-sm mb-sm">2.1 Simulation Input Data</h4>
            <p className="mb-md">
              When you submit a simulation, we receive the startup idea and optional context fields (target audience,
              market, revenue model, constraints) you provide. This data is processed in real-time by our AI agents
              and is <strong className="text-on-surface">not permanently stored</strong> on our servers. Once the simulation
              completes and you receive the results, the input data is discarded from server memory.
            </p>

            <h4 className="font-label-mono text-on-surface text-sm mb-sm">2.2 Analytics</h4>
            <p className="mb-md">
              We use <strong className="text-on-surface">Vercel Analytics</strong> to collect anonymous, aggregated usage
              data such as page views, browser type, and geographic region. This data does not include your startup
              ideas or any personally identifiable information. Vercel Analytics is privacy-friendly and does not use
              cookies for tracking.
            </p>

            <h4 className="font-label-mono text-on-surface text-sm mb-sm">2.3 No Account Data</h4>
            <p>
              MASS does not require user accounts, login credentials, email addresses, or any form of registration.
              We do not collect or store personal information.
            </p>
          </Section>

          <Section title="3. Third-Party Services">
            <p className="mb-md">
              Your simulation inputs are sent to AI language models via{' '}
              <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                OpenRouter
              </a>{' '}
              for processing. OpenRouter routes requests to third-party LLM providers. We recommend reviewing{' '}
              <a href="https://openrouter.ai/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                OpenRouter&apos;s Privacy Policy
              </a>{' '}
              for details on how they handle data.
            </p>
            <p>
              We do not sell, share, or transfer your simulation data to any other third parties beyond what is
              necessary for AI processing.
            </p>
          </Section>

          <Section title="4. Data Retention">
            <p>
              Simulation data exists only in server memory during processing and is automatically discarded when the
              simulation completes or the server restarts. We do not maintain databases of user-submitted ideas or
              simulation results. Generated reports are returned to you in the browser and are not stored server-side.
            </p>
          </Section>

          <Section title="5. Open Source">
            <p>
              MASS is open-source software licensed under the{' '}
              <strong className="text-on-surface">MIT License</strong>. The source code is publicly available at{' '}
              <a href="https://github.com/mayankmalik263/Mass-Multi-Agent-STARTUP-Simulator-" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                github.com/mayankmalik263/Mass-Multi-Agent-STARTUP-Simulator-
              </a>
              . You can inspect exactly how your data is processed by reviewing the source code.
            </p>
          </Section>

          <Section title="6. Children's Privacy">
            <p>
              MASS is not directed at children under 13. We do not knowingly collect information from children.
            </p>
          </Section>

          <Section title="7. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. Changes will be reflected on this page with an
              updated &ldquo;Last updated&rdquo; date. Continued use of the platform after changes constitutes
              acceptance of the revised policy.
            </p>
          </Section>

          <Section title="8. Contact">
            <p>
              For privacy-related questions, reach out to Mayank Malik on{' '}
              <a href="https://x.com/systemslearner" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                𝕏 @systemslearner
              </a>{' '}
              or open an issue on the{' '}
              <a href="https://github.com/mayankmalik263/Mass-Multi-Agent-STARTUP-Simulator-/issues" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                GitHub repository
              </a>.
            </p>
          </Section>
        </div>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-outline-variant bg-surface-container-lowest p-lg">
      <h3 className="font-label-mono text-primary mb-md uppercase text-sm">{title}</h3>
      <div className="font-body-sm text-on-surface-variant leading-relaxed space-y-sm">
        {children}
      </div>
    </div>
  );
}
