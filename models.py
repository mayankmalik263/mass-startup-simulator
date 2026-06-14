from pydantic import BaseModel, Field
from typing import List


class PricingTier(BaseModel):
    name: str
    price: str
    features: List[str]


class FinancialSnapshot(BaseModel):
    monthly_burn: str
    funding_needed: str
    runway: str
    break_even_target: str


class RevenueTarget(BaseModel):
    day: int
    mrr: str
    notes: str = ""


class Conflict(BaseModel):
    title: str
    description: str


class StartupBusinessPlan(BaseModel):
    startup_idea: str
    mission: str
    problem: str
    target_customer: str
    business_model: List[PricingTier]
    financial_snapshot: FinancialSnapshot
    go_to_market: List[str]
    product_mvp: List[str]
    revenue_targets: List[RevenueTarget]
    key_conflicts: List[Conflict]
    final_verdict: str