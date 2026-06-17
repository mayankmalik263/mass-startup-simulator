/* ─── Request ─────────────────────────────────────── */

export interface SimulateRequest {
  idea: string;
  target_audience?: string;
  market?: string;
  revenue_model?: string;
  constraints?: string;
}

/* ─── Response models ─────────────────────────────── */

export interface PricingTier {
  name: string;
  price: string;
  features: string[];
}

export interface FinancialSnapshot {
  monthly_burn: string;
  funding_needed: string;
  runway: string;
  break_even_target: string;
}

export interface RevenueTarget {
  day: number;
  mrr: string;
  notes?: string;
}

export interface Conflict {
  title: string;
  description: string;
}

export interface BusinessPlan {
  startup_idea: string;
  mission: string;
  problem: string;
  target_customer: string;
  business_model: PricingTier[];
  financial_snapshot: FinancialSnapshot;
  go_to_market: string[];
  product_mvp: string[];
  revenue_targets: RevenueTarget[];
  key_conflicts: Conflict[];
  final_verdict: string;
}

export interface SimulationResult {
  final_report: string;
  business_plan: BusinessPlan;
  conflicts: Conflict[];
  debate_rounds: number;
  messages_count: number;
}

/* ─── Job status ──────────────────────────────────── */

export type JobStatus = 'pending' | 'running' | 'done' | 'error';

export interface SimulationJob {
  job_id: string;
  status: JobStatus;
  result?: SimulationResult;
  error?: string;
}
