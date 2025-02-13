"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface DataEntry {
  category: string;
  type: string;
  monthlyAmount?: number;
  currentAmount?: number;
  totalAmount?: number;
  downPayment?: number;
  startYear?: number;
  numOfYears?: number;
  rateOfInterest?: number;
  rateOfIncrement?: number;
  simYears?: number;
  inflationRate?: number;
  ltcgTaxRate?: number;
  stcgTaxRate?: number;
  country?: string;
  currency?: string;
  [year: string]: number | string | undefined;
}

const initialData: DataEntry[] = [
  { category: "Income", type: "Active", monthlyAmount: 7000, startYear: 2025, numOfYears: 20, rateOfIncrement: 5 },
  { category: "Income", type: "Passive", monthlyAmount: 1000, startYear: 2030, numOfYears: 15, rateOfIncrement: 10 },
  
  { category: "Expense", type: "Housing", monthlyAmount: 2000, startYear: 2025, numOfYears: 30, rateOfIncrement: 7 },
  { category: "Expense", type: "Transportation", monthlyAmount: 1500, startYear: 2026, numOfYears: 25, rateOfIncrement: 7 },
  { category: "Expense", type: "Food", monthlyAmount: 1000, startYear: 2027, numOfYears: 20, rateOfIncrement: 7 },
  
  { category: "Debt", type: "Home Loan", totalAmount: 300000, downPayment: 0, startYear: 2025, numOfYears: 30, rateOfInterest: 9 },
  { category: "Debt", type: "Car Loan", totalAmount: 50000, downPayment: 0, startYear: 2025, numOfYears: 5, rateOfInterest: 11 },
  { category: "Debt", type: "Student Loan", totalAmount: 80000, downPayment: 0, startYear: 2026, numOfYears: 10, rateOfInterest: 5 },
  
  { category: "Investment", type: "High Risk", currentAmount: 50000, monthlyAmount: 2000, startYear: 2025, numOfYears: 30, rateOfInterest: 12 },
  { category: "Investment", type: "Moderate Risk", currentAmount: 30000, monthlyAmount: 1500, startYear: 2025, numOfYears: 30, rateOfInterest: 9 },
  { category: "Investment", type: "Low Risk", currentAmount: 20000, monthlyAmount: 1000, startYear: 2025, numOfYears: 30, rateOfInterest: 7, rateOfIncrement: 0 },
  { category: "Investment", type: "Savings", currentAmount: 0, monthlyAmount: 0, startYear: 2025, numOfYears: 30, rateOfInterest: 3.5, rateOfIncrement: 0 }
];

const simulationInput =  {
  "simYr": 30,
  "inflRate": 7,
  "ltcgTaxRate": 12.5,
  "stcgTaxRate": 20.0,
  "country": "USA",
  "currency": "USD",
  "income": {
      "active": {
          "monthlyAmt": 7000,
          "stYr": 2025,
          "numOfYr": 20,
          "rateOfInc": 5.0
      },
      "passive": {
          "monthlyAmt": 1000,
          "stYr": 2030,
          "numOfYr": 15,
          "rateOfInc": 10.0
      }
  },
  "expense": {
      "housing": {
          "monthlyAmt": 2000,
          "stYr": 2025,
          "numOfYr": 30,
          "rateOfInc": 7
      },
      "transportation": {
          "monthlyAmt": 1500,
          "stYr": 2026,
          "numOfYr": 25,
          "rateOfInc": 7
      },
      "food": {
          "monthlyAmt": 1000,
          "stYr": 2027,
          "numOfYr": 20,
          "rateOfInc": 7
      }
  },
  "debt": {
      "homeLoan": {
          "totalAmt": 300000,
          "downPay": 0,
          "stYr": 2025,
          "numOfYr": 30,
          "rateOfInt": 9.0
      },
      "carLoan": {
          "totalAmt": 50000,
          "downPay": 0,
          "stYr": 2025,
          "numOfYr": 5,
          "rateOfInt": 11.0
      },
      "studentLoan": {
          "totalAmt": 80000,
          "downPay": 0,
          "stYr": 2026,
          "numOfYr": 10,
          "rateOfInt": 5.0
      }
  },
  "inv": {
      "highRisk": {
          "currAmt": 50000,
          "monthlyAmt": 2000,
          "stYr": 2025,
          "numOfYr": 30,
          "rateOfInt": 12.0
      },
      "moderateRisk": {
          "currAmt": 30000,
          "monthlyAmt": 1500,
          "stYr": 2025,
          "numOfYr": 30,
          "rateOfInt": 9.0
      },
      "lowRisk": {
          "currAmt": 20000,
          "monthlyAmt": 1000,
          "stYr": 2025,
          "numOfYr": 30,
          "rateOfInt": 7.0,
          "rateOfInc": 0
      },
      "savings": {
          "currAmt": 0,
          "monthlyAmt": 0,
          "stYr": 2025,
          "numOfYr": 30,
          "rateOfInt": 3.5,
          "rateOfInc": 0
      }
  }
}

const years = Array.from({ length: 30 }, (_, i) => 2025 + i);

export default function BudgetSimulation() {
  const [tableData, setTableData] = useState<DataEntry[]>(initialData);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // const fetchData = async () => {
  //   try {
  //     const response = await axios.post("/api/simulation", simulationInput); // Send actual input data
  //     const simulationData = response.data;
  //     const updatedData = tableData.map((row) => {
  //       const categoryKey = row.category.toLowerCase();
  //       return {
  //         ...row,
  //         ...years.reduce((acc, year) => {
  //           acc[year] = simulationData[year]?.[categoryKey]?.[row.type.toLowerCase()] || "-";
  //           return acc;
  //         }, {} as Record<string, number | string>),
  //       };
  //     });
  //     setTableData(updatedData);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  const fetchStream = async () => {
    setLoading(true);
    const response = await fetch("/api/simulation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",  // Specify JSON content type
        "Accept": "application/json",
      },
      body: JSON.stringify(simulationInput)
    });

    if (!response.body) return;

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulated = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      accumulated += decoder.decode(value, { stream: true });
      console.log(accumulated);

      const lines = accumulated.split("\n");
      // accumulated = lines.pop() || ""; // Store any incomplete JSON chunk

      lines.forEach((line) => {
        if (line.trim()) {
          setData((prev) => [...prev, JSON.parse(line)]);
        }
      });
    }

    setLoading(false);
  };

  return (
    <div className="p-4">
      <button onClick={fetchStream} className="p-2 bg-blue-500 text-white mb-4">Run Simulation</button>
      <table className="border-collapse border border-gray-300 w-full">
        <thead>
          <tr>
            <th>Type</th>
            <th>Category</th>
            <th>Current Value</th>
            <th>Monthly Value</th>
            <th>Starts From</th>
            <th>Number of Years</th>
            <th>Rate of Interest</th>
            <th>Rate of Increase</th>
            {years.map((year) => (
              <th key={year}>{year}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, idx) => (
            <tr key={idx}>
              <td>{row.category}</td>
              <td>{row.type}</td>
              <td>{row.currentAmount ?? "-"}</td>
              <td>{row.monthlyAmount ?? "-"}</td>
              <td>{row.startYear ?? "-"}</td>
              <td>{row.numOfYears ?? "-"}</td>
              <td>{row.rateOfInterest ?? "-"}</td>
              <td>{row.rateOfIncrement ?? "-"}</td>
              {years.map((year) => (
                <td key={year}>{row[year] ?? "-"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
