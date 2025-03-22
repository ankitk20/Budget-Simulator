import { render, screen, fireEvent } from "@testing-library/react";
import AddRowButton from "@/components/AddRowButton";

describe("AddRowButton", () => {
  it("calls onAddRow when clicked", () => {
    const onAddRow = jest.fn();
    render(<AddRowButton onAddRow={onAddRow} />);
    
    const button = screen.getByRole("button", { name: "+" });
    fireEvent.click(button);
    
    expect(onAddRow).toHaveBeenCalledTimes(1);
  });

  it("displays tooltip on hover", async () => {
    render(<AddRowButton onAddRow={jest.fn()} />);
    
    const button = screen.getByRole("button", { name: "+" });
    fireEvent.mouseOver(button);
    
    expect(
      await screen.findByText("Add an empty row for the selected category")
    ).toBeInTheDocument();
  });
});