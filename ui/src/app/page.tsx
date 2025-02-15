"use client";

import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

interface DataEntry {
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

const initialData: DataEntry[] = [
  { category: "income", currAmt: 0, type: "active", monthlyAmt: 5000, startYear: 2025, numOfYears: 20, rateOfIncrement: 5 },
  // { category: "income", currAmt: 0, type: "passive", monthlyAmt: 1000, startYear: 2030, numOfYears: 15, rateOfIncrement: 10 },

  { category: "expense", currAmt: 0, type: "grocery", monthlyAmt: 1000, startYear: 2025, numOfYears: 20, rateOfIncrement: 7 },
  // { category: "expense", currAmt: 0, type: "utility", monthlyAmt: 0, startYear: 2025, numOfYears: 50, rateOfIncrement: 7 },
  // { category: "expense", currAmt: 0, type: "clothing", monthlyAmt: 0, startYear: 2025, numOfYears: 50, rateOfIncrement: 7 },
  // { category: "expense", currAmt: 0, type: "rent", monthlyAmt: 2000, startYear: 2025, numOfYears: 30, rateOfIncrement: 7 },
  // { category: "expense", currAmt: 0, type: "houseMaintenance", monthlyAmt: 0, startYear: 2025, numOfYears: 35, rateOfIncrement: 7 },
  // { category: "expense", currAmt: 0, type: "selfDevelopment", monthlyAmt: 0, startYear: 2025, numOfYears: 20, rateOfIncrement: 10 },
  // { category: "expense", currAmt: 0, type: "childrenEducation", monthlyAmt: 0, startYear: 2035, numOfYears: 0, rateOfIncrement: 20 },
  // { category: "expense", currAmt: 0, type: "childrenExpense", monthlyAmt: 0, startYear: 2030, numOfYears: 0, rateOfIncrement: 7 },
  // { category: "expense", currAmt: 0, type: "parentsExpense", monthlyAmt: 0, startYear: 2025, numOfYears: 25, rateOfIncrement: 7 },
  // { category: "expense", currAmt: 0, type: "wifeExpense", monthlyAmt: 0, startYear: 2025, numOfYears: 50, rateOfIncrement: 5 },
  // { category: "expense", currAmt: 0, type: "healthInsurance", monthlyAmt: 0, startYear: 2025, numOfYears: 40, rateOfIncrement: 5 },
  // { category: "expense", currAmt: 0, type: "lifeInsurance", monthlyAmt: 0, startYear: 2025, numOfYears: 35, rateOfIncrement: 0 },
  // { category: "expense", currAmt: 0, type: "vehicleInsurance", monthlyAmt: 0, startYear: 2025, numOfYears: 30, rateOfIncrement: 5 },
  // { category: "expense", currAmt: 0, type: "houseInsurance", monthlyAmt: 0, startYear: 2025, numOfYears: 0, rateOfIncrement: 5 },
  // { category: "expense", currAmt: 0, type: "charity", monthlyAmt: 0, startYear: 2025, numOfYears: 50, rateOfIncrement: 5 },
  // { category: "expense", currAmt: 0, type: "travel", monthlyAmt: 1500, startYear: 2027, numOfYears: 25, rateOfIncrement: 7 },
  // { category: "expense", currAmt: 0, type: "trip", monthlyAmt: 0, startYear: 2025, numOfYears: 40, rateOfIncrement: 5 },
  // { category: "expense", currAmt: 0, type: "finOps", monthlyAmt: 0, startYear: 2025, numOfYears: 30, rateOfIncrement: 5 },
  // { category: "expense", currAmt: 0, type: "servant", monthlyAmt: 0, startYear: 2025, numOfYears: 40, rateOfIncrement: 10 },
  // { category: "expense", currAmt: 0, type: "medicine", monthlyAmt: 0, startYear: 2025, numOfYears: 40, rateOfIncrement: 10 },
  // { category: "expense", currAmt: 0, type: "entertainment", monthlyAmt: 0, startYear: 2025, numOfYears: 30, rateOfIncrement: 10 },
  // { category: "expense", currAmt: 0, type: "emergency", monthlyAmt: 0, startYear: 2025, numOfYears: 40, rateOfIncrement: 5 },
  // { category: "expense", currAmt: 0, type: "gift", monthlyAmt: 0, startYear: 2025, numOfYears: 40, rateOfIncrement: 10 },
  // { category: "expense", currAmt: 0, type: "investmentHighRisk", monthlyAmt: 2000, startYear: 2025, numOfYears: 19, rateOfIncrement: 0 },
  // { category: "expense", currAmt: 0, type: "investmentModerateRisk", monthlyAmt: 1500, startYear: 2025, numOfYears: 19, rateOfIncrement: 0 },
  // { category: "expense", currAmt: 0, type: "investmentLowRisk", monthlyAmt: 1000, startYear: 2025, numOfYears: 19, rateOfIncrement: 0 },
  // { category: "expense", currAmt: 0, type: "others", monthlyAmt: 0, startYear: 2025, numOfYears: 1, rateOfIncrement: 10 },

  { category: "debt", currAmt: 300000, type: "house", downPayment: 0, startYear: 2025, numOfYears: 30, rateOfInterest: 9 },
  // { category: "debt", currAmt: 50000, type: "vehicle", downPayment: 0, startYear: 2025, numOfYears: 5, rateOfInterest: 11 },
  // { category: "debt", currAmt: 80000, type: "education", downPayment: 0, startYear: 2026, numOfYears: 10, rateOfInterest: 5 },
  // { category: "debt", currAmt: 0, type: "others", downPayment: 0, startYear: 2025, numOfYears: 5, rateOfInterest: 10 },

  { category: "inv", currAmt: 50000, type: "highRisk", monthlyAmt: 2000, startYear: 2025, numOfYears: 19, rateOfInterest: 12, rateOfIncrement: 0 },
  { category: "inv", currAmt: 30000, type: "moderateRisk", monthlyAmt: 1500, startYear: 2025, numOfYears: 19, rateOfInterest: 9, rateOfIncrement: 0 },
  { category: "inv", currAmt: 0, type: "lowRisk", monthlyAmt: 1000, startYear: 2025, numOfYears: 19, rateOfInterest: 7, rateOfIncrement: 0 },
  { category: "inv", currAmt: 0, type: "savings", monthlyAmt: 0, startYear: 2025, numOfYears: 50, rateOfInterest: 3.5, rateOfIncrement: 0 },

  { category: "summary", type: "eatenInv" },
  { category: "summary", type: "ntWrth" },
  { category: "summary", type: "inflAdjNtWrth" },

  { category: "ratio", type: "highRiskEat" },
  { category: "ratio", type: "moderateRiskEat" },
  { category: "ratio", type: "lowRiskEat" },
];

const years = Array.from({ length: 30 }, (_, i) => String(2025 + i));

export default function BudgetSimulation() {
  const [tableData, setTableData] = useState<DataEntry[]>(initialData);
  const [loading, setLoading] = useState(false);

  const simulationInput = {
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

  tableData.forEach((row) => {
    const category = row.category;
    const type = row.type;

    const entry = {
      currAmt: row.currAmt || 0,
      monthlyAmt: row.monthlyAmt || 0,
      downPay: row.downPayment || 0,
      stYr: row.startYear || 2025,
      numOfYr: row.numOfYears || 0,
      rateOfInt: row.rateOfInterest || 0,
      rateOfInc: row.rateOfIncrement || 0
    };

    if (!simulationInput[category]) {
      simulationInput[category] = {};
    }

    simulationInput[category][type] = entry;
  });

  const updateCell = (rowIndex: number, columnId: string, value: string | number) => {
    setTableData((old) =>
      old.map((row, index) =>
        index === rowIndex ? { ...row, [columnId]: value } : row
      )
    );
  };

  const columns = [
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <input
          type="text"
          defaultValue={row.original.category || ""}
          onChange={(e) => updateCell(row.index, "category", e.target.value)}
          onFocus={(e) => e.target.select()}
          className="text-inherit bg-transparent border-none outline-none w-full"

        />
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <input
          type="text"
          defaultValue={row.original.type || ""}
          onChange={(e) => updateCell(row.index, "type", e.target.value)}
          onFocus={(e) => e.target.select()}
          className="text-inherit bg-transparent border-none outline-none w-full"

        />
      ),
    },
    {
      accessorKey: "currAmt",
      header: "Current Amount",
      cell: ({ row }) => (
        <input
          type="number"
          defaultValue={row.original.currAmt || ""}
          onChange={(e) => updateCell(row.index, "currAmt", Number(e.target.value))}
          onFocus={(e) => e.target.select()}
          className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none text-inherit bg-transparent border-none outline-none w-full"

        />
      ),
    },
    {
      accessorKey: "monthlyAmt",
      header: "Monthly Amount",
      cell: ({ row }) => (
        <input
          type="number"
          defaultValue={row.original.monthlyAmt || ""}
          onChange={(e) => updateCell(row.index, "monthlyAmt", Number(e.target.value))}
          onFocus={(e) => e.target.select()}
          className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none text-inherit bg-transparent border-none outline-none w-full"

        />
      ),
    },
    {
      accessorKey: "startYear",
      header: "Start Year",
      cell: ({ row }) => (
        <input
          type="number"
          defaultValue={row.original.startYear || ""}
          onChange={(e) => updateCell(row.index, "startYear", Number(e.target.value))}
          onFocus={(e) => e.target.select()}
          className="text-inherit bg-transparent border-none outline-none w-full appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"

        />
      ),
    },
    {
      accessorKey: "numOfYears",
      header: "Number of Years",
      cell: ({ row }) => (
        <input
          type="number"
          defaultValue={row.original.numOfYears || ""}
          onChange={(e) => updateCell(row.index, "numOfYears", Number(e.target.value))}
          onFocus={(e) => e.target.select()}
          className="text-inherit bg-transparent border-none outline-none w-full appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"

        />
      ),
    },
    {
      accessorKey: "rateOfInterest",
      header: "Rate of Interest (%)",
      cell: ({ row }) => (
        <input
          type="number"
          defaultValue={row.original.rateOfInterest || ""}
          onChange={(e) => updateCell(row.index, "rateOfInterest", Number(e.target.value))}
          className="text-inherit bg-transparent border-none outline-none w-full appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"

        />
      ),
    },
    {
      accessorKey: "rateOfIncrement",
      header: "Rate of Increment (%)",
      cell: ({ row }) => (
        <input
          type="number"
          defaultValue={row.original.rateOfIncrement || ""}
          onChange={(e) => updateCell(row.index, "rateOfIncrement", Number(e.target.value))}
          className="text-inherit bg-transparent border-none outline-none w-full appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"

        />
      ),
    },
    ...years.map((year) => ({ accessorKey: year, header: year })),
  ];

