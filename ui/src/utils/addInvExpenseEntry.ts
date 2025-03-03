import { catExpense, catInv } from "./constant";
import { TableData } from "./data";
  
export async function addInvExpenseEntry(tableData: TableData[]): Promise<TableData[]> {
  const newEntries: TableData[] = [];

  // Remove all investment expenses
  tableData = tableData.filter(
    (entry) =>
      !(entry.category === catExpense && entry.type.startsWith("Inv")));
    
  const expenseIndex = tableData.findLastIndex(item => item.category === catExpense);
  for (const row of tableData) {
    if (row.category === catInv && row.monthlyAmt && row.monthlyAmt > 0) {
      newEntries.push({
        category: catExpense,
        currAmt: 0,
        type: `Inv ${row.type}`,
        monthlyAmt: row.monthlyAmt,
        stYr: row.stYr,
        numOfYears: row.numOfYears,
        rateOfInterest: 0,
        rateOfIncrement: 0,
      });
    }
  }

  // Append new expense entries to the table data
  return [
    ...tableData.slice(0, expenseIndex + 1), // Keep everything before
    ...newEntries, // Add new expense entries
    ...tableData.slice(expenseIndex + 1), // Keep everything after
  ];
}
