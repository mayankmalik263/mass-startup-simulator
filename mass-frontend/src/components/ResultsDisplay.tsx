import React from 'react';
import type { BusinessPlan } from '@/types/simulation';

export function ResultsDisplay({ plan }: { plan: BusinessPlan }) {
  if (!plan) return null;

  return (
    <div className="space-y-md">
      {/* Mission & Problem */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        <Card label="MISSION" icon="rocket_launch">
          <p className="font-body-lg">{plan.mission}</p>
        </Card>
        <Card label="THE PROBLEM" icon="report_problem">
          <p className="font-body-sm text-on-surface-variant">{plan.problem}</p>
        </Card>
      </div>

      {/* Target Customer */}
      <Card label="TARGET CUSTOMER" icon="groups">
        <p className="font-body-lg">{plan.target_customer}</p>
      </Card>

      {/* Business Model */}
      <Card label="BUSINESS MODEL" icon="payments">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-sm">
          {plan.business_model?.map((tier, i) => (
            <div key={i} className="border border-outline-variant p-md bg-black">
              <div className="font-label-mono text-primary mb-xs">{tier.name}</div>
              <div className="font-stats-lg text-on-surface mb-sm">{tier.price}</div>
              <ul className="space-y-1">
                {tier.features?.map((f, j) => (
                  <li key={j} className="font-body-sm text-on-surface-variant flex items-start gap-xs">
                    <span className="text-primary mt-[2px]">•</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      {/* Financial Snapshot */}
      <Card label="FINANCIAL SNAPSHOT" icon="account_balance">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-sm">
          {plan.financial_snapshot && Object.entries(plan.financial_snapshot).map(([key, val]) => (
            <div key={key} className="text-center border border-outline-variant p-md bg-black">
              <div className="font-label-mono text-[10px] text-on-surface-variant uppercase mb-xs">
                {key.replace(/_/g, ' ')}
              </div>
              <div className="font-stats-lg text-primary">{val}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Go-to-Market + MVP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        <Card label="GO-TO-MARKET (30 DAYS)" icon="campaign">
          <ol className="space-y-sm">
            {plan.go_to_market?.map((tactic, i) => (
              <li key={i} className="font-body-sm text-on-surface-variant flex items-start gap-sm">
                <span className="font-label-mono text-primary shrink-0">{String(i + 1).padStart(2, '0')}</span>
                {tactic}
              </li>
            ))}
          </ol>
        </Card>
        <Card label="PRODUCT MVP" icon="build">
          <ul className="space-y-sm">
            {plan.product_mvp?.map((feat, i) => (
              <li key={i} className="font-body-sm text-on-surface-variant flex items-start gap-sm">
                <span className="text-primary">→</span> {feat}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Revenue Targets */}
      <Card label="REVENUE TARGETS" icon="trending_up">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-sm">
          {plan.revenue_targets?.map((target, i) => (
            <div key={i} className="border border-outline-variant p-md bg-black text-center">
              <div className="font-label-mono text-on-surface-variant mb-xs">DAY {target.day}</div>
              <div className="font-stats-lg text-primary mb-xs">{target.mrr}</div>
              {target.notes && (
                <div className="font-body-sm text-on-surface-variant text-xs">{target.notes}</div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Conflicts */}
      {plan.key_conflicts?.length > 0 && (
        <Card label="KEY CONFLICTS DETECTED" icon="warning">
          <div className="space-y-sm">
            {plan.key_conflicts.map((conflict, i) => (
              <div key={i} className="border-l-2 border-tertiary pl-md">
                <div className="font-headline-md text-sm mb-xs">{conflict.title}</div>
                <p className="font-body-sm text-on-surface-variant">{conflict.description}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Final Verdict */}
      <Card label="FINAL VERDICT" icon="gavel" highlight>
        <p className="font-body-lg">{plan.final_verdict}</p>
      </Card>
    </div>
  );
}

function Card({
  label,
  icon,
  highlight,
  children,
}: {
  label: string;
  icon: string;
  highlight?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`border p-lg ${
        highlight
          ? 'border-primary bg-primary/5 glow-border'
          : 'border-outline-variant bg-surface-container-lowest'
      }`}
    >
      <div className="flex items-center gap-sm mb-md">
        <span className="material-symbols-outlined text-primary text-[20px]">{icon}</span>
        <span className="font-label-mono text-primary">{label}</span>
      </div>
      {children}
    </div>
  );
}
