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
  country: string;
  [key: string]: Record<string, EntryType> | number | string; // Allow dynamic categories
}; 
