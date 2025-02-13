from typing import Dict, Optional
from pydantic import BaseModel, Field

# Common Model for Financial Entries (Income, Expense, Debt, Investment)
class FinancialEntry(BaseModel):
    monthly_amt: float | None = Field(None, alias="monthlyAmt", description="Monthly amount in respective category")
    start_year: int = Field(..., alias="stYr", description="Start year")
    num_of_years: int = Field(..., alias="numOfYr", description="Number of years applicable")
    rate_of_inc: float | None = Field(None, alias="rateOfInc", description="Rate of increase (for income/expense/investment)")
    rate_of_int: float | None = Field(None, alias="rateOfInt", description="Rate of interest (for investments/debts)")
    total_amt: float | None = Field(None, alias="totalAmt", description="Total amount (for debts)")
    down_pay: float | None = Field(None, alias="downPay", description="Down payment (for debts)")
    current_amt: float | None = Field(None, alias="currAmt", description="Current amount invested (for investments)")

    class Config:
        populate_by_name = True  # Allows input using alias names (camelCase)

# Main Simulation Model
class SimulationInput(BaseModel):
    sim_years: int = Field(..., alias="simYr", description="Total simulation years")
    inflation_rate: float = Field(..., alias="inflRate", description="Inflation rate percentage")
    ltcg_tax_rate: float | None = Field(None, alias="ltcgTaxRate", description="Long-term capital gains tax rate")
    stcg_tax_rate: float | None = Field(None, alias="stcgTaxRate", description="Short-term capital gains tax rate")
    country: str = Field(..., alias="country", description="Country name")
    currency: str | None = Field(None, alias="currency", description="Currency symbol")
    income: Dict[str, FinancialEntry] | None = Field(None, alias="income", description="Income sources (dynamic keys)")
    expense: Dict[str, FinancialEntry] | None = Field(None, alias="expense", description="Expense categories (dynamic keys)")
    debt: Dict[str, FinancialEntry] | None = Field(None, alias="debt", description="Debt categories (dynamic keys)")
    investment: Dict[str, FinancialEntry] | None = Field(None, alias="inv", description="Investment categories (dynamic keys)")

    class Config:
        populate_by_name = True  # Enables JSON aliasing

# Summary Model
class Summary(BaseModel):
    eaten_inv: int = Field(..., alias="eatenInv")
    net_worth: int = Field(..., alias="ntWrth")
    inflation_adjusted_net_worth: int = Field(..., alias="inflAdjNtWrth")

    class Config:
        populate_by_name = True

# Ratios Model
class Ratio(BaseModel):
    high_risk: float = Field(..., alias="highRiskEat")
    moderate_risk: float = Field(..., alias="moderateRiskEat")
    low_risk: float = Field(..., alias="lowRiskEat")

    class Config:
        populate_by_name = True

# Yearly Data Model
class YearData(BaseModel):
    income: Dict[str, int] | None = Field(None, alias="income", description="Dynamic keys for income sources (e.g., salary, bonus)")
    expense: Dict[str, int] | None = Field(None, alias="expense", description="Dynamic keys for expenses (e.g., rent, food)")
    debt: Dict[str, int] | None = Field(None, alias="debt", description="Dynamic keys for debts (e.g., homeLoan, carLoan)")
    investment: Dict[str, int] | None = Field(None, alias="inv", description="Dynamic keys for investments (e.g., stocks, crypto)")
    summary: Summary = Field(..., alias="summary", description="Summary of financial details")
    ratio: Ratio = Field(..., alias="ratio", description="Ratio calculations for financials")

    class Config:
        populate_by_name = True

# Simulation Output Model (Mapping Years to Data)
class SimulationOutput(BaseModel):
    _root_: Dict[str, YearData]  # Infinite mapping of years (e.g., {2025: YearData, 2026: YearData})

    class Config:
        populate_by_name = True
