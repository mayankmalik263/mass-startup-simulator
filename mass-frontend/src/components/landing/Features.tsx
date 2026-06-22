'use client';

const features = [
  {
    icon: 'groups',
    title: 'Multi-Agent Debate Engine',
    description:
      'Proprietary logic handles asynchronous debates between 5 specialized agents plus a consensus-evaluating Supervisor.',
    span: 'md:col-span-3',
  },
  {
    icon: 'verified',
    title: 'Consensus-Based Decision Making',
    description:
      "Decisions aren't just generated; they are voted upon and refined until agent consensus is reached.",
    span: 'md:col-span-3',
  },
  {
    icon: 'public',
    title: 'Context-Aware Persona Processing',
    description: 'Agents adapt their reasoning based on your specific target audience, market, and constraints.',
    span: 'md:col-span-2',
  },
  {
    icon: 'data_object',
    title: 'Structured Business Plans',
    description: 'UI-based viewing is live, with JSON export functionality currently being prototyped.',
    span: 'md:col-span-2',
  },
  {
    icon: 'bolt',
    title: 'Fast API-Powered Simulations',
    description: 'Fast, streamable simulation execution powered by Server-Sent Events.',
    span: 'md:col-span-2',
  },
];

export default function Features() {
  return (
    <section className="py-2xl bg-surface-container-lowest border-y border-outline-variant">
      <div className="max-w-[80rem] mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="mb-2xl">
          <h2 className="font-display text-headline-lg mb-sm">Engine Capabilities</h2>
          <p className="font-body-lg text-on-surface-variant">
            Tactical features for rigorous stress-testing.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-2 gap-md">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`${feature.span} p-lg border border-outline bg-black flex flex-col justify-between hover:border-primary transition-colors`}
            >
              <div>
                <span className="material-symbols-outlined text-primary mb-md block">
                  {feature.icon}
                </span>
                <h4 className="font-headline-md mb-sm">{feature.title}</h4>
              </div>
              <p className="font-body-sm text-on-surface-variant">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
