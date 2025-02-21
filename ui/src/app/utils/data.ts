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

export const initialData: TableData[] = [
  { category: "Income", currAmt: 0, type: "Active", monthlyAmt: 60000, stYr: 2025, numOfYears: 5, rateOfIncrement: 5 },
  { category: "Income", currAmt: 0, type: "Passive", monthlyAmt: 1000, stYr: 2025, numOfYears: 5, rateOfIncrement: 10 },

  { category: "Expense", currAmt: 0, type: "Grocery", monthlyAmt: 1000, stYr: 2025, numOfYears: 5, rateOfIncrement: 7 },
  { category: "Expense", currAmt: 0, type: "Utility", monthlyAmt: 1000, stYr: 2025, numOfYears: 5, rateOfIncrement: 7 },
  { category: "Expense", currAmt: 0, type: "Clothing", monthlyAmt: 2000, stYr: 2025, numOfYears: 5, rateOfIncrement: 7 },
  { category: "Expense", currAmt: 0, type: "Rent", monthlyAmt: 2000, stYr: 2025, numOfYears: 3, rateOfIncrement: 7 },
  { category: "Expense", currAmt: 0, type: "House Maintenance", monthlyAmt: 10000, stYr: 2025, numOfYears: 5, rateOfIncrement: 7 },
  { category: "Expense", currAmt: 0, type: "Self Development", monthlyAmt: 1000, stYr: 2025, numOfYears: 5, rateOfIncrement: 10 },
  { category: "Expense", currAmt: 0, type: "Children's Education", monthlyAmt: 10000, stYr: 2025, numOfYears: 5, rateOfIncrement: 20 },
  { category: "Expense", currAmt: 0, type: "Children's Expense", monthlyAmt: 1000, stYr: 2025, numOfYears: 5, rateOfIncrement: 7 },
  { category: "Expense", currAmt: 0, type: "Parents' Support", monthlyAmt: 10000, stYr: 2025, numOfYears: 5, rateOfIncrement: 7 },
  { category: "Expense", currAmt: 0, type: "Wife's Expense", monthlyAmt: 5000, stYr: 2025, numOfYears: 5, rateOfIncrement: 5 },
  { category: "Expense", currAmt: 0, type: "Health Insurance", monthlyAmt: 1000, stYr: 2025, numOfYears: 5, rateOfIncrement: 5 },
  { category: "Expense", currAmt: 0, type: "Life Insurance", monthlyAmt: 3000, stYr: 2025, numOfYears: 5, rateOfIncrement: 0 },
  { category: "Expense", currAmt: 0, type: "Vehicle Insurance", monthlyAmt: 3000, stYr: 2025, numOfYears: 5, rateOfIncrement: 5 },
  { category: "Expense", currAmt: 0, type: "House Insurance", monthlyAmt: 0, stYr: 2025, numOfYears: 5, rateOfIncrement: 5 },
  { category: "Expense", currAmt: 0, type: "Charity", monthlyAmt: 1000, stYr: 2025, numOfYears: 5, rateOfIncrement: 5 },
  { category: "Expense", currAmt: 0, type: "Travel", monthlyAmt: 2000, stYr: 2025, numOfYears: 5, rateOfIncrement: 7 },
  { category: "Expense", currAmt: 0, type: "Trip", monthlyAmt: 20000, stYr: 2025, numOfYears: 5, rateOfIncrement: 5 },
  { category: "Expense", currAmt: 0, type: "Servant", monthlyAmt: 5000, stYr: 2025, numOfYears: 5, rateOfIncrement: 10 },
  { category: "Expense", currAmt: 0, type: "Medicine", monthlyAmt: 1000, stYr: 2025, numOfYears: 5, rateOfIncrement: 10 },
  { category: "Expense", currAmt: 0, type: "Entertainment", monthlyAmt: 500, stYr: 2025, numOfYears: 5, rateOfIncrement: 10 },
  { category: "Expense", currAmt: 0, type: "Emergency", monthlyAmt: 0, stYr: 2025, numOfYears: 5, rateOfIncrement: 5 },
  { category: "Expense", currAmt: 0, type: "Gift", monthlyAmt: 5000, stYr: 2025, numOfYears: 5, rateOfIncrement: 10 },
  { category: "Expense", currAmt: 0, type: "Investment High Risk", monthlyAmt: 2000, stYr: 2025, numOfYears: 5, rateOfIncrement: 0 },
  { category: "Expense", currAmt: 0, type: "Investment Moderate Risk", monthlyAmt: 1500, stYr: 2025, numOfYears: 5, rateOfIncrement: 0 },
  { category: "Expense", currAmt: 0, type: "Investment Low Risk", monthlyAmt: 1000, stYr: 2025, numOfYears: 5, rateOfIncrement: 0 },
  { category: "Expense", currAmt: 0, type: "Others", monthlyAmt: 0, stYr: 2025, numOfYears: 5, rateOfIncrement: 10 },

  { category: "Debt", currAmt: 300000, type: "House", downPayment: 0, stYr: 2025, numOfYears: 5, rateOfInterest: 9 },
  { category: "Debt", currAmt: 50000, type: "Vehicle", downPayment: 0, stYr: 2025, numOfYears: 5, rateOfInterest: 11 },
  { category: "Debt", currAmt: 80000, type: "Education", downPayment: 0, stYr: 2025, numOfYears: 5, rateOfInterest: 5 },
  { category: "Debt", currAmt: 0, type: "Others", downPayment: 0, stYr: 2025, numOfYears: 5, rateOfInterest: 10 },

  { category: "Investment", currAmt: 1000000, type: "High Risk", monthlyAmt: 2000, stYr: 2025, numOfYears: 5, rateOfInterest: 12, rateOfIncrement: 0 },
  { category: "Investment", currAmt: 700000, type: "Moderate Risk", monthlyAmt: 1500, stYr: 2025, numOfYears: 5, rateOfInterest: 9, rateOfIncrement: 0 },
  { category: "Investment", currAmt: 500000, type: "Low Risk", monthlyAmt: 1000, stYr: 2025, numOfYears: 5, rateOfInterest: 7, rateOfIncrement: 0 },
  { category: "Investment", currAmt: 0, type: "Savings", monthlyAmt: 0, stYr: 2025, numOfYears: 5, rateOfInterest: 3.5, rateOfIncrement: 0 },

  { category: "Summary", type: "Eaten Investment" },
  { category: "Summary", type: "Net Worth" },
  { category: "Summary", type: "Infl Adj Net Worth" },

  { category: "Eaten Ratio", type: "High Risk Eaten" },
  { category: "Eaten Ratio", type: "Moderate Risk Eaten" },
  { category: "Eaten Ratio", type: "Low Risk Eaten" },
];

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