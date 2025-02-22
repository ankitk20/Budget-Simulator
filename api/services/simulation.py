from datetime import datetime
from utils import get_country_data
from models import SimulationInput

async def simulate_years(data: SimulationInput):
    sim_years = data["simYr"]
    start_year = datetime.now().year
    inflRate = data["inflRate"]

    # Initialize investment corpus
    investment_corpus = {key: value["currAmt"] for key, value in data["Investment"].items()}
    
    yearly_data = {
        "Income": {k: 0 for k in data["Income"]},  # Initialize all incomes to 0
        "Expense": {k: 0 for k in data["Expense"]},  # Initialize all expenses to 0
        "Debt": {k: 0 for k in data["Debt"]},  # Initialize all debts to 0
        "Investment": {k: 0 for k in data["Investment"]},  # Initialize all investments to 0
        "Summary": {
            "Eaten Investment": 0,
            "Net Worth": 0,
            "Infl Adj Net Worth": 0
            },
        "Eaten Ratio": {
            "High Risk Eaten": 0.00,
            "Moderate Risk Eaten": 0.00,
            "Low Risk Eat": 0.00
        }
    }
    for year in range(start_year, start_year + sim_years):
        ntWrth = 0
        inflAdjNtWrth = 0
        eaten_inv = 0
        total_income = 0
        total_inv = 0
        total_expense = 0
        total_debt = 0
            # Process Income
        for inc_type, inc_data in data["Income"].items():
            if data["Income"][inc_type]["stYr"] == year:
                increase_factor = (1 + inc_data["rateOfInc"] / 100) ** (year - inc_data["stYr"])
                yearly_income = int(inc_data["monthlyAmt"] * 12 * increase_factor)
                yearly_data["Income"][inc_type] = int(yearly_income)
                total_income += yearly_income
            elif data["Income"][inc_type]["stYr"] < year < data["Income"][inc_type]["stYr"] + data["Income"][inc_type]["numOfYr"]:
                # for inc_type, inc_data in yearly_data["Income"].items():
                yearly_income = yearly_data["Income"][inc_type] * (1 + data["Income"][inc_type]["rateOfInc"]/100)
                yearly_data["Income"][inc_type] = int(yearly_income)
                total_income += yearly_income
            else:
                yearly_data["Income"][inc_type] = 0

        # Process Expenses
        for exp_type, exp_data in data["Expense"].items():
            if data["Expense"][exp_type]["stYr"] == year:
                increase_factor = (1 + exp_data["rateOfInc"] / 100) ** (year - exp_data["stYr"])
                yearly_expense = exp_data["monthlyAmt"] * 12 * increase_factor
                yearly_data["Expense"][exp_type] = int(yearly_expense)
                total_expense += yearly_expense
            elif exp_data["stYr"] < year < exp_data["stYr"] + exp_data["numOfYr"]:
                yearly_expense = yearly_data["Expense"][exp_type] * (1 + data["Expense"][exp_type]["rateOfInc"]/100)
                yearly_data["Expense"][exp_type] = int(yearly_expense)
                total_expense += yearly_expense
            else:
                yearly_data["Expense"][exp_type] = 0

        # Process Debts
        for debt_type, debt_data in data["Debt"].items():
            if data["Debt"][debt_type]["stYr"] == year:
                # Loan principal
                principal = debt_data["currAmt"] - debt_data["downPay"]
                # Monthly interest rate
                monthly_rate = (debt_data["rateOfInt"] / 100) / 12
                # Number of months
                num_months = debt_data["numOfYr"] * 12
                
                # EMI Calculation using standard formula
                emi = int((principal * monthly_rate * (1 + monthly_rate) ** num_months) / ((1 + monthly_rate) ** num_months - 1))
                yearly_emi = emi * 12  # Convert to yearly payment
                
                # Store yearly EMI payment
                yearly_data["Debt"][debt_type] = int(yearly_emi)
                total_debt += yearly_emi
            elif data["Debt"][debt_type]["stYr"] < year < data["Debt"][debt_type]["stYr"] + data["Debt"][debt_type]["numOfYr"]:
                yearly_emi = yearly_data["Debt"][debt_type]

                # Store yearly EMI payment
                yearly_data["Debt"][debt_type] = int(yearly_emi)
                total_debt += yearly_emi
            else:
                yearly_data["Debt"][debt_type] = 0

        total_inv_expense = 0

        # Process Investments
        for inv_type, inv_data in data["Investment"].items():
            increase_factor = (1 + data["Investment"][inv_type]["rateOfInt"] / 100)
            if data["Investment"][inv_type]["stYr"] > year:
                new_corpus = int(max(data["Investment"][inv_type]["currAmt"], yearly_data["Investment"][inv_type]) * increase_factor)
                total_inv += new_corpus
                yearly_data["Investment"][inv_type] = int(new_corpus)
            elif data["Investment"][inv_type]["stYr"] == year:
                new_corpus = max(data["Investment"][inv_type]["currAmt"], yearly_data["Investment"][inv_type]) * increase_factor + inv_data["monthlyAmt"] * 12
                investment_corpus[inv_type] = new_corpus
                yearly_data["Investment"][inv_type] = int(new_corpus)
                total_inv += new_corpus
            elif data["Investment"][inv_type]["stYr"] < year < data["Investment"][inv_type]["stYr"] + data["Investment"][inv_type]["numOfYr"]:
                new_corpus = yearly_data["Investment"][inv_type] * increase_factor + data["Investment"][inv_type]["monthlyAmt"] * 12
                investment_corpus[inv_type] = new_corpus
                yearly_data["Investment"][inv_type] = int(new_corpus)
                total_inv += new_corpus
            else:
                new_corpus = int(yearly_data["Investment"][inv_type] * increase_factor)
                total_inv += new_corpus
                yearly_data["Investment"][inv_type] = int(new_corpus)

        bal = int(total_income - total_debt - total_expense)
        init_bal = int(abs(bal))
        low_ratio = 0
        moderate_ratio = 0
        high_ratio = 0

        if bal >= 0:
            yearly_data["Investment"]["Savings"] += bal
        else:
            eaten_inv = init_bal

            lowRiskCurrAmt = yearly_data["Investment"]["Low Risk"]
            moderateRiskCurrAmt = yearly_data["Investment"]["Moderate Risk"]
            highRiskCurrAmt = yearly_data["Investment"]["High Risk"]

            if bal < 0 and abs(bal) <= lowRiskCurrAmt:
                low_ratio = 1.00
                yearly_data["Investment"]["Low Risk"] += bal
                bal = 0
            else:
                low_ratio = yearly_data["Investment"]["Low Risk"] / init_bal
                bal += yearly_data["Investment"]["Low Risk"]
                yearly_data["Investment"]["Low Risk"] = 0

            if bal < 0 and abs(bal) <= moderateRiskCurrAmt:
                moderate_ratio = 1 - low_ratio
                yearly_data["Investment"]["Moderate Risk"] += bal
                bal = 0
            elif bal != 0:
                moderate_ratio = yearly_data["Investment"]["Moderate Risk"] / init_bal
                bal += yearly_data["Investment"]["Moderate Risk"]
                yearly_data["Investment"]["Moderate Risk"] = 0

            if bal < 0 and abs(bal) <= highRiskCurrAmt:
                high_ratio = 1 - moderate_ratio - low_ratio
                yearly_data["Investment"]["High Risk"] += bal
                bal = 0
            elif bal != 0:
                high_ratio = yearly_data["Investment"]["High Risk"] / init_bal
                bal += yearly_data["Investment"]["High Risk"]
                yearly_data["Investment"]["High Risk"] = 0

        ntWrth = int(total_income + total_inv - total_debt - total_expense - init_bal)
        inflAdjNtWrth = int(ntWrth/((1+(inflRate/100))**(year-start_year)))

        summary = {"Eaten Investment": eaten_inv, "Net Worth": ntWrth, "Infl Adj Net Worth": inflAdjNtWrth}
        ratio = {"High Risk Eaten": round(high_ratio, 2), "Moderate Risk Eaten": round(moderate_ratio, 2), "Low Risk Eaten": round(low_ratio, 2)}
        yearly_data["Summary"] = summary
        yearly_data["Eaten Ratio"] = ratio

        yield {str(year): yearly_data }
