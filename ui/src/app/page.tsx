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
  { category: "income", type: "active", monthlyAmount: 30000, startYear: 2025, numOfYears: 20, rateOfIncrement: 5 },
  { category: "income", type: "passive", monthlyAmount: 1000, startYear: 2030, numOfYears: 15, rateOfIncrement: 10 },

  { category: "expense", type: "grocery", monthlyAmount: 1000, startYear: 2025, numOfYears: 20, rateOfIncrement: 7 },
  { category: "expense", type: "utility", monthlyAmount: 0, startYear: 2025, numOfYears: 50, rateOfIncrement: 7 },
  { category: "expense", type: "clothing", monthlyAmount: 0, startYear: 2025, numOfYears: 50, rateOfIncrement: 7 },
  { category: "expense", type: "rent", monthlyAmount: 2000, startYear: 2025, numOfYears: 30, rateOfIncrement: 7 },
  { category: "expense", type: "houseMaintenance", monthlyAmount: 0, startYear: 2025, numOfYears: 35, rateOfIncrement: 7 },
  { category: "expense", type: "selfDevelopment", monthlyAmount: 0, startYear: 2025, numOfYears: 20, rateOfIncrement: 10 },
  { category: "expense", type: "childrenEducation", monthlyAmount: 0, startYear: 2035, numOfYears: 0, rateOfIncrement: 20 },
  { category: "expense", type: "childrenExpense", monthlyAmount: 0, startYear: 2030, numOfYears: 0, rateOfIncrement: 7 },
  { category: "expense", type: "parentsExpense", monthlyAmount: 0, startYear: 2025, numOfYears: 25, rateOfIncrement: 7 },
  { category: "expense", type: "wifeExpense", monthlyAmount: 0, startYear: 2025, numOfYears: 50, rateOfIncrement: 5 },
  { category: "expense", type: "healthInsurance", monthlyAmount: 0, startYear: 2025, numOfYears: 40, rateOfIncrement: 5 },
  { category: "expense", type: "lifeInsurance", monthlyAmount: 0, startYear: 2025, numOfYears: 35, rateOfIncrement: 0 },
  { category: "expense", type: "vehicleInsurance", monthlyAmount: 0, startYear: 2025, numOfYears: 30, rateOfIncrement: 5 },
  { category: "expense", type: "houseInsurance", monthlyAmount: 0, startYear: 2025, numOfYears: 0, rateOfIncrement: 5 },
  { category: "expense", type: "charity", monthlyAmount: 0, startYear: 2025, numOfYears: 50, rateOfIncrement: 5 },
  { category: "expense", type: "travel", monthlyAmount: 1500, startYear: 2027, numOfYears: 25, rateOfIncrement: 7 },
  { category: "expense", type: "trip", monthlyAmount: 0, startYear: 2025, numOfYears: 40, rateOfIncrement: 5 },
  { category: "expense", type: "finOps", monthlyAmount: 0, startYear: 2025, numOfYears: 30, rateOfIncrement: 5 },
  { category: "expense", type: "servant", monthlyAmount: 0, startYear: 2025, numOfYears: 40, rateOfIncrement: 10 },
  { category: "expense", type: "medicine", monthlyAmount: 0, startYear: 2025, numOfYears: 40, rateOfIncrement: 10 },
  { category: "expense", type: "entertainment", monthlyAmount: 0, startYear: 2025, numOfYears: 30, rateOfIncrement: 10 },
  { category: "expense", type: "emergency", monthlyAmount: 0, startYear: 2025, numOfYears: 40, rateOfIncrement: 5 },
  { category: "expense", type: "gift", monthlyAmount: 0, startYear: 2025, numOfYears: 40, rateOfIncrement: 10 },
  { category: "expense", type: "investmentHighRisk", monthlyAmount: 2000, startYear: 2025, numOfYears: 19, rateOfIncrement: 0 },
  { category: "expense", type: "investmentModerateRisk", monthlyAmount: 1500, startYear: 2025, numOfYears: 19, rateOfIncrement: 0 },
  { category: "expense", type: "investmentLowRisk", monthlyAmount: 1000, startYear: 2025, numOfYears: 19, rateOfIncrement: 0 },
  { category: "expense", type: "others", monthlyAmount: 0, startYear: 2025, numOfYears: 1, rateOfIncrement: 10 },

  { category: "debt", type: "house", totalAmount: 300000, downPayment: 0, startYear: 2025, numOfYears: 30, rateOfInterest: 9 },
  { category: "debt", type: "vehicle", totalAmount: 50000, downPayment: 0, startYear: 2025, numOfYears: 5, rateOfInterest: 11 },
  { category: "debt", type: "education", totalAmount: 80000, downPayment: 0, startYear: 2026, numOfYears: 10, rateOfInterest: 5 },
  { category: "debt", type: "others", totalAmount: 0, downPayment: 0, startYear: 2025, numOfYears: 5, rateOfInterest: 10 },

  { category: "inv", type: "highRisk", currentAmount: 50000, monthlyAmount: 2000, startYear: 2025, numOfYears: 19, rateOfInterest: 12, rateOfIncrement: 0 },
  { category: "inv", type: "moderateRisk", currentAmount: 30000, monthlyAmount: 1500, startYear: 2025, numOfYears: 19, rateOfInterest: 9, rateOfIncrement: 0 },
  { category: "inv", type: "lowRisk", currentAmount: 20000, monthlyAmount: 1000, startYear: 2025, numOfYears: 19, rateOfInterest: 7, rateOfIncrement: 0 },
  { category: "inv", type: "savings", currentAmount: 0, monthlyAmount: 0, startYear: 2025, numOfYears: 50, rateOfInterest: 3.5, rateOfIncrement: 0 }
];

