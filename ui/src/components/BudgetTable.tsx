import { forwardRef, useImperativeHandle, useState } from "react";
import { TableData, catInv, defaultSimYr, eatRatio, isInputColumnKeys, summary } from "../app/utils/data";
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
  showInput: boolean;
  demo: boolean;
}

export const BudgetTable = forwardRef(function BudgetTable(
  { tableData, setTableData, editDataRef, simYr, locale, showInput, demo }: BudgetTableProps,
  hideInputBtnRef
) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [showInputs, setShowInputs] = useState(showInput);
  const years = Array.from({ length: Number(simYr || defaultSimYr) }, (_, i) => String(new Date().getFullYear() + i));
 
  // Expose setShowInputs to parent
  useImperativeHandle(hideInputBtnRef, () => ({
    hideInput: () => setShowInputs(false),
  }));

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
      cell: ({ row }: { row: Row<TableData> }) => {
        const isDisabled = [catInv, summary, eatRatio].includes(row.original.category);
        return (
          <div
            className="relative min-w-[150px]"
            onMouseEnter={() => !isDisabled && setHoveredRow(row.index)}
            onMouseLeave={() => !isDisabled && setHoveredRow(null)}
          >
            {editDataRef.current[row.index]?.category ?? ""}
            {!demo && hoveredRow === row.index && !isDisabled && (
            <div className="absolute top-0 right-0 flex space-x-2">
              {/* Delete Row Button */}
              <DelRowButton
                onDelRow={() => delRowAt(row.index)}
              />
              {/* Add Row Button */}
              <AddRowButton
                onAddRow={() => addRowAt(row.index)}
              />
            </div>
            )}
          </div>
        );
      }
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }: { row: Row<TableData> }) => {
        const isNonEditableRow = row.original?.category === summary || row.original?.category === eatRatio || row.original?.category === catInv;
        return (
        <input
          type="text"
          defaultValue={editDataRef.current[row.index]?.type || ""}
          onChange={(e) => updateCell(row.index, "type", e.target.value)}
          onFocus={(e) => e.target.select()}
          className="text-inherit bg-transparent border-none outline-none w-full min-w-[200px]"
          readOnly={isNonEditableRow}
        />
      );
    }
    },
    {
      accessorKey: "currAmt",
      header: "Current Amount",
      cell: ({ row }: { row: Row<TableData> }) => {
        const rawValue = editDataRef.current[row.index]?.currAmt || "";
        const isNonEditableRow = row.original?.category === summary || row.original?.category === eatRatio;
        
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
            readOnly={isNonEditableRow}
          />
        );
      }
    },
    {
      accessorKey: "monthlyAmt",
      header: "Monthly Amount",
      cell: ({ row }: { row: Row<TableData> }) => {
        const rawValue = editDataRef.current[row.index]?.monthlyAmt || "";
        const isNonEditableRow = row.original?.category === summary || row.original?.category === eatRatio;

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
            readOnly={isNonEditableRow}
          />
        );
      },
    },
    {
      accessorKey: "stYr",
      header: "Start Year",
      cell: ({ row }: { row: Row<TableData> }) => {
        const isNonEditableRow = row.original?.category === summary || row.original?.category === eatRatio;
        return (
          <input
            type="number"
            defaultValue={editDataRef.current[row.index]?.stYr || ""}
            onChange={(e) => updateCell(row.index, "stYr", Number(e.target.value))}
            onFocus={(e) => e.target.select()}
            className="text-inherit bg-transparent border-none outline-none w-full appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            readOnly={isNonEditableRow}
          />
        );
      }
    },
    {
      accessorKey: "numOfYears",
      header: "Number of Years",
      cell: ({ row }: { row: Row<TableData> }) => {
        const isNonEditableRow = row.original?.category === summary || row.original?.category === eatRatio;
        return (
          <input
            type="number"
            defaultValue={editDataRef.current[row.index]?.numOfYears || ""}
            onChange={(e) => updateCell(row.index, "numOfYears", Number(e.target.value))}
            onFocus={(e) => e.target.select()}
            className="text-inherit bg-transparent border-none outline-none w-full appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            readOnly={isNonEditableRow}
          />
        );
      }
    },
    {
      accessorKey: "rateOfInterest",
      header: "Rate of Interest (%)",
      cell: ({ row }: { row: Row<TableData> }) => {
      const isNonEditableRow = row.original?.category === summary || row.original?.category === eatRatio;
        return (
          <input
            type="number"
            defaultValue={editDataRef.current[row.index]?.rateOfInterest || ""}
            onChange={(e) => updateCell(row.index, "rateOfInterest", Number(e.target.value))}
            className="text-inherit bg-transparent border-none outline-none w-full appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            readOnly={isNonEditableRow}
          />
        );
      }
    },
    {
      accessorKey: "rateOfIncrement",
      header: "Rate of Increment (%)",
      cell: ({ row }: { row: Row<TableData> }) => {
        const isNonEditableRow = row.original?.category === summary || row.original?.category === eatRatio;
        return (
          <input
            type="number"
            defaultValue={editDataRef.current[row.index]?.rateOfIncrement || ""}
            onChange={(e) => updateCell(row.index, "rateOfIncrement", Number(e.target.value))}
            className="text-inherit bg-transparent border-none outline-none w-full appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            readOnly={isNonEditableRow}
          />
        );
      }
    },
    ...years.map((year) => ({
      accessorKey: year,
      header: year,
      cell: ({ row }: { row: Row<TableData> }) => {

        // Get the raw value for the specific year, defaulting to 0 if there's no value
        const rawValue = row.getValue(year) || 0;

        // Check if the category column has "ratio" value
        const isRatioRow = row.original?.category === eatRatio;

        // Format the value as currency with zero decimals (if rawValue is 0, it will show "0")
        const formattedValue = rawValue && !isRatioRow
        ? Number(rawValue).toLocaleString(locale.locale, {
          style: "currency",
          currency: locale.currency, // Use locale.currency directly
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        })
        : isRatioRow
          ? String(Number(rawValue) * 100) + "%"
          : "";
    
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
    <div className="overflow-x-auto overflow-y-auto max-h-[750px] shadow-xl rounded-lg border border-gray-700 bg-gray-950">
      {/* Toggle Button */}
      <div className="flex justify-start p-3 bg-gray-900 border-b border-gray-700">
        <button
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-md 
                    hover:bg-blue-500 transition duration-200 focus:outline-none focus:ring focus:ring-blue-400"
          onClick={() => setShowInputs((prev) => !prev)}
        >
          {showInputs ? "Hide Inputs" : "Show Inputs"}
        </button>
      </div>
  
      <table className="w-full border-collapse text-gray-300 bg-gray-900">
        {/* Table Header */}
        <thead className="sticky top-0 z-10 shadow-md bg-gray-800 text-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const isInputColumn = isInputColumnKeys.includes(header.column.id);
                return (
                  <th
                    key={header.id}
                    className={`border border-gray-700 p-3 text-left font-semibold uppercase text-sm tracking-wider
                      ${!showInputs && isInputColumn ? "hidden" : ""} 
                      bg-gray-900`}
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
            const isSummaryRow = row.original?.category === summary;
            const isRatioRow = row.original?.category === eatRatio;
  
            return (
              <tr
                key={row.id}
                className={`transition-all duration-200 border-b border-gray-800
                  ${rowIndex % 2 === 0 ? "bg-gray-850" : "bg-gray-900"} 
                  ${!isSummaryRow && !isRatioRow ? "hover:bg-gray-700" : ""}
                  ${isSummaryRow || isRatioRow ? "text-blue-400 font-bold" : ""}
                `}
              >
                {row.getVisibleCells().map((cell) => {
                  const cellKey = cell.column.id;
                  const isInputColumn = isInputColumnKeys.includes(cellKey);
  
                  return (
                    <td
                      key={cell.id}
                      className={`border border-gray-700 p-3 min-w-[150px] w-[200px] text-left 
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
});
