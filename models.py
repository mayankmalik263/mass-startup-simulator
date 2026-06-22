import re
from pydantic import BaseModel, Field, field_validator
from typing import List


class PricingTier(BaseModel):
    name: str = Field(min_length=2, max_length=50, description="Name of the pricing tier (e.g. Free, Pro, Enterprise)")
    price: str = Field(min_length=1, max_length=50, description="Price or billing model (e.g. $0/mo, $49/mo, Custom)")
    features: List[str] = Field(min_length=1, description="List of key features included in this tier (at least 1 feature)")


class FinancialSnapshot(BaseModel):
    monthly_burn: str = Field(min_length=2, max_length=100, description="Monthly burn rate (e.g., $10,000/mo)")
    funding_needed: str = Field(min_length=2, max_length=100, description="Total funding needed (e.g., $150,000)")
    runway: str = Field(min_length=2, max_length=100, description="Expected runway in months (e.g., 12 months)")
    break_even_target: str = Field(min_length=2, max_length=100, description="Breakeven target (e.g., 18 months, $20k MRR)")

    @field_validator("monthly_burn", "funding_needed", "runway", "break_even_target", mode="before")
    @classmethod
    def check_financial_format(cls, value: str) -> str:
        if not isinstance(value, str):
            value = str(value)
        val = value.strip()
        # Ensure value contains at least one numeric digit
        if not re.search(r'\d', val):
            raise ValueError("must contain at least one numeric digit (e.g., $10k, 12 months, $0)")
        # Ensure value is not placeholder text
        if any(placeholder in val.lower() for placeholder in ["n/a", "unknown", "tbd", "to be determined", "none"]):
            raise ValueError("cannot be placeholder text like N/A, unknown, TBD, or none")
        return val


class RevenueTarget(BaseModel):
    day: int = Field(gt=0, description="Milestone day (e.g., 30, 60, 90)")
    mrr: str = Field(min_length=2, max_length=50, description="Target MRR (e.g., $5,000 MRR)")
    notes: str = Field(default="", description="Assumptions or context for the target")


class Conflict(BaseModel):
    title: str = Field(min_length=5, max_length=150, description="Brief summary of the conflict")
    description: str = Field(min_length=10, max_length=1000, description="Detailed explanation of the debate and consensus reached")


class StartupBusinessPlan(BaseModel):
    startup_idea: str = Field(min_length=5, max_length=500, description="The original startup idea simulated")
    mission: str = Field(min_length=10, max_length=500, description="Startup mission statement")
    problem: str = Field(min_length=10, max_length=1000, description="The key problem solved")
    target_customer: str = Field(min_length=10, max_length=500, description="Primary customer persona")
    business_model: List[PricingTier] = Field(min_length=1, description="Pricing tier structure")
    financial_snapshot: FinancialSnapshot = Field(description="Burn rate, funding, runway, breakeven targets")
    go_to_market: List[str] = Field(min_length=1, description="List of marketing and launch strategies")
    product_mvp: List[str] = Field(min_length=1, description="Key features of the MVP product")
    revenue_targets: List[RevenueTarget] = Field(min_length=1, description="Financial MRR milestones")
    key_conflicts: List[Conflict] = Field(default_factory=list, description="Team conflicts encountered and resolved")
    final_verdict: str = Field(min_length=20, max_length=3000, description="Supervisor and team consensus summary of viability")