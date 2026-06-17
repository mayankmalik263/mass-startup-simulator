'use client';

export default function Stats() {
  const stats = [
    { number: '5', label: 'AI Agents' },
    { number: '3', label: 'Debate Rounds' },
    { number: 'JSON', label: 'Structured Output' },
    { number: 'FASTAPI', label: '+ LangGraph' },
  ];

  return (
    <section id="stats" className="py-2xl max-w-[80rem] mx-auto px-margin-mobile md:px-margin-desktop">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-xl">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="font-stats-lg text-primary mb-xs">{stat.number}</div>
            <div className="font-label-mono text-on-surface-variant uppercase">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
