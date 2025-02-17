import { useState } from "react";
import { years, TableData, isInputColumnKeys } from "../app/utils/data";
import AddRowButton from "./AddRowButton";
import DelRowButton from "./DelRowButton";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  Row,
} from "@tanstack/react-table";
interface BudgetTableProps {
  tableData: any[];
  setTableData: (data: any[]) => void;
  editDataRef: React.RefObject<any[]>;
  simYr: number;
  locale: { 
    locale: string;    // Assuming this will hold the locale string like 'en-US'
    currency: string;  // Currency like 'USD'
  };
}

export default function BudgetTable({ tableData, setTableData, editDataRef, simYr, locale }: BudgetTableProps) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [showInputs, setShowInputs] = useState(true);
  const years = Array.from({ length: Number(simYr) }, (_, i) => String(new Date().getFullYear() + i));

  const updateCell = (index: number, key: string, value: any) => {
    editDataRef.current[index] = {
      ...editDataRef.current[index],
      [key]: value,
    };
  };

  const addRowAt = (index: number) => {
    const newRow: TableData = {
      category: editDataRef.current[index]["category"] || "",
      type: "",
      currAmt: 0,
      monthlyAmt: 0,
      stYr: undefined,
      numOfYears: 0,
      rateOfInterest: 0,
      rateOfIncrement: 0,
    };
    editDataRef.current.splice(index + 1, 0, newRow);
    setTableData([...editDataRef.current]);
  };

  const delRowAt = (index: number) => {
    editDataRef.current.splice(index, 1);
    setTableData([...editDataRef.current]);
  };

  const columns = [
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }: { row: Row<TableData> }) => (
        <div
          className="relative"
          onMouseEnter={() => setHoveredRow(row.index)}
          onMouseLeave={() => setHoveredRow(null)}
        >
          {editDataRef.current[row.index]?.category ?? ""}
          {hoveredRow === row.index && (
          <div className="absolute top-0 right-0 flex space-x-2">
            {/* Add Row Button */}
            <AddRowButton
              onAddRow={() => addRowAt(row.index)}
            />
            {/* Delete Row Button */}
            <DelRowButton
              onDelRow={() => delRowAt(row.index)}
            />
          </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }: { row: Row<TableData> }) => (
        <input
          type="text"
          defaultValue={editDataRef.current[row.index]?.type || ""}
          onChange={(e) => updateCell(row.index, "type", e.target.value)}
          onFocus={(e) => e.target.select()}
          className="text-inherit bg-transparent border-none outline-none w-full"

        />
      ),
    },
    {
      accessorKey: "currAmt",
      header: "Current Amount",
      cell: ({ row }: { row: Row<TableData> }) => {
        const rawValue = editDataRef.current[row.index]?.currAmt || "";
        
        // Format value with currency (rounded to zero decimals)
        const formattedValue = rawValue
        ? rawValue.toLocaleString(locale.locale || "en-US", {
            style: "currency",
            currency: locale.currency || "USD", // Specify the currency here (e.g., "USD", "EUR", etc.)
            minimumFractionDigits: 0, 
            maximumFractionDigits: 0
          })
        : "";
    
        return (
          <input
            type="text" // Changing to "text" for formatted display
            defaultValue={formattedValue}
            onChange={(e) => {
              const numericValue = Number(e.target.value.replace(/,/g, '')); // Remove commas if any
              updateCell(row.index, "currAmt", numericValue);
            }}
            onFocus={(e) => e.target.select()}
            className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none text-inherit bg-transparent border-none outline-none w-full"
          />
        );
      }
    },
    {
      accessorKey: "monthlyAmt",
      header: "Monthly Amount",
      cell: ({ row }: { row: Row<TableData> }) => {
        const rawValue = editDataRef.current[row.index]?.monthlyAmt || "";
        
        // Format value with currency (rounded to zero decimals)
        const formattedValue = rawValue
        ? rawValue.toLocaleString(locale.locale || "en-US", {
            style: "currency",
            currency: locale.currency || "USD", // Specify the currency here (e.g., "USD", "EUR", etc.)
            minimumFractionDigits: 0, 
            maximumFractionDigits: 0
          })
        : "";
    
        return (
          <input
            type="text" // Changing to "text" for formatted display
            defaultValue={formattedValue}
            onChange={(e) => {
              const numericValue = Number(e.target.value.replace(/,/g, '')); // Remove commas if any
              updateCell(row.index, "monthlyAmt", numericValue);
            }}
            onFocus={(e) => e.target.select()}
            className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none text-inherit bg-transparent border-none outline-none w-full"
          />
        );
      },
    },
    {
      accessorKey: "stYr",
      header: "Start Year",
      cell: ({ row }: { row: Row<TableData> }) => (
        <input
          type="number"
          defaultValue={editDataRef.current[row.index]?.stYr || ""}
          onChange={(e) => updateCell(row.index, "stYr", Number(e.target.value))}
          onFocus={(e) => e.target.select()}
          className="text-inherit bg-transparent border-none outline-none w-full appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"

        />
      ),
    },
    {
      accessorKey: "numOfYears",
      header: "Number of Years",
      cell: ({ row }: { row: Row<TableData> }) => (
        <input
          type="number"
          defaultValue={editDataRef.current[row.index]?.numOfYears || ""}
          onChange={(e) => updateCell(row.index, "numOfYears", Number(e.target.value))}
          onFocus={(e) => e.target.select()}
          className="text-inherit bg-transparent border-none outline-none w-full appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"

        />
      ),
    },
    {
      accessorKey: "rateOfInterest",
      header: "Rate of Interest (%)",
      cell: ({ row }: { row: Row<TableData> }) => (
        <input
          type="number"
          defaultValue={editDataRef.current[row.index]?.rateOfInterest || ""}
          onChange={(e) => updateCell(row.index, "rateOfInterest", Number(e.target.value))}
          className="text-inherit bg-transparent border-none outline-none w-full appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"

        />
      ),
    },
    {
      accessorKey: "rateOfIncrement",
      header: "Rate of Increment (%)",
      cell: ({ row }: { row: Row<TableData> }) => (
        <input
          type="number"
          defaultValue={editDataRef.current[row.index]?.rateOfIncrement || ""}
          onChange={(e) => updateCell(row.index, "rateOfIncrement", Number(e.target.value))}
          className="text-inherit bg-transparent border-none outline-none w-full appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"

        />
      ),
    },
    ...years.map((year) => ({
      accessorKey: year,
      header: year,
      cell: ({ row }: { row: Row<TableData> }) => {
        // Get the raw value for the specific year, defaulting to 0 if there's no value
        const rawValue = row.getValue(year) || 0;
    
        // Check if the category column has "ratio" value
        const isRatioRow = row.original?.category === "ratio";

        // Format the value as currency with zero decimals (if rawValue is 0, it will show "0")
        const formattedValue = rawValue && !isRatioRow
        ? rawValue.toLocaleString(locale.locale ?? "en-US", {
          style: "currency",
          currency: locale.currency ?? "USD", // Specify the currency here (e.g., "USD", "EUR", etc.)
          minimumFractionDigits: 0, 
          maximumFractionDigits: 0
        })
        : isRatioRow ? String(rawValue * 100)+"%" : "";
    
        return (
          <input
            type="text"
            defaultValue={formattedValue} // Display the formatted value, even if empty
            onChange={(e) => {
              // Remove commas and convert the value to a number
              const numericValue = Math.round(Number(e.target.value.replace(/,/g, ''))); // Round to zero decimal
              updateCell(row.index, year, numericValue); // Update the respective year with the numeric value
            }}
            onFocus={(e) => e.target.select()} // Select all text on focus
            className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none text-inherit bg-transparent border-none outline-none w-full"
            readOnly
          />
        );
      },
    }))
  ];

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto overflow-y-auto max-h-[750px] shadow-lg rounded-lg border border-gray-700">
      {/* Toggle Button */}
      <div className="flex justify-start p-2">
        <button
          className="px-3 py-1 text-sm font-semibold bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition"
          onClick={() => setShowInputs((prev) => !prev)}
        >
          {showInputs ? "Hide Inputs" : "Show Inputs"}
        </button>
      </div>
  
      <table className="w-full border-collapse text-white bg-gray-900">
        {/* Table Header */}
        <thead className="sticky top-0 z-10 shadow-md bg-gray-800 text-gray-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
              const isInputColumn = isInputColumnKeys.includes(header.column.id);
  
                return (
                  <th
                    key={header.id}
                    className={`border border-gray-700 p-2 min-w-[150px] w-[200px] text-left font-semibold uppercase 
                      ${!showInputs && isInputColumn ? "hidden" : ""}
                    `}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
  
        {/* Table Body */}
        <tbody>
          {table.getRowModel().rows.map((row, rowIndex) => {
            const isSummaryRow = row.original?.category === "summary";
            const isRatioRow = row.original?.category === "ratio";
  
            return (
              <tr
                key={row.id}
                className={`transition-all duration-200 
                  ${rowIndex % 2 === 0 ? "bg-gray-800" : "bg-gray-900"}
                  ${!isSummaryRow && !isRatioRow ? "hover:bg-gray-700" : ""}
                  ${isSummaryRow || isRatioRow ? "font-bold" : ""}
                `}
              >
                {row.getVisibleCells().map((cell) => {
                  const cellKey = cell.column.id;
                  const isInputColumn = isInputColumnKeys.includes(cellKey);
  
                  return (
                    <td
                      key={cell.id}
                      className={`border border-gray-700 p-2 min-w-[150px] w-[200px] text-left 
                        ${!showInputs && isInputColumn ? "hidden" : ""}
                      `}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );  
}
