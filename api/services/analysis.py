
from scipy.stats import linregress
from typing import Dict
from utils import format_large_currency
from models.models import AnalysisModel
import pandas as pd

async def analyze_trend(payload: AnalysisModel):
    
    # Initialize list for insights
    insights = {
        "Trend": [],
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
    country = payload.country
    targetAmt = payload.targetAmt
    age = payload.age
    
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

        # strength = "strong" if abs(r_value) > 0.9 else "moderate" if abs(r_value) > 0.7 else "weak"

        # Generate text-based insights for each column (financial metric)
        try:
            if trend == "increase":
                insights["Trend"].append(f"🔼 {col.capitalize()} will {trend} at an average rate of {await format_large_currency(slope, country)} per year.")
            elif trend == "decrease":
                insights["Trend"].append(f"🔽 {col.capitalize()} will {trend} at an average rate of {await format_large_currency(slope, country)} per year.")
            else:
                insights["Trend"].append(f"⚠️ {col.capitalize()} will be {trend}.")
        except Exception as e:
            raise e

    max_net_worth = max(data["Net Worth"])
    for year in years:
        if data["Net Worth"][year] >= targetAmt:
            insights["Summary"].append(f"✅ You will reach your desired amount by the age of {age + year + 1}!")
            max_net_worth = None
            break

    if max_net_worth is not None:
        max_pct = int(max_net_worth * 100 / targetAmt)
        insights["Summary"].append(f"⚠️ You will be able to achieve only {max_pct}% of your desired amount.")
    
    # Compare trends for income vs expenses, debt management, and investments
    if df["Income"].iloc[-1] > df["Expense"].iloc[-1]:
        insights["Summary"].append("✅ Your income will grow faster than your expenses. Good financial balance!")
    else:
        insights["Summary"].append("⚠️ Your expenses will rise faster than your income. Consider adjusting your budget.")
    
    if df["Debt"].iloc[-1] < df["Debt"].iloc[0]:
        insights["Summary"].append("✅ Your debt will decrease, which indicates good financial management.")
    else:
        insights["Summary"].append("⚠️ Your debt will increase. Consider reducing liabilities.")

    if df["Investment"].iloc[-1] > df["Investment"].iloc[0]:
        insights["Summary"].append("✅ Your investments will grow, which is great for long-term wealth!")
    else:
        insights["Summary"].append("⚠️ Your investments are not growing. Consider revisiting your investment strategy.")

    if df["Net Worth"].iloc[-1] < df["Net Worth"].iloc[0]:
        insights["Summary"].append("⚠️ Your net worth will decrease, which puts early retirement at risk.")
    else:
        insights["Summary"].append("✅ Your net worth will increase, which indicates good financial management!")

    return insights


# Simple caching for repetitive requests with the same data
# @lru_cache(maxsize=128)
# def get_cached_analysis(data_hash: str):
#     return analyze_trends(df)


