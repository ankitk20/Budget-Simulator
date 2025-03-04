
from scipy.stats import linregress
from typing import Dict
from utils import calculate_cagr, format_large_currency
from models.models import AnalysisModel
import pandas as pd

async def get_income_expense_cagr(df):

    # Find first non-zero income and expense values
    first_income_row = df[df["Income"] > 0].index[0]
    first_income = df["Income"][first_income_row]
    first_income_year = first_income_row

    first_expense_row = df[df["Expense"] > 0].index[0]
    first_expense = df["Expense"][first_expense_row]
    first_expense_year = first_expense_row

    # Find last non-zero income
    last_income_row = df[df["Income"] > 0].index[-1]
    last_income = df["Income"][last_income_row]
    last_income_year = last_income_row

    # Find last non-zero expense
    last_expense_row = df[df["Expense"] > 0].index[-1]
    last_expense = df["Expense"][last_expense_row]
    last_expense_year = last_expense_row

    # Calculate years for CAGR
    income_years = last_income_year - first_income_year
    expense_years = last_expense_year - first_expense_year

    # Calculate CAGR for income and expenses
    income_cagr = await calculate_cagr(first_income, last_income, income_years)
    expense_cagr = await calculate_cagr(first_expense, last_expense, expense_years)

    # Calculate income-to-expense ratio (last recorded values)
    income_expense_ratio = last_income / last_expense if last_expense > 0 else float("inf")

    # Calculate savings trend
    initial_savings = first_income - first_expense
    final_savings = last_income - last_expense
    savings_cagr = await calculate_cagr(initial_savings, final_savings, income_years)

    return (income_cagr, expense_cagr, savings_cagr, income_expense_ratio)


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
    
    for year in years:
        if data["Net Worth"][year] >= 25 * data["Expense"][year]:
            insights["Summary"].append(f"✅ You can retire at age of {age + year + 1}! This is assuming 4% FIRE rule.")
            break

    max_net_worth = max(data["Net Worth"])
    for year in years:
        if data["Net Worth"][year] >= targetAmt:
            insights["Summary"].append(f"✅ You will reach your desired amount by the age of {age + year + 1}!")
            max_net_worth = None
            break

    if max_net_worth is not None:
        max_pct = int(max_net_worth * 100 / targetAmt)
        insights["Summary"].append(f"⚠️ You will be able to achieve only {max_pct}% of your desired amount.")
    
    income_cagr, expense_cagr, savings_cagr, income_expense_ratio = await get_income_expense_cagr(df)

    if income_cagr > expense_cagr and income_expense_ratio >= 1:
        insights["Summary"].append(
            # f"✅ Your income is growing at {income_cagr:.2%} per year, faster than your expenses ({expense_cagr:.2%}). "
            f"Your income-to-expense ratio is {income_expense_ratio:.2f}, indicating a good financial balance."
        )
    elif income_cagr > expense_cagr and income_expense_ratio < 1:
        insights["Summary"].append(
            f"⚠️ Although your income growth ({income_cagr:.2%}) is higher than expense growth ({expense_cagr:.2%}), "
            f"your income-to-expense ratio is {income_expense_ratio:.2f}, meaning expenses are still higher than income."
        )
    elif income_cagr < expense_cagr:
        insights["Summary"].append(
            f"⚠️ Your expenses are growing at {expense_cagr:.2%} per year, faster than your income ({income_cagr:.2%}). "
            "Consider adjusting your budget."
        )
    # if savings_cagr > 0:
    #     insights["Summary"].append(
    #         f"✅ Your savings are increasing at {savings_cagr:.2%} per year. Good financial discipline!"
    #     )
    # elif savings_cagr < 0:
    #     insights["Summary"].append(
    #         f"⚠️ Your savings are shrinking at {abs(savings_cagr):.2%} per year. Consider increasing your savings rate."
    #     )

    # Find the first non-zero value and its index (year)
    first_non_zero_idx = None
    first_non_zero_value = None


    if (df["Debt"] != 0).any():
        first_non_zero_idx = (df["Debt"] != 0).idxmax()

    if first_non_zero_idx is not None:
        first_non_zero_value = df.loc[first_non_zero_idx, "Debt"]

    # Get the last value and its index (year)
    last_idx = df.index[-1]  # Last row index
    last_value = df["Debt"].iloc[-1]

    # Ensure first non-zero value and last value are from different years
    if first_non_zero_idx is None:
        insights["Summary"].append("✅ Your have no or limited debts, which indicates good financial management.")
    elif last_idx != first_non_zero_idx and last_value < first_non_zero_value:
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


