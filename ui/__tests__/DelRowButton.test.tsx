import { render, screen, fireEvent } from "@testing-library/react";
import DelRowButton from "@/components/DelRowButton";

describe("DelRowButton", () => {
  it("calls onDelRow when clicked", () => {
    const onDelRowMock = jest.fn();
    render(<DelRowButton onDelRow={onDelRowMock} />);

    const button = screen.getByRole("button", { name: "-" });
    fireEvent.click(button);

    expect(onDelRowMock).toHaveBeenCalledTimes(1);
  });

  it("shows tooltip on hover", async () => {
    render(<DelRowButton onDelRow={jest.fn()} />);

    const button = screen.getByRole("button", { name: "-" });
    fireEvent.mouseOver(button);

    expect(
      await screen.findByText("Delete the current row")
    ).toBeInTheDocument();
  });
});