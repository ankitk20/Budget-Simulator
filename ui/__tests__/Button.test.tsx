import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "@/components/Button";

describe("Button Component", () => {
  test("renders the button with correct label", () => {
    render(<Button label="Click Me" onClick={() => {}} />);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  test("calls onClick handler when clicked", async () => {
    const mockOnClick = jest.fn();
    render(<Button label="Click Me" onClick={mockOnClick} />);
    
    const button = screen.getByRole("button", { name: /click me/i });
    await userEvent.click(button);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test("is disabled when loading is true", () => {
    render(<Button label="Loading..." onClick={() => {}} loading={true} />);
    
    const button = screen.getByRole("button", { name: /loading/i });
    expect(button).toBeDisabled();
  });

  test("has correct classes when loading", () => {
    render(<Button label="Loading..." onClick={() => {}} loading={true} />);
    
    const button = screen.getByRole("button", { name: /loading/i });
    expect(button).toHaveClass("cursor-not-allowed opacity-50");
  });

  test("has hover effect when not loading", () => {
    render(<Button label="Click Me" onClick={() => {}} />);
    
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toHaveClass("hover:bg-gray-600");
  });
});
