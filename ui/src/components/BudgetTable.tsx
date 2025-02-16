import { useState } from "react";
import { years, TableData, isInputColumnKeys } from "../app/utils/data";
import AddRowButton from "./AddRowButton";
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
}

export default function BudgetTable({ tableData, setTableData, editDataRef, simYr }: BudgetTableProps) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [showInputs, setShowInputs] = useState(true);
  // const [years, setYears] = useState(() => 
  //   Array.from({ length: simYr }, (_, i) => String(new Date().getFullYear() + i))
  // );

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
          <AddRowButton onAddRow={() => addRowAt(row.index)} />
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
      cell: ({ row }: { row: Row<TableData> }) => (
        <input
          type="number"
          defaultValue={editDataRef.current[row.index]?.currAmt || ""}
          onChange={(e) => updateCell(row.index, "currAmt", Number(e.target.value))}
          onFocus={(e) => e.target.select()}
          className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none text-inherit bg-transparent border-none outline-none w-full"

        />
      ),
    },
    {
      accessorKey: "monthlyAmt",
      header: "Monthly Amount",
      cell: ({ row }: { row: Row<TableData> }) => (
        <input
          type="number"
          defaultValue={editDataRef.current[row.index]?.monthlyAmt || ""}
          onChange={(e) => updateCell(row.index, "monthlyAmt", Number(e.target.value))}
          onFocus={(e) => e.target.select()}
          className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none text-inherit bg-transparent border-none outline-none w-full"

        />
      ),
    },
    {
      accessorKey: "startYear",
      header: "Start Year",
      cell: ({ row }: { row: Row<TableData> }) => (
        <input
          type="number"
          defaultValue={editDataRef.current[row.index]?.stYr || ""}
          onChange={(e) => updateCell(row.index, "startYear", Number(e.target.value))}
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
    ...years.map((year) => ({ accessorKey: year, header: year })),
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
