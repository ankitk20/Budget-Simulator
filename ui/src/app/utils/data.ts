export type SimulationSummary = {
  Income?: number[],
  Expense?: number[],
  Debt?: number[],
  Investment?: number[],
  "Net Worth"?: number[],
  country?: string,
  simYr?: number,
  age?: number,
  targetAmt?: number
}

export interface FlattenedData {
  year: number;
  [key: string]: number; // Dynamic keys for income, expenses, debt, investments
}

export type TableData = {
  category: string;
  type: string;
  currAmt?: number;
  monthlyAmt?: number;
  downPayment?: number;
  stYr?: number;
  numOfYears?: number;
  rateOfInterest?: number;
  rateOfIncrement?: number;
  eatenInv?: number;
  ntWrth?: number;
  inflAdjNtWrth?: number;
  highRiskEat?: number;
  moderateRiskEat?: number;
  lowRiskEat?: number;
  [year: string]: number | string | undefined;
}

export type EntryType = {
  currAmt: number;       // Current amount
  monthlyAmt: number;    // Monthly contribution
  downPay: number;       // Down payment
  stYr: number;          // Start year
  numOfYr: number;       // Number of years
  rateOfInt: number;     // Rate of interest
  rateOfInc: number;     // Rate of increment
};

export type SimulationInput = {
  simYr: number;
  inflRate: number;
  ltcgTaxRate: number;
  stcgTaxRate: number;
  country: string;
  fortuneAmt: number;
  currentAge: number;
  lifeExpectancy: number;
  [key: string]: Record<string, EntryType> | number | string; // Allow dynamic categories
}; 

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
export const defaultSimYr = 5;

export const initialData: TableData[] = [
  { category: catIncome, currAmt: 0, type: "Active", monthlyAmt: 120000, stYr: 2025, numOfYears: 10, rateOfIncrement: 5 },
  { category: catIncome, currAmt: 0, type: "Passive", monthlyAmt: 20000, stYr: 2027, numOfYears: 5, rateOfIncrement: 10 },

  { category: catExpense, currAmt: 0, type: "Grocery", monthlyAmt: 5000, stYr: 2025, numOfYears: 10, rateOfIncrement: 7 },
  { category: catExpense, currAmt: 0, type: "Utility", monthlyAmt: 1000, stYr: 2025, numOfYears: 10, rateOfIncrement: 7 },
  { category: catExpense, currAmt: 0, type: "Clothing", monthlyAmt: 2000, stYr: 2025, numOfYears: 10, rateOfIncrement: 7 },
  { category: catExpense, currAmt: 0, type: "Rent", monthlyAmt: 2000, stYr: 2025, numOfYears: 3, rateOfIncrement: 7 },
  { category: catExpense, currAmt: 0, type: "House Maintenance", monthlyAmt: 10000, stYr: 2025, numOfYears: 10, rateOfIncrement: 7 },
  { category: catExpense, currAmt: 0, type: "Self Development", monthlyAmt: 1000, stYr: 2025, numOfYears: 10, rateOfIncrement: 10 },
  { category: catExpense, currAmt: 0, type: "Children's Education", monthlyAmt: 10000, stYr: 2025, numOfYears: 10, rateOfIncrement: 20 },
  { category: catExpense, currAmt: 0, type: "Children's Expense", monthlyAmt: 1000, stYr: 2025, numOfYears: 10, rateOfIncrement: 7 },
  { category: catExpense, currAmt: 0, type: "Parents' Support", monthlyAmt: 10000, stYr: 2025, numOfYears: 10, rateOfIncrement: 7 },
  { category: catExpense, currAmt: 0, type: "Spouse's Expense", monthlyAmt: 5000, stYr: 2025, numOfYears: 10, rateOfIncrement: 5 },
  { category: catExpense, currAmt: 0, type: "Health Insurance", monthlyAmt: 1000, stYr: 2025, numOfYears: 10, rateOfIncrement: 5 },
  { category: catExpense, currAmt: 0, type: "Life Insurance", monthlyAmt: 3000, stYr: 2025, numOfYears: 10, rateOfIncrement: 0 },
  { category: catExpense, currAmt: 0, type: "Vehicle Insurance", monthlyAmt: 3000, stYr: 2025, numOfYears: 5, rateOfIncrement: 5 },
  { category: catExpense, currAmt: 0, type: "House Insurance", monthlyAmt: 0, stYr: 2025, numOfYears: 5, rateOfIncrement: 5 },
  { category: catExpense, currAmt: 0, type: "Charity", monthlyAmt: 1000, stYr: 2025, numOfYears: 10, rateOfIncrement: 5 },
  { category: catExpense, currAmt: 0, type: "Travel", monthlyAmt: 2000, stYr: 2025, numOfYears: 10, rateOfIncrement: 7 },
  { category: catExpense, currAmt: 0, type: "Trip", monthlyAmt: 20000, stYr: 2028, numOfYears: 7, rateOfIncrement: 5 },
  { category: catExpense, currAmt: 0, type: "Servant", monthlyAmt: 5000, stYr: 2025, numOfYears: 10, rateOfIncrement: 10 },
  { category: catExpense, currAmt: 0, type: "Entertainment", monthlyAmt: 500, stYr: 2025, numOfYears: 10, rateOfIncrement: 10 },
  { category: catExpense, currAmt: 0, type: "Emergency", monthlyAmt: 0, stYr: 2025, numOfYears: 10, rateOfIncrement: 5 },
  { category: catExpense, currAmt: 0, type: "Investment High Risk", monthlyAmt: 2000, stYr: 2025, numOfYears: 5, rateOfIncrement: 0 },
  { category: catExpense, currAmt: 0, type: "Investment Moderate Risk", monthlyAmt: 1500, stYr: 2025, numOfYears: 5, rateOfIncrement: 0 },
  { category: catExpense, currAmt: 0, type: "Investment Low Risk", monthlyAmt: 1000, stYr: 2025, numOfYears: 10, rateOfIncrement: 0 },

  { category: catDebt, currAmt: 300000, type: "House", downPayment: 0, stYr: 2025, numOfYears: 5, rateOfInterest: 9 },
  { category: catDebt, currAmt: 50000, type: "Vehicle", downPayment: 0, stYr: 2025, numOfYears: 5, rateOfInterest: 11 },
  { category: catDebt, currAmt: 80000, type: "Education", downPayment: 0, stYr: 2025, numOfYears: 5, rateOfInterest: 5 },

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
