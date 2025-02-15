"use client";

import { useRef, useState } from "react";
import { initialData, years, simulationInput } from "./utils/data";
import SimulationButton from "../components/SimulationButton";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

export default function BudgetSimulation() {
  const [tableData, setTableData] = useState<DataEntry[]>(initialData);
  const editedData = useRef<DataEntry[]>([...initialData]);
  const [loading, setLoading] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  editedData.current.forEach((row) => {
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

  const updateCell = (index: number, key: string, value: any) => {
    editedData.current[index] = {
      ...editedData.current[index],
      [key]: value,
    };
  };

  const addRowAt = (index: number) => {
    const newRow: DataEntry = {
      category: editedData.current[index]["category"] || "",
      type: "",
      currAmt: 0,
      monthlyAmt: 0,
      startYear: 2025,
      numOfYears: 0,
      rateOfInterest: 0,
      rateOfIncrement: 0,
    };
    editedData.current.splice(index + 1, 0, newRow);
    setTableData([...editedData.current]);
  };

  const columns = [
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <div
          className="relative"
          onMouseEnter={() => setHoveredRow(row.index)}
          onMouseLeave={() => setHoveredRow(null)}
        >
          <input
            type="text"
            defaultValue={editedData.current[row.index]?.category || ""}
            onChange={(e) => updateCell(row.index, "category", e.target.value)}
            className="text-inherit bg-transparent border-none outline-none w-full"
          />
          {hoveredRow === row.index && (
            <button 
              onClick={() => addRowAt(row.index)} 
              className="absolute right-0 top-1/2 transform -translate-y-1/2 p-1 bg-green-500 text-white rounded"
            >
              +
            </button>
          )}
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <input
          type="text"
          defaultValue={editedData.current[row.index]?.type || ""}
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
          defaultValue={editedData.current[row.index]?.currAmt || ""}
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
          defaultValue={editedData.current[row.index]?.monthlyAmt || ""}
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
          defaultValue={editedData.current[row.index]?.startYear || ""}
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
          defaultValue={editedData.current[row.index]?.numOfYears || ""}
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
          defaultValue={editedData.current[row.index]?.rateOfInterest || ""}
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
          defaultValue={editedData.current[row.index]?.rateOfIncrement || ""}
          onChange={(e) => updateCell(row.index, "rateOfIncrement", Number(e.target.value))}
          className="text-inherit bg-transparent border-none outline-none w-full appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"

        />
      ),
    },
    ...years.map((year) => ({ accessorKey: year, header: year })),
  ];

  const fetchStream = async () => {
    setTableData([...editedData.current]);
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
    
    editedData.current.forEach((row) => {
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
      <SimulationButton fetchStream={fetchStream} loading={loading} />
      <table className="border-collapse border border-gray-300 w-full">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="border border-gray-300 p-1 min-w-[150px] w-[200px] text-left">{flexRender(header.column.columnDef.header, header.getContext())}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="border border-gray-300 p-1 min-w-[150px] w-[200px] text-left">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}