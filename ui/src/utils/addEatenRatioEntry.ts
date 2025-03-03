import { catExpense, catInv, eatRatio } from "./constant";
import { TableData } from "./data";
  
export async function addEatenRatioEntry(tableData: TableData[], eatenRatio: TableData[]): Promise<TableData[]> {
  const lastIndex = tableData.length;
  const newEntries: TableData[] = [];
  for (const [typeKey, value] of Object.entries(eatenRatio)) {
      if ( // Prevent duplicate entries. TODO: Should be optimized further.
        !tableData.some(
          (entry) => entry.category === eatRatio && entry.type === typeKey
        )
      ) {
      newEntries.push({
        category: eatRatio,
        currAmt: 0,
        type: typeKey,
        monthlyAmt: 0,
        stYr: undefined,
        numOfYears: undefined,
        rateOfInterest: 0,
        rateOfIncrement: 0,
      });
    }
  }

  // Append new expense entries to the table data
  return [
    ...tableData.slice(0, lastIndex), // Keep everything before
    ...newEntries, // Add new expense entries
    ...tableData.slice(lastIndex), // Keep everything after
  ];
}