const years = Array.from({ length: 30 }, (_, i) => String(2025 + i));

export default function BudgetSimulation() {
  const [tableData, setTableData] = useState<DataEntry[]>(initialData);
  const [loading, setLoading] = useState(false);

  const simulationInput2 = {
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
      monthlyAmt: row.monthlyAmount || 0,
      currAmt: row.currentAmount || 0,
      totalAmt: row.totalAmount || 0,
      downPay: row.downPayment || 0,
      stYr: row.startYear || 2025,
      numOfYr: row.numOfYears || 0,
      rateOfInt: row.rateOfInterest || 0,
      rateOfInc: row.rateOfIncrement || 0
    };

    if (!simulationInput2[category]) {
      simulationInput2[category] = {};
    }

    simulationInput2[category][type] = entry;
  });

    console.log(JSON.stringify(simulationInput2, null, 2));

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
          className="border w-full p-1 bg-transparent text-white"

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
          className="border w-full p-1 bg-transparent text-white"

        />
      ),
    },
    {
      accessorKey: "monthlyAmount",
      header: "Monthly Amount",
      cell: ({ row }) => (
        <input
          type="number"
          defaultValue={row.original.monthlyAmount || ""}
          onChange={(e) => updateCell(row.index, "monthlyAmount", Number(e.target.value))}
          className="border w-full p-1 bg-transparent text-white"

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
          className="border w-full p-1 bg-transparent text-white"

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
          className="border w-full p-1 bg-transparent text-white"

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
          className="border w-full p-1 bg-transparent text-white"

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
      body: JSON.stringify(simulationInput2),
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

  // const columns = [
  //   { accessorKey: "category", header: "Category" },
  //   { accessorKey: "type", header: "Type" },
  //   { accessorKey: "currentAmount", header: "Current Value" },
  //   { accessorKey: "monthlyAmount", header: "Monthly Value" },
  //   { accessorKey: "startYear", header: "Starts From" },
  //   { accessorKey: "numOfYears", header: "Number of Years" },
  //   { accessorKey: "rateOfInterest", header: "Rate of Interest" },
  //   { accessorKey: "rateOfIncrement", header: "Rate of Increase" },
  //   ...years.map((year) => ({ accessorKey: year, header: year })),
  // ];

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
                <th key={header.id} className="border border-gray-300 p-2 min-w-[150px] w-[200px] text-left">{flexRender(header.column.columnDef.header, header.getContext())}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="border border-gray-300 p-2">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}