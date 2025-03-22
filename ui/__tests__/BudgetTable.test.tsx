import { render, screen, fireEvent } from "@testing-library/react";
import { BudgetTable } from "@/components/BudgetTable";
import React from "react";

// Mock data for the table
type TableData = { id: number; category: string; amount: number };

const mockTableData: TableData[] = [
  { id: 1, category: "Food", amount: 100 },
  { id: 2, category: "Rent", amount: 1200 },
];

const mockSetTableData = jest.fn();
const mockEditDataRef = { current: [] } as React.RefObject<any[]>;
const mockSimYr = 2025;
const mockLocale = { locale: "en-US", currency: "USD" };
const mockShowInput = true;
const mockDemo = false;

const renderComponent = () => {
  render(
    <BudgetTable
      tableData={mockTableData}
      setTableData={mockSetTableData}
      editDataRef={mockEditDataRef}
      simYr={mockSimYr}
      locale={mockLocale}
      showInput={mockShowInput}
      demo={mockDemo}
    />
  );
};

describe("BudgetTable Component", () => {
  test("renders table with correct number of rows", () => {
    renderComponent();
    const rows = screen.getAllByRole("row");
    expect(rows.length).toBe(mockTableData.length + 1); // +1 for header row
  });

  test("calls setTableData when editing an amount", () => {
    renderComponent();
    const input = screen.getByDisplayValue("100") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "150" } });
    expect(mockSetTableData).toHaveBeenCalled();
  });

  test("displays correct categories in table", () => {
    renderComponent();
    expect(screen.getByText("Food")).toBeInTheDocument();
    expect(screen.getByText("Rent")).toBeInTheDocument();
  });
});