  const fetchStream = async () => {
    setLoading(true);
    const response = await fetch("/api/simulation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(simulationInput),
    });

    if (!response.body) return;

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulated = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      accumulated += decoder.decode(value, { stream: true });

      const lines = accumulated.split("\n");
      accumulated = lines.pop() || "";
      lines.forEach((line) => {
        if (line.trim()) {
          try {
            const columnData = JSON.parse(line);
            const year = Object.keys(columnData)[0];
            const yearData = columnData[year];

            if (!year || !yearData || typeof yearData !== "object") {
              console.warn("Unexpected JSON format:", columnData);
              return;
            }

            setTableData((prevData) =>
              prevData.map((row) => {
                const categoryKey = row.category;
                const typeKey = row.type;
                if (yearData[categoryKey] && yearData[categoryKey][typeKey] !== undefined) {
                  return {
                    ...row,
                    [year]: yearData[categoryKey][typeKey],
                  };
                }
                return row;
              })
            );
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        }
      });
    }

    setLoading(false);
  };

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4">
      <button onClick={fetchStream} className="p-2 bg-blue-500 text-white mb-4">Run Simulation</button>
      <table className="border-collapse border border-gray-300 w-full">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="border border-gray-300 p-2 min-w-[100px] w-[200px] text-left">{flexRender(header.column.columnDef.header, header.getContext())}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="border border-gray-300 p-2 min-w-[100px] w-[200px] text-left">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}