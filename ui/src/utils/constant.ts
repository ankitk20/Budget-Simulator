import { TableData } from "./data";

export const isInputColumnKeys = [
    "currAmt",
    "monthlyAmt",
    "stYr",
    "numOfYears",
    "rateOfInterest",
    "rateOfIncrement",
  ];
  
  export const catIncome = "Income";
  export const catExpense = "Expense";
  export const catDebt = "Debt";
  export const catInv = "Investment";
  export const summary = "Summary";
  export const eatRatio = "Eaten Ratio";
  export const typeEatInv = "Eaten Investment";
  export const typeNetWorth = "Net Worth";
  export const typeInflAdjNetWorth = "Infl Adj Net Worth";
  export const typeHighRiskEat = "High Risk Eaten";
  export const typeModRiskEat = "Moderate Risk Eaten";
  export const typeLowRiskEat = "Low Risk Eaten";
  export const defaultSimYr = 0;
  export const inputColNum = 7;
  
  export const initialData: TableData[] = [
    { category: catIncome, currAmt: 0, type: "Active", monthlyAmt: 120000, stYr: 2025, numOfYears: 10, rateOfIncrement: 5 },
  
    { category: catExpense, currAmt: 0, type: "Essentials", monthlyAmt: 5000, stYr: 2025, numOfYears: 10, rateOfIncrement: 7 },
    { category: catExpense, currAmt: 0, type: "House Rent", monthlyAmt: 2000, stYr: 2025, numOfYears: 3, rateOfIncrement: 7 },
    { category: catExpense, currAmt: 0, type: "Children's Expense", monthlyAmt: 1000, stYr: 2025, numOfYears: 10, rateOfIncrement: 7 },
    { category: catExpense, currAmt: 0, type: "Parents' Support", monthlyAmt: 10000, stYr: 2025, numOfYears: 10, rateOfIncrement: 7 },
    { category: catExpense, currAmt: 0, type: "Insurance", monthlyAmt: 1000, stYr: 2025, numOfYears: 10, rateOfIncrement: 5 },
    { category: catExpense, currAmt: 0, type: "Travel", monthlyAmt: 2000, stYr: 2025, numOfYears: 10, rateOfIncrement: 7 },
    { category: catExpense, currAmt: 0, type: "Investment High Risk", monthlyAmt: 2000, stYr: 2025, numOfYears: 5, rateOfIncrement: 0 },
    { category: catExpense, currAmt: 0, type: "Investment Moderate Risk", monthlyAmt: 1500, stYr: 2025, numOfYears: 5, rateOfIncrement: 0 },
    { category: catExpense, currAmt: 0, type: "Investment Low Risk", monthlyAmt: 1000, stYr: 2025, numOfYears: 10, rateOfIncrement: 0 },
  
    { category: catDebt, currAmt: 300000, type: "House", downPayment: 0, stYr: 2025, numOfYears: 5, rateOfInterest: 9 },
    { category: catDebt, currAmt: 50000, type: "Vehicle", downPayment: 0, stYr: 2025, numOfYears: 5, rateOfInterest: 11 },
    
    { category: catInv, currAmt: 1000000, type: "High Risk", monthlyAmt: 2000, stYr: 2025, numOfYears: 10, rateOfInterest: 12, rateOfIncrement: 0 },
    { category: catInv, currAmt: 700000, type: "Moderate Risk", monthlyAmt: 1500, stYr: 2025, numOfYears: 10, rateOfInterest: 9, rateOfIncrement: 0 },
    { category: catInv, currAmt: 500000, type: "Low Risk", monthlyAmt: 1000, stYr: 2025, numOfYears: 10, rateOfInterest: 7, rateOfIncrement: 0 },
    { category: catInv, currAmt: 0, type: "Savings", monthlyAmt: 0, stYr: 2025, numOfYears: 10, rateOfInterest: 3.5, rateOfIncrement: 0 },
  
    { category: summary, type: typeNetWorth },
    { category: summary, type: typeInflAdjNetWorth },
    { category: summary, type: typeEatInv },
  
    { category: eatRatio, type: typeLowRiskEat },
    { category: eatRatio, type: typeModRiskEat },
    { category: eatRatio, type: typeHighRiskEat },
  ];
  
  export const demoData: TableData[] = [
    { category: catIncome, currAmt: 0, type: "Active", monthlyAmt: 60000, stYr: 2025, numOfYears: 5, rateOfIncrement: 5 },
  
    { category: catExpense, currAmt: 0, type: "Household", monthlyAmt: 1000, stYr: 2025, numOfYears: 50, rateOfIncrement: 7 },
    { category: catExpense, currAmt: 0, type: "Children's Education", monthlyAmt: 1000, stYr: 2027, numOfYears: 5, rateOfIncrement: 7 },
    { category: catExpense, currAmt: 0, type: "Insurance", monthlyAmt: 1000, stYr: 2025, numOfYears: 5, rateOfIncrement: 5 },
    { category: catExpense, currAmt: 0, type: "Travel", monthlyAmt: 2000, stYr: 2025, numOfYears: 5, rateOfIncrement: 7 },
  
    { category: catDebt, currAmt: 300000, type: "Vehicle", downPayment: 0, stYr: 2027, numOfYears: 5, rateOfInterest: 9 },
  
    { category: catInv, currAmt: 500000, type: "Low Risk", monthlyAmt: 1000, stYr: 2025, numOfYears: 5, rateOfInterest: 7, rateOfIncrement: 0 },
    { category: catInv, currAmt: 0, type: "Savings", monthlyAmt: 0, stYr: 2025, numOfYears: 5, rateOfInterest: 3.5, rateOfIncrement: 0 },
  
    { category: summary, type: typeNetWorth },
    { category: summary, type: typeInflAdjNetWorth },
    { category: summary, type: typeEatInv },
  
    { category: eatRatio, type: typeLowRiskEat },
    { category: eatRatio, type: typeModRiskEat },
    { category: eatRatio, type: typeHighRiskEat },
  ];
  
  export const COUNTRY_MAPPING: Record<
    string,
    { name: string; locale: string; currency: string }
  > = {
    au: { name: "Australia", locale: "en-AU", currency: "AUD" },
    br: { name: "Brazil", locale: "pt-BR", currency: "BRL" },
    ca: { name: "Canada", locale: "en-CA", currency: "CAD" },
    cn: { name: "China", locale: "zh-CN", currency: "CNY" },
    fr: { name: "France", locale: "fr-FR", currency: "EUR" },
    de: { name: "Germany", locale: "de-DE", currency: "EUR" },
    in: { name: "India", locale: "en-IN", currency: "INR" },
    id: { name: "Indonesia", locale: "id-ID", currency: "IDR" },
    it: { name: "Italy", locale: "it-IT", currency: "EUR" },
    jp: { name: "Japan", locale: "ja-JP", currency: "JPY" },
    mx: { name: "Mexico", locale: "es-MX", currency: "MXN" },
    ru: { name: "Russia", locale: "ru-RU", currency: "RUB" },
    sa: { name: "Saudi Arabia", locale: "ar-SA", currency: "SAR" },
    sg: { name: "Singapore", locale: "en-SG", currency: "SGD" },
    za: { name: "South Africa", locale: "en-ZA", currency: "ZAR" },
    kr: { name: "South Korea", locale: "ko-KR", currency: "KRW" },
    es: { name: "Spain", locale: "es-ES", currency: "EUR" },
    tr: { name: "Turkey", locale: "tr-TR", currency: "TRY" },
    ae: { name: "United Arab Emirates", locale: "ar-AE", currency: "AED" },
    gb: { name: "United Kingdom", locale: "en-GB", currency: "GBP" },
    us: { name: "United States", locale: "en-US", currency: "USD" },
  };
  