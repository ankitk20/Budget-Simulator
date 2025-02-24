
import pandas as pd
from scipy.stats import linregress
from typing import Dict

from models.models import AnalysisModel

def aggregate_yearly_data(payload: AnalysisModel) -> Dict[str, Dict[str, float]]:
    """
    Aggregates nested data (e.g., Income, Expense, Debt, Investment) by summing relevant components for each year.
    Returns a simplified structure for trend analysis.
    """
    aggregated_data = {}

    for year, data in payload.root.items():
        # Skip metadata (locale, currency, symbol)
        if year in ["locale", "currency", "symbol"]:
            continue
        
        # Aggregate income: Sum of all income components (e.g., Active)
        income_total = sum(data.get("Income", {}).values())

        # Aggregate expenses: Sum of all expense components (e.g., Grocery, Utility, Rent)
        expense_total = sum(data.get("Expense", {}).values())

        # Aggregate debt: Sum of all debt components (e.g., House)
        debt_total = sum(data.get("Debt", {}).values())

        # Aggregate investments: Sum of all investment components (e.g., Low Risk, Savings)
        investment_total = sum(data.get("Investment", {}).values())

        # Create summary data for each year
        aggregated_data[year] = {
            "Income": income_total,
            "Expense": expense_total,
            "Debt": debt_total,
            "Investment": investment_total,
        }
    
    return aggregated_data

def analyze_trend(payload: AnalysisModel):
    
    # Initialize list for insights
    insights = {
        "Income": "",
        "Expense": "",
        "Debt": "",
        "Investment": "",
        "Net Worth": "",
        "Summary": []
    }
    
    data = {
        "Income": payload.Income,
        "Expense": payload.Expense,
        "Debt": payload.Debt,
        "Investment": payload.Investment,
        "Net Worth": payload.Net_Worth
    }
    
    # Extract relevant columns (financial metrics) from the model data
    years = list(range(0, payload.simYr))
    
    # Create a DataFrame from the extracted data
    df = pd.DataFrame(data)

    for col in df.columns:
        values = df[col]
        slope, intercept, r_value, p_value, std_err = linregress(years, values)
        
        trend = "constant"
        if slope > 0:
            trend = "increase"
        elif slope < 0:
            trend = "decrease"

        strength = "strong" if abs(r_value) > 0.9 else "moderate" if abs(r_value) > 0.7 else "weak"
        
        # Generate text-based insights for each column (financial metric)
        if trend == "increase":
            insights[col] = f"🔼 {col.capitalize()} will {trend} at an average rate of {int(slope)} per year. This is a {strength} trend."
        elif trend == "decrease":
            insights[col] = f"🔽 {col.capitalize()} will {trend} at an average rate of {int(-slope)} per year. This is a {strength} trend."
        else:
            insights[col] = f"⚠️ {col.capitalize()} will {trend} at an average rate of {int(slope)} per year. This is a {strength} trend."

    
    # Compare trends for income vs expenses, debt management, and investments
    if df["Income"].iloc[-1] > df["Expense"].iloc[-1]:
        insights["Summary"].append("✅ Your income will grow faster than your expenses. Good financial balance!")
    else:
        insights["Summary"].append("⚠️ Your expenses will rise faster than your income. Consider adjusting your budget.")
    
    if df["Debt"].iloc[-1] < df["Debt"].iloc[0]:
        insights["Summary"].append("💰 Your debt will decrease, which indicates good financial management.")
    else:
        insights["Summary"].append("⚠️ Your debt will increase. Consider reducing liabilities.")

    if df["Investment"].iloc[-1] > df["Investment"].iloc[0]:
        insights["Summary"].append("📈 Your investments will grow, which is great for long-term wealth!")
    else:
        insights["Summary"].append("⚠️ Your investments are not growing. Consider revisiting your investment strategy.")

    if df["Net Worth"].iloc[-1] < df["Net Worth"].iloc[0]:
        insights["Summary"].append("⚠️ Your net worth will decrease, which puts early retirement at risk.")
    else:
        insights["Summary"].append("💰 Your net worth will increase, which indicates good financial management!")

    return insights


# Simple caching for repetitive requests with the same data
# @lru_cache(maxsize=128)
# def get_cached_analysis(data_hash: str):
#     return analyze_trends(df)


