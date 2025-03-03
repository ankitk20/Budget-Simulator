from datetime import datetime
from models import SimulationInput
from utils.country_mapping import get_country_glossary

async def simulate_years(data: SimulationInput):
    country_glossary = await get_country_glossary(data["country"])
    sim_years = data["simYr"]
    start_year = datetime.now().year
    inflRate = country_glossary["inflRt"]

    # Initialize investment corpus
    investment_corpus = {key: value["currAmt"] for key, value in (data.get("Investment").items() or {})}
    
    yearly_data = {
        "Income": {k: 0 for k in (data.get("Income") or {})},  # Handle None by defaulting to {}
        "Expense": {k: 0 for k in (data.get("Expense") or {})},  # Handle None
        "Debt": {k: 0 for k in (data.get("Debt") or {})},  # Handle None
        "Investment": {k: 0 for k in (data.get("Investment") or {})},  # Handle None
        "Summary": {
            "Eaten Investment": 0,
            "Net Worth": 0,
            "Infl Adj Net Worth": 0
        },
        "Eaten Ratio": {}
    }
    for year in range(start_year, start_year + sim_years):
        net_worth = 0
        infl_adj_net_worth = 0
        eaten_inv = 0
        total_income = 0
        total_inv = 0
        total_expense = 0
        total_debt = 0
            # Process Income
        for inc_type, inc_data in (data.get("Income") or {}).items():
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
        for exp_type, exp_data in (data.get("Expense") or {}).items():
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
        for debt_type, debt_data in (data.get("Debt") or {}).items():
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
        for inv_type, inv_data in (data.get("Investment") or {}).items():
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

        if bal >= 0:
            yearly_data["Investment"]["Savings"] += bal
        else:
            eaten_inv = init_bal

            # Sort investment categories by interest rate (ascending, lowest first)
            sorted_investments = sorted(
                data["Investment"].items(),
                key=lambda x: x[1]["rateOfInt"]  # Sort by interest rate
            )
            ratios = {}  # Store the withdrawal ratio for each investment category

            # Iterate over sorted investments and withdraw from the lowest interest first
            for inv in sorted_investments:
                inv_type = inv[0]

                # if (inv_type == "Savings"): # For now, don't withdraw from savings
                #     continue

                curr_amt = yearly_data["Investment"][inv_type]

                if abs(bal) <= curr_amt:
                    ratios[inv_type] = round(1.00 - sum(ratios.values()), 2)  # Remaining ratio
                    yearly_data["Investment"][inv_type] += bal
                    bal = 0  # Deficit covered, exit loop
                    break
                else:
                    ratios[inv_type] = round(curr_amt / init_bal, 2)
                    bal += curr_amt
                    yearly_data["Investment"][inv_type] = 0  # Exhaust this investment first

            yearly_data["Eaten Ratio"] = ratios

        # If bal < 0 then say broke

        # net_worth = int(total_income + total_inv + bal - total_debt - total_expense - init_bal)
        net_worth = int(sum(yearly_data.get("Investment").values()))
        infl_adj_net_worth = int(net_worth/((1+(inflRate/100))**(year-start_year)))

        summary = {"Eaten Investment": eaten_inv, "Net Worth": net_worth, "Infl Adj Net Worth": infl_adj_net_worth}
        yearly_data["Summary"] = summary

        yield {str(year): yearly_data }
