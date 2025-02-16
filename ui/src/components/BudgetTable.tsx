import { useState } from "react";
import { years, DataEntry } from "../app/utils/data";
import AddRowButton from "./AddRowButton";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
interface BudgetTableProps {
  tableData: any[];
  setTableData: (data: any[]) => void;
  editDataRef: React.RefObject<any[]>;
}

export default function BudgetTable({ tableData, setTableData, editDataRef }: BudgetTableProps) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const handleEdit = (rowIndex: number, column: string, value: string | number) => {
    const updatedData = [...tableData];
    updatedData[rowIndex][column] = value;
    setTableData(updatedData);

    // Update reference without triggering re-render
    editDataRef.current[rowIndex][column] = value;
  };

  const updateCell = (index: number, key: string, value: any) => {
    editDataRef.current[index] = {
      ...editDataRef.current[index],
      [key]: value,
    };
  };

  const addRowAt = (index: number) => {
    const newRow: DataEntry = {
      category: editDataRef.current[index]["category"] || "",
      type: "",
      currAmt: 0,
      monthlyAmt: 0,
      startYear: 2025,
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
      cell: ({ row }) => (
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
      cell: ({ row }) => (
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
      cell: ({ row }) => (
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
      cell: ({ row }) => (
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
      cell: ({ row }) => (
        <input
          type="number"
          defaultValue={editDataRef.current[row.index]?.startYear || ""}
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
      cell: ({ row }) => (
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
      cell: ({ row }) => (
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
    <div className="overflow-x-auto overflow-y-auto max-h-[800px] shadow-lg rounded-lg border border-gray-700">
      <table className="w-full border-collapse text-white bg-gray-900">
        {/* Sticky Header */}
        <thead className="sticky top-0 z-10 shadow-md bg-gray-800 text-gray-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border border-gray-700 p-2 min-w-[150px] w-[200px] text-left font-semibold uppercase"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
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
                  const isEditable = editDataRef.current.includes(cellKey) && !isSummaryRow && !isRatioRow;

                  return (
                    <td
                      key={cell.id}
                      className={`border border-gray-700 p-2 min-w-[150px] w-[200px] text-left
                        ${isEditable ? "bg-gray-700 text-yellow-300 font-semibold" : ""}
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
