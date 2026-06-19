import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | MASS',
  description: 'Terms of Service for MASS — Multi-Agent Startup Simulator.',
};

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="font-label-mono text-outline text-xs">
            Last updated: June 19, 2026
          </p>
        </div>

        <div className="space-y-xl">
          <Section title="1. Acceptance of Terms">
            <p>
              By accessing or using MASS (&ldquo;Multi-Agent Startup Simulator&rdquo;), you agree to be bound by these
              Terms of Service. If you do not agree, do not use the platform. MASS is operated by{' '}
              <strong className="text-primary">Mayank Malik</strong>.
            </p>
          </Section>

          <Section title="2. Service Description">
            <p>
              MASS is an AI-powered startup simulation tool that uses multiple specialized AI agents to analyze,
              debate, and produce structured business plans based on user-submitted startup ideas. The service is
              provided <strong className="text-on-surface">&ldquo;as is&rdquo;</strong> for educational and
              exploratory purposes.
            </p>
          </Section>

          <Section title="3. No Professional Advice">
            <div className="border-l-2 border-tertiary pl-md mb-md bg-tertiary/5 py-sm">
              <p className="text-on-surface">
                <strong>Important:</strong> MASS generates AI-produced content. The output is{' '}
                <strong>not</strong> professional financial, legal, or business advice. Do not make real business
                decisions solely based on MASS output. Always consult qualified professionals before acting on any
                startup plan.
              </p>
            </div>
            <p>
              The AI agents are language models that simulate executive reasoning. Their output may contain
              inaccuracies, outdated information, or unrealistic projections. Use the results as a starting
              point for further research, not as a definitive plan.
            </p>
          </Section>

          <Section title="4. Intellectual Property">
            <h4 className="font-label-mono text-on-surface text-sm mb-sm">4.1 Platform Ownership</h4>
            <p className="mb-md">
              The MASS platform — including its architecture, agent design, debate flow, state management system,
              prompt engineering, UI design, and all associated code — is the original work of{' '}
              <strong className="text-primary">Mayank Malik</strong>.
              Copyright © 2026 Mayank Malik. All rights reserved.
            </p>

            <h4 className="font-label-mono text-on-surface text-sm mb-sm">4.2 Open Source License</h4>
            <p className="mb-md">
              The source code is released under the <strong className="text-on-surface">MIT License</strong>.
              This means you may use, copy, modify, and distribute the code provided that:
            </p>
            <ul className="space-y-xs ml-md mb-md">
              <li className="flex items-start gap-xs">
                <span className="text-primary mt-[2px]">→</span>
                The original copyright notice and MIT license text are included in all copies or substantial
                portions of the software.
              </li>
              <li className="flex items-start gap-xs">
                <span className="text-primary mt-[2px]">→</span>
                Proper attribution to Mayank Malik as the original author is maintained.
              </li>
            </ul>
            <p className="mb-md">
              Failure to include the required copyright notice and license constitutes a violation of the
              MIT License terms and may be subject to legal action.
            </p>

            <h4 className="font-label-mono text-on-surface text-sm mb-sm">4.3 User Content</h4>
            <p>
              You retain full ownership of the startup ideas and context you submit to MASS. We do not claim
              any rights over your input or the generated output. The simulation results belong to you.
            </p>
          </Section>

          <Section title="5. Acceptable Use">
            <p className="mb-md">You agree not to:</p>
            <ul className="space-y-xs ml-md">
              <li className="flex items-start gap-xs">
                <span className="text-error mt-[2px]">•</span>
                Use MASS to generate content that is illegal, harmful, or violates the rights of others.
              </li>
              <li className="flex items-start gap-xs">
                <span className="text-error mt-[2px]">•</span>
                Attempt to overload, disrupt, or reverse-engineer the platform&apos;s infrastructure.
              </li>
              <li className="flex items-start gap-xs">
                <span className="text-error mt-[2px]">•</span>
                Scrape, crawl, or programmatically access the platform in a way that degrades service for others.
              </li>
              <li className="flex items-start gap-xs">
                <span className="text-error mt-[2px]">•</span>
                Misrepresent MASS output as professional advice to third parties.
              </li>
            </ul>
          </Section>

          <Section title="6. Limitation of Liability">
            <p>
              To the maximum extent permitted by law, Mayank Malik and the MASS project shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages, including but not limited to loss
              of profits, data, or business opportunities, arising from your use of the platform or reliance on its
              output. The platform is provided without warranties of any kind, express or implied.
            </p>
          </Section>

          <Section title="7. Disclaimer of Warranties">
            <p>
              MASS is provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis. We make no warranties,
              expressed or implied, regarding the accuracy, reliability, or completeness of the AI-generated content.
              We do not guarantee uninterrupted access to the service.
            </p>
          </Section>

          <Section title="8. Modifications">
            <p>
              We reserve the right to modify these Terms at any time. Changes take effect immediately upon being
              posted on this page. Your continued use of MASS after changes constitutes acceptance of the new terms.
            </p>
          </Section>

          <Section title="9. Termination">
            <p>
              We reserve the right to restrict or terminate access to MASS for any user who violates these terms
              or engages in behavior that could harm the platform or its users.
            </p>
          </Section>

          <Section title="10. Governing Law">
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes
              arising from these Terms shall be subject to the exclusive jurisdiction of the courts in India.
            </p>
          </Section>

          <Section title="11. Contact">
            <p>
              For questions about these terms, contact Mayank Malik on{' '}
              <a href="https://x.com/systemslearner" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                𝕏 @systemslearner
              </a>{' '}
              or open an issue on{' '}
              <a href="https://github.com/mayankmalik263/MASS/issues" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                GitHub
              </a>.
            </p>
          </Section>

          {/* MIT License block */}
          <div className="border border-primary/30 bg-primary/5 p-lg">
            <h3 className="font-label-mono text-primary mb-md uppercase text-sm">MIT License</h3>
            <pre className="font-mono text-[11px] text-on-surface-variant leading-relaxed whitespace-pre-wrap">
{`Copyright (c) 2026 Mayank Malik

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
            </pre>
          </div>
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
