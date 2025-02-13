"use client";

import { useState } from "react";
import axios from "axios";

interface DataEntry {
  category: string;
  type: string;
  rateOfInterest?: number;
  rateOfIncrement?: number;
  [year: string]: number | string | undefined;
}

const initialData: DataEntry[] = [
  { category: "Income", type: "Active", rateOfIncrement: 5 },
  { category: "Income", type: "Passive", rateOfIncrement: 10 },
  { category: "Expense", type: "Housing", rateOfIncrement: 7 },
  { category: "Expense", type: "Transportation", rateOfIncrement: 7 },
  { category: "Expense", type: "Food", rateOfIncrement: 7 },
  { category: "Debt", type: "Home Loan", rateOfInterest: 9 },
  { category: "Debt", type: "Car Loan", rateOfInterest: 11 },
  { category: "Debt", type: "Student Loan", rateOfInterest: 5 },
  { category: "Investment", type: "High Risk", rateOfInterest: 12 },
  { category: "Investment", type: "Moderate Risk", rateOfInterest: 9 },
  { category: "Investment", type: "Low Risk", rateOfInterest: 7 },
  { category: "Investment", type: "Savings", rateOfInterest: 3.5 },
];

const years = Array.from({ length: 30 }, (_, i) => 2025 + i);

export default function BudgetSimulation() {
  const [tableData, setTableData] = useState<DataEntry[]>(initialData);

  const fetchData = async () => {
    try {
      const response = await axios.post("/api/simulation", {}); // Send actual input data
      const simulationData = response.data;
      const updatedData = tableData.map((row) => {
        const categoryKey = row.category.toLowerCase();
        return {
          ...row,
          ...years.reduce((acc, year) => {
            acc[year] = simulationData[year]?.[categoryKey]?.[row.type.toLowerCase()] || "-";
            return acc;
          }, {} as Record<string, number | string>),
        };
      });
      setTableData(updatedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="p-4">
      <button onClick={fetchData} className="p-2 bg-blue-500 text-white mb-4">Run Simulation</button>
      <table className="border-collapse border border-gray-300 w-full">
        <thead>
          <tr>
            <th>Category</th>
            <th>Type</th>
            <th>Rate of Interest</th>
            <th>Rate of Increment</th>
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
