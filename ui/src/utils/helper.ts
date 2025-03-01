import { catIncome, catExpense, catDebt, catInv, summary, typeNetWorth, typeInflAdjNetWorth, typeEatInv, eatRatio, typeLowRiskEat, typeModRiskEat, typeHighRiskEat } from "./constant";
import { TableData } from "./data";

export function generateTableData(formData: {
  country: string;
  currentAmt: number;
  fortuneAmt: number;
  monthlyIncAmt: number;
  monthlyExpAmt: number;
  monthlyInvAmt: number;
  homeLoanAmt: number;
  vehLoanAmt: number;
  eduLoanAmt: number;
  currentAge: number;
  lifeExpectancy: number;
  retireAge: number;
}): TableData[] {
  const currentYear = new Date().getFullYear();

  return [
    {
      category: catIncome,
      currAmt: 0,
      type: "Active",
      monthlyAmt: formData.monthlyIncAmt || 0,
      stYr: currentYear,
      numOfYears: formData.retireAge - formData.currentAge,
      rateOfIncrement: 5,
    },
    {
      category: catExpense,
      currAmt: 0,
      type: "Household",
      monthlyAmt: formData.monthlyExpAmt || 0,
      stYr: currentYear,
      numOfYears: formData.lifeExpectancy - formData.currentAge + 1,
      rateOfIncrement: 7,
    },
    {
      category: catDebt,
      currAmt: formData.homeLoanAmt || 0,
      type: "Home",
      downPayment: 0,
      stYr: currentYear + 1,
      numOfYears: 30,
      rateOfInterest: 9,
    },
    {
      category: catDebt,
      currAmt: formData.vehLoanAmt || 0,
      type: "Vehicle",
      downPayment: 0,
      stYr: currentYear + 1,
      numOfYears: 5,
      rateOfInterest: 9,
    },
    {
      category: catDebt,
      currAmt: formData.eduLoanAmt || 0,
      type: "Education",
      downPayment: 0,
      stYr: currentYear + 1,
      numOfYears: 10,
      rateOfInterest: 9,
    },
    {
      category: catInv,
      currAmt: 0,
      type: "High Risk",
      monthlyAmt: 0,
      stYr: currentYear,
      numOfYears: formData.retireAge - formData.currentAge,
      rateOfInterest: 12,
      rateOfIncrement: 0,
    },
    {
      category: catInv,
      currAmt: 0,
      type: "Moderate Risk",
      monthlyAmt: 0,
      stYr: currentYear,
      numOfYears: formData.retireAge - formData.currentAge,
      rateOfInterest: 10,
      rateOfIncrement: 0,
    },
    {
      category: catInv,
      currAmt: formData.currentAmt || 0,
      type: "Low Risk",
      monthlyAmt: formData.monthlyInvAmt || 0,
      stYr: currentYear,
      numOfYears: formData.retireAge - formData.currentAge,
      rateOfInterest: 7,
      rateOfIncrement: 0,
    },
    {
      category: catInv,
      currAmt: 0,
      type: "Savings",
      monthlyAmt: 0,
      stYr: currentYear,
      numOfYears: formData.lifeExpectancy - formData.currentAge + 1,
      rateOfInterest: 3.5,
      rateOfIncrement: 0,
    },
    { category: summary, type: typeNetWorth },
    { category: summary, type: typeInflAdjNetWorth },
    { category: summary, type: typeEatInv },
    { category: eatRatio, type: typeLowRiskEat },
    { category: eatRatio, type: typeModRiskEat },
    { category: eatRatio, type: typeHighRiskEat },
  ];
}


const flattenJSON = (year: string, data: any) => {
  const flatData: any = { year: Number(year) };

  Object.entries(data).forEach(([category, categoryData]: [string, any]) => {
    if (typeof categoryData === "object") {
      Object.entries(categoryData).forEach(([type, value]) => {
        flatData[`${category}_${type}`] = value;
      });
    } else {
      flatData[category] = categoryData;
    }
  });

  return flatData;
};

export default flattenJSON;
