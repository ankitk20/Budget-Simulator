import { render, screen, fireEvent } from "@testing-library/react";
import SimulationForm from "@/components/SimulationForm";

const mockOnChange = jest.fn();

const mockFormData = {
  country: "us",
  currentAmt: 10000,
  fortuneAmt: 500000,
  monthlyIncAmt: 5000,
  monthlyExpAmt: 2000,
  monthlyInvAmt: 1000,
  homeLoanAmt: 200000,
  vehLoanAmt: 30000,
  eduLoanAmt: 40000,
  currentAge: 30,
  lifeExpectancy: 80,
  retireAge: 60,
};

describe("SimulationForm", () => {
  beforeEach(() => {
    render(<SimulationForm formData={mockFormData} onChange={mockOnChange} />);
  });

  it("renders all input fields", () => {
    expect(screen.getByLabelText(/Current Corpus Amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Desired Amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Monthly Income/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Monthly Expense/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Home Loan Amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Vehicle Loan Amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Education Loan Amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Current Age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Expected Life Age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Target Retirement Age/i)).toBeInTheDocument();
  });

  it("calls onChange when inputs change", () => {
    const input = screen.getByLabelText(/Monthly Income/i);
    fireEvent.change(input, { target: { value: "7000" } });

    expect(mockOnChange).toHaveBeenCalledWith("monthlyIncAmt", 7000);
  });

  it("formats currency properly", () => {
    const formattedInput = screen.getByLabelText(/Current Corpus Amount/i);
    expect(formattedInput).toHaveValue("$10,000"); // Adjust based on locale
  });

  it("restricts age input to valid range", () => {
    const ageInput = screen.getByLabelText(/Current Age/i);
    fireEvent.change(ageInput, { target: { value: "150" } });

    expect(mockOnChange).toHaveBeenCalledWith("currentAge", 120);
  });

  it("renders the country dropdown correctly", () => {
    const select = screen.getByLabelText(/Country/i);
    expect(select).toBeInTheDocument();
    fireEvent.change(select, { target: { value: "in" } });

    expect(mockOnChange).toHaveBeenCalledWith("country", "in");
  });
});
