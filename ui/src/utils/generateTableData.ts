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
},
countryMap: Record<string, number>): TableData[] {
  const currentYear = new Date().getFullYear();

  return [
    {
      category: catIncome,
      currAmt: 0,
      type: "Active",
      monthlyAmt: formData.monthlyIncAmt || 0,
      stYr: currentYear,
      numOfYears: formData.retireAge - formData.currentAge,
      rateOfIncrement: countryMap["incomeRtOfInc"],
    },
    {
      category: catExpense,
      currAmt: 0,
      type: "Essentials",
      monthlyAmt: formData.monthlyExpAmt || 0,
      stYr: currentYear,
      numOfYears: formData.lifeExpectancy - formData.currentAge + 1,
      rateOfIncrement: countryMap["inflRt"],
    },
    {
      category: catDebt,
      currAmt: formData.homeLoanAmt || 0,
      type: "Home",
      downPayment: 0,
      stYr: currentYear + 1,
      numOfYears: 30,
      rateOfInterest: countryMap["homeLoanRtOfInt"],
    },
    {
      category: catDebt,
      currAmt: formData.vehLoanAmt || 0,
      type: "Vehicle",
      downPayment: 0,
      stYr: currentYear + 1,
      numOfYears: 5,
      rateOfInterest: countryMap["vehicleLoanRtOfInt"],
    },
    {
      category: catDebt,
      currAmt: formData.eduLoanAmt || 0,
      type: "Education",
      downPayment: 0,
      stYr: currentYear + 1,
      numOfYears: 10,
      rateOfInterest: countryMap["eduLoanRtOfInt"],
    },
    {
      category: catInv,
      currAmt: formData.currentAmt || 0,
      type: "Low Risk",
      monthlyAmt: formData.monthlyInvAmt || 0,
      stYr: currentYear,
      numOfYears: formData.retireAge - formData.currentAge,
      rateOfInterest: countryMap["lowRiskRtOfRet"],
      rateOfIncrement: 0,
    },
    {
      category: catInv,
      currAmt: 0,
      type: "Savings",
      monthlyAmt: 0,
      stYr: currentYear,
      numOfYears: formData.lifeExpectancy - formData.currentAge + 1,
      rateOfInterest: countryMap["savingsRtOfRet"],
      rateOfIncrement: 0,
    },
    { category: summary, type: typeNetWorth },
    { category: summary, type: typeInflAdjNetWorth },
    { category: summary, type: typeEatInv }
  ].filter(
    (item) =>
      !(
        // Remove income & expense if monthlyAmt is 0 or undefined
        ((item.category === catIncome || item.category === catExpense) &&
          (!item.monthlyAmt || item.monthlyAmt === 0))

        // Remove debt if currAmt is 0 or undefined
        || (item.category === catDebt && (!item.currAmt || item.currAmt === 0))

        // Remove inv if currAmt and monthlyAmt is 0 or undefined
        // || (item.category === catInv && (!item.currAmt || item.currAmt === 0) && (!item.monthlyAmt || item.monthlyAmt === 0))
      )
  );
}
