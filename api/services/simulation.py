from datetime import datetime
from utils import get_country_data
from models import SimulationInput

async def simulate_years(data: SimulationInput):
    sim_years = data["simYr"]
    start_year = datetime.now().year
    inflRate = data["inflRate"]

    # Initialize investment corpus
    investment_corpus = {key: value["currAmt"] for key, value in data["inv"].items()}
    
    yearly_data = {
        "income": {k: 0 for k in data["income"]},  # Initialize all incomes to 0
        "expense": {k: 0 for k in data["expense"]},  # Initialize all expenses to 0
        "debt": {k: 0 for k in data["debt"]},  # Initialize all debts to 0
        "inv": {k: 0 for k in data["inv"]},  # Initialize all investments to 0
        "summary": {
            "eatenInv": 0,
            "ntWrth": 0,
            "inflAdjNtWrth": 0
            },
        "ratio": {
            "highRiskEat": 0.00,
            "moderateRiskEat": 0.00,
            "lowRiskEat": 0.00
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
        for inc_type, inc_data in data["income"].items():
            if data["income"][inc_type]["stYr"] == year:
                increase_factor = (1 + inc_data["rateOfInc"] / 100) ** (year - inc_data["stYr"])
                yearly_income = int(inc_data["monthlyAmt"] * 12 * increase_factor)
                yearly_data["income"][inc_type] = int(yearly_income)
                total_income += yearly_income
            elif data["income"][inc_type]["stYr"] < year < data["income"][inc_type]["stYr"] + data["income"][inc_type]["numOfYr"]:
                # for inc_type, inc_data in yearly_data["income"].items():
                yearly_income = yearly_data["income"][inc_type] * (1 + data["income"][inc_type]["rateOfInc"]/100)
                yearly_data["income"][inc_type] = int(yearly_income)
                total_income += yearly_income
            else:
                yearly_data["income"][inc_type] = 0

        # Process Expenses
        for exp_type, exp_data in data["expense"].items():
            if data["expense"][exp_type]["stYr"] == year:
                increase_factor = (1 + exp_data["rateOfInc"] / 100) ** (year - exp_data["stYr"])
                yearly_expense = exp_data["monthlyAmt"] * 12 * increase_factor
                yearly_data["expense"][exp_type] = int(yearly_expense)
                total_expense += yearly_expense
            elif exp_data["stYr"] < year < exp_data["stYr"] + exp_data["numOfYr"]:
                yearly_expense = yearly_data["expense"][exp_type] * (1 + data["expense"][exp_type]["rateOfInc"]/100)
                yearly_data["expense"][exp_type] = int(yearly_expense)
                total_expense += yearly_expense
            else:
                yearly_data["expense"][exp_type] = 0

        # Process Debts
        for debt_type, debt_data in data["debt"].items():
            if data["debt"][debt_type]["stYr"] == year:
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
                yearly_data["debt"][debt_type] = int(yearly_emi)
                total_debt += yearly_emi
            elif data["debt"][debt_type]["stYr"] < year < data["debt"][debt_type]["stYr"] + data["debt"][debt_type]["numOfYr"]:
                yearly_emi = yearly_data["debt"][debt_type]

                # Store yearly EMI payment
                yearly_data["debt"][debt_type] = int(yearly_emi)
                total_debt += yearly_emi
            else:
                yearly_data["debt"][debt_type] = 0

        total_inv_expense = 0

        # Process Investments
        for inv_type, inv_data in data["inv"].items():
            increase_factor = (1 + data["inv"][inv_type]["rateOfInt"] / 100)
            if data["inv"][inv_type]["stYr"] == year:
                new_corpus = max(data["inv"][inv_type]["currAmt"], yearly_data["inv"][inv_type]) * increase_factor + inv_data["monthlyAmt"] * 12
                investment_corpus[inv_type] = new_corpus
                yearly_data["inv"][inv_type] = int(new_corpus)
                total_inv += new_corpus
                total_inv_expense += inv_data["monthlyAmt"] * 12
            elif data["inv"][inv_type]["stYr"] < year < data["inv"][inv_type]["stYr"] + data["inv"][inv_type]["numOfYr"]:
                new_corpus = yearly_data["inv"][inv_type] * increase_factor + data["inv"][inv_type]["monthlyAmt"] * 12
                investment_corpus[inv_type] = new_corpus
                yearly_data["inv"][inv_type] = int(new_corpus)
                total_inv += new_corpus
                total_inv_expense += data["inv"][inv_type]["monthlyAmt"] * 12
            else:
                new_corpus = int(max(data["inv"][inv_type]["currAmt"], yearly_data["inv"][inv_type]) * increase_factor)
                total_inv += new_corpus
                yearly_data["inv"][inv_type] = int(new_corpus)
        total_expense += total_inv_expense

        bal = int(total_income - total_debt - total_expense)
        init_bal = int(abs(bal))
        low_ratio = 0
        moderate_ratio = 0
        high_ratio = 0

        if bal >= 0:
            yearly_data["inv"]["savings"] += bal
        else:
            eaten_inv = init_bal

            lowRiskCurrAmt = yearly_data["inv"]["lowRisk"]
            moderateRiskCurrAmt = yearly_data["inv"]["moderateRisk"]
            highRiskCurrAmt = yearly_data["inv"]["highRisk"]

            if bal < 0 and abs(bal) <= lowRiskCurrAmt:
                low_ratio = 1.00
                yearly_data["inv"]["lowRisk"] += bal
                bal = 0
            else:
                low_ratio = round (yearly_data["inv"]["lowRisk"] / init_bal, 2)
                bal += yearly_data["inv"]["lowRisk"]
                yearly_data["inv"]["lowRisk"] = 0

            if bal < 0 and abs(bal) <= moderateRiskCurrAmt:
                moderate_ratio = round(1 - low_ratio, 2)
                yearly_data["inv"]["moderateRisk"] += bal
                bal = 0
            elif bal != 0:
                moderate_ratio = round (yearly_data["inv"]["moderateRisk"] / init_bal, 2)
                bal += yearly_data["inv"]["moderateRisk"]
                yearly_data["inv"]["moderateRisk"] = 0

            if bal < 0 and abs(bal) <= highRiskCurrAmt:
                high_ratio = round(1 - moderate_ratio - low_ratio, 2)
                yearly_data["inv"]["highRisk"] += bal
                bal = 0
            elif bal != 0:
                high_ratio = round (yearly_data["inv"]["highRisk"] / init_bal, 2)
                bal += yearly_data["inv"]["highRisk"]
                yearly_data["inv"]["highRisk"] = 0

        ntWrth = int(total_income + total_inv - total_debt - total_expense - init_bal)
        inflAdjNtWrth = int(ntWrth/((1+(inflRate/100))**(year-start_year)))

        summary = {"eatenInv": eaten_inv, "ntWrth": ntWrth, "inflAdjNtWrth": inflAdjNtWrth}
        ratio = {"highRiskEat": high_ratio, "moderateRiskEat": moderate_ratio, "lowRiskEat": low_ratio}
        yearly_data["summary"] = summary
        yearly_data["ratio"] = ratio

        yield {str(year): yearly_data }
