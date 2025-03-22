import { render, screen, fireEvent } from "@testing-library/react";
import Glossary from "@/components/Glossary";

const mockCountryMap = {
  inflRt: 3.2,
  incomeRtOfInc: 5.0,
  homeLoanRtOfInt: 7.5,
  vehicleLoanRtOfInt: 6.8,
  eduLoanRtOfInt: 5.2,
  highRiskRtOfRet: 12.0,
  moderateRiskRtOfRet: 8.5,
  lowRiskRtOfRet: 4.0,
  savingsRtOfRet: 2.5,
  capGnTaxRate: 15.0,
};

describe("Glossary Component", () => {
  test("renders correctly when open", () => {
    render(<Glossary countryMap={mockCountryMap} open={true} onClose={jest.fn()} />);
    
    expect(screen.getByText(/Glossary/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Close/i })).toBeInTheDocument();
  });

  test("displays correct financial values", () => {
    render(<Glossary countryMap={mockCountryMap} open={true} onClose={jest.fn()} />);
    
    expect(screen.getByText("3.2%")).toBeInTheDocument();
    expect(screen.getByText("7.5%")).toBeInTheDocument();
    expect(screen.getByText("15%")).toBeInTheDocument();
  });

  test("does not render when open is false", () => {
    const { container } = render(<Glossary countryMap={mockCountryMap} open={false} onClose={jest.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  test("closes when close button is clicked", () => {
    const mockOnClose = jest.fn();
    render(<Glossary countryMap={mockCountryMap} open={true} onClose={mockOnClose} />);
    
    const closeButton = screen.getByRole("button", { name: /Close/i });
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
