'use client';

export default function HowItWorks() {
  return (
    <section id="process" className="py-2xl max-w-[80rem] mx-auto px-margin-mobile md:px-margin-desktop">
      <h2 className="font-display text-headline-lg text-center mb-2xl">Process Architecture</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        {/* Step 1 */}
        <div className="p-lg border border-outline-variant bg-surface-container-lowest relative">
          <div className="font-label-mono text-primary mb-md">01 // INTAKE</div>
          <h3 className="font-headline-md mb-md">Submit Idea</h3>
          <p className="font-body-sm text-on-surface-variant">
            Provide a high-level summary of your startup concept. Our system prepares the briefing
            documents for the agent council.
          </p>
        </div>

        {/* Step 2 */}
        <div className="p-lg border border-primary bg-surface-container-low relative glow-border">
          <div className="font-label-mono text-primary mb-md">02 // EXECUTION</div>
          <h3 className="font-headline-md mb-md">AI Debate</h3>
          <p className="font-body-sm text-on-surface-variant">
            Agents roleplay distinct executive functions, cross-examining your business model from
            financial, product, and market perspectives.
          </p>
        </div>

        {/* Step 3 */}
        <div className="p-lg border border-outline-variant bg-surface-container-lowest relative">
          <div className="font-label-mono text-primary mb-md">03 // OUTPUT</div>
          <h3 className="font-headline-md mb-md">Business Plan</h3>
          <p className="font-body-sm text-on-surface-variant">
            The consensus is synthesized into a detailed, structured business plan including
            roadmap, risk assessment, and GTM strategy.
          </p>
        </div>
      </div>
    </section>
  );
}
