export interface DataEntry {
  category: string;
  type: string;
  currAmt?: number;
  monthlyAmt?: number;
  downPayment?: number;
  startYear?: number;
  numOfYears?: number;
  rateOfInterest?: number;
  eatenInv?: number;
  ntWrth?: number;
  inflAdjNtWrth?: number;
  highRiskEat?: number;
  moderateRiskEat?: number;
  lowRiskEat?: number;
  rateOfIncrement?: number;
  simYears?: number;
  inflationRate?: number;
  ltcgTaxRate?: number;
  stcgTaxRate?: number;
  country?: string;
  currency?: string;
  [year: string]: number | string | undefined;
}

export const initialData: DataEntry[] = [
  { category: "income", currAmt: 0, type: "active", monthlyAmt: 150000, startYear: 2025, numOfYears: 20, rateOfIncrement: 5 },
  { category: "income", currAmt: 0, type: "passive", monthlyAmt: 1000, startYear: 2030, numOfYears: 15, rateOfIncrement: 10 },

  { category: "expense", currAmt: 0, type: "grocery", monthlyAmt: 1000, startYear: 2025, numOfYears: 20, rateOfIncrement: 7 },
  { category: "expense", currAmt: 0, type: "utility", monthlyAmt: 1000, startYear: 2025, numOfYears: 50, rateOfIncrement: 7 },
  { category: "expense", currAmt: 0, type: "clothing", monthlyAmt: 2000, startYear: 2025, numOfYears: 50, rateOfIncrement: 7 },
  { category: "expense", currAmt: 0, type: "rent", monthlyAmt: 2000, startYear: 2025, numOfYears: 30, rateOfIncrement: 7 },
  { category: "expense", currAmt: 0, type: "houseMaintenance", monthlyAmt: 10000, startYear: 2025, numOfYears: 35, rateOfIncrement: 7 },
  { category: "expense", currAmt: 0, type: "selfDevelopment", monthlyAmt: 1000, startYear: 2025, numOfYears: 20, rateOfIncrement: 10 },
  { category: "expense", currAmt: 0, type: "childrenEducation", monthlyAmt: 10000, startYear: 2035, numOfYears: 20, rateOfIncrement: 20 },
  { category: "expense", currAmt: 0, type: "childrenExpense", monthlyAmt: 1000, startYear: 2030, numOfYears: 20, rateOfIncrement: 7 },
  { category: "expense", currAmt: 0, type: "parentsExpense", monthlyAmt: 10000, startYear: 2025, numOfYears: 25, rateOfIncrement: 7 },
  { category: "expense", currAmt: 0, type: "wifeExpense", monthlyAmt: 5000, startYear: 2025, numOfYears: 50, rateOfIncrement: 5 },
  { category: "expense", currAmt: 0, type: "healthInsurance", monthlyAmt: 1000, startYear: 2025, numOfYears: 40, rateOfIncrement: 5 },
  { category: "expense", currAmt: 0, type: "lifeInsurance", monthlyAmt: 3000, startYear: 2025, numOfYears: 35, rateOfIncrement: 0 },
  { category: "expense", currAmt: 0, type: "vehicleInsurance", monthlyAmt: 3000, startYear: 2025, numOfYears: 30, rateOfIncrement: 5 },
  { category: "expense", currAmt: 0, type: "houseInsurance", monthlyAmt: 0, startYear: 2025, numOfYears: 0, rateOfIncrement: 5 },
  { category: "expense", currAmt: 0, type: "charity", monthlyAmt: 1000, startYear: 2025, numOfYears: 50, rateOfIncrement: 5 },
  { category: "expense", currAmt: 0, type: "travel", monthlyAmt: 2000, startYear: 2027, numOfYears: 25, rateOfIncrement: 7 },
  { category: "expense", currAmt: 0, type: "trip", monthlyAmt: 20000, startYear: 2025, numOfYears: 40, rateOfIncrement: 5 },
  { category: "expense", currAmt: 0, type: "finOps", monthlyAmt: 500, startYear: 2025, numOfYears: 30, rateOfIncrement: 5 },
  { category: "expense", currAmt: 0, type: "servant", monthlyAmt: 5000, startYear: 2025, numOfYears: 40, rateOfIncrement: 10 },
  { category: "expense", currAmt: 0, type: "medicine", monthlyAmt: 1000, startYear: 2025, numOfYears: 40, rateOfIncrement: 10 },
  { category: "expense", currAmt: 0, type: "entertainment", monthlyAmt: 500, startYear: 2025, numOfYears: 30, rateOfIncrement: 10 },
  { category: "expense", currAmt: 0, type: "emergency", monthlyAmt: 0, startYear: 2025, numOfYears: 40, rateOfIncrement: 5 },
  { category: "expense", currAmt: 0, type: "gift", monthlyAmt: 5000, startYear: 2025, numOfYears: 40, rateOfIncrement: 10 },
  { category: "expense", currAmt: 0, type: "investmentHighRisk", monthlyAmt: 2000, startYear: 2025, numOfYears: 19, rateOfIncrement: 0 },
  { category: "expense", currAmt: 0, type: "investmentModerateRisk", monthlyAmt: 1500, startYear: 2025, numOfYears: 19, rateOfIncrement: 0 },
  { category: "expense", currAmt: 0, type: "investmentLowRisk", monthlyAmt: 1000, startYear: 2025, numOfYears: 19, rateOfIncrement: 0 },
  { category: "expense", currAmt: 0, type: "others", monthlyAmt: 0, startYear: 2025, numOfYears: 1, rateOfIncrement: 10 },

  { category: "debt", currAmt: 300000, type: "house", downPayment: 0, startYear: 2025, numOfYears: 30, rateOfInterest: 9 },
  { category: "debt", currAmt: 50000, type: "vehicle", downPayment: 0, startYear: 2025, numOfYears: 5, rateOfInterest: 11 },
  { category: "debt", currAmt: 80000, type: "education", downPayment: 0, startYear: 2026, numOfYears: 10, rateOfInterest: 5 },
  { category: "debt", currAmt: 0, type: "others", downPayment: 0, startYear: 2025, numOfYears: 5, rateOfInterest: 10 },

  { category: "inv", currAmt: 1000000, type: "highRisk", monthlyAmt: 2000, startYear: 2025, numOfYears: 19, rateOfInterest: 12, rateOfIncrement: 0 },
  { category: "inv", currAmt: 700000, type: "moderateRisk", monthlyAmt: 1500, startYear: 2025, numOfYears: 19, rateOfInterest: 9, rateOfIncrement: 0 },
  { category: "inv", currAmt: 500000, type: "lowRisk", monthlyAmt: 1000, startYear: 2025, numOfYears: 19, rateOfInterest: 7, rateOfIncrement: 0 },
  { category: "inv", currAmt: 0, type: "savings", monthlyAmt: 0, startYear: 2025, numOfYears: 50, rateOfInterest: 3.5, rateOfIncrement: 0 },

  { category: "summary", type: "eatenInv" },
  { category: "summary", type: "ntWrth" },
  { category: "summary", type: "inflAdjNtWrth" },

  { category: "ratio", type: "highRiskEat" },
  { category: "ratio", type: "moderateRiskEat" },
  { category: "ratio", type: "lowRiskEat" },
];

export const years = Array.from({ length: 30 }, (_, i) => String(2025 + i));

export const simulationInput = {
  simYr: 30,
  inflRate: 7,
  ltcgTaxRate: 12.5,
  stcgTaxRate: 20.0,
  country: "USA",
  currency: "USD",
  income: {},
  expense: {},  
  debt: {},
  inv: {}
};