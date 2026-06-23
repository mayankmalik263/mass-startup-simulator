import React from 'react';
import type { BusinessPlan } from '@/types/simulation';

export function ResultsDisplay({ plan }: { plan: BusinessPlan }) {
  if (!plan) return null;

  return (
    <div className="columns-1 md:columns-2 gap-md">
      {/* Mission */}
      {plan.mission && (
        <div className="break-inside-avoid mb-md">
          <Card label="MISSION" icon="rocket_launch">
            <p className="font-body-lg">{plan.mission}</p>
          </Card>
        </div>
      )}

      {/* Problem */}
      {plan.problem && (
        <div className="break-inside-avoid mb-md">
          <Card label="THE PROBLEM" icon="report_problem">
            <p className="font-body-sm text-on-surface-variant">{plan.problem}</p>
          </Card>
        </div>
      )}

      {/* Target Customer */}
      {plan.target_customer && (
        <div className="break-inside-avoid mb-md">
          <Card label="TARGET CUSTOMER" icon="groups">
            <p className="font-body-lg">{plan.target_customer}</p>
          </Card>
        </div>
      )}

      {/* Business Model */}
      {plan.business_model && plan.business_model.length > 0 && (
        <div className="break-inside-avoid mb-md">
          <Card label="BUSINESS MODEL" icon="payments">
            <div className="flex flex-col gap-sm">
              {plan.business_model.map((tier, i) => (
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
        </div>
      )}

      {/* Financial Snapshot */}
      {plan.financial_snapshot && Object.keys(plan.financial_snapshot).length > 0 && (
        <div className="break-inside-avoid mb-md">
          <Card label="FINANCIAL SNAPSHOT" icon="account_balance">
            <div className="grid grid-cols-2 gap-sm">
              {Object.entries(plan.financial_snapshot).map(([key, val]) => (
                <div key={key} className="text-center border border-outline-variant p-md bg-black">
                  <div className="font-label-mono text-[10px] text-on-surface-variant uppercase mb-xs">
                    {key.replace(/_/g, ' ')}
                  </div>
                  <div className="font-stats-lg text-primary">{val as string}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Go-to-Market */}
      {plan.go_to_market && plan.go_to_market.length > 0 && (
        <div className="break-inside-avoid mb-md">
          <Card label="GO-TO-MARKET (30 DAYS)" icon="campaign">
            <ol className="space-y-sm">
              {plan.go_to_market.map((tactic, i) => (
                <li key={i} className="font-body-sm text-on-surface-variant flex items-start gap-sm">
                  <span className="font-label-mono text-primary shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  {tactic}
                </li>
              ))}
            </ol>
          </Card>
        </div>
      )}

      {/* Product MVP */}
      {plan.product_mvp && plan.product_mvp.length > 0 && (
        <div className="break-inside-avoid mb-md">
          <Card label="PRODUCT MVP" icon="build">
            <ul className="space-y-sm">
              {plan.product_mvp.map((feat, i) => (
                <li key={i} className="font-body-sm text-on-surface-variant flex items-start gap-sm">
                  <span className="text-primary">→</span> {feat}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {/* Revenue Targets */}
      {plan.revenue_targets && plan.revenue_targets.length > 0 && (
        <div className="break-inside-avoid mb-md">
          <Card label="REVENUE TARGETS" icon="trending_up">
            <div className="flex flex-col gap-sm">
              {plan.revenue_targets.map((target, i) => (
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
        </div>
      )}

      {/* Conflicts */}
      {plan.key_conflicts && plan.key_conflicts.length > 0 && (
        <div className="break-inside-avoid mb-md">
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
        </div>
      )}

      {/* Final Verdict */}
      {plan.final_verdict && (
        <div className="break-inside-avoid mb-md">
          <Card label="FINAL VERDICT" icon="gavel" highlight>
            <p className="font-body-lg">{plan.final_verdict}</p>
          </Card>
        </div>
      )}
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
