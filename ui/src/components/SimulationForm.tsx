import { COUNTRY_MAPPING } from "@/utils/constant";
import React from "react";

interface SimulationFormProps {
  formData: {
    country: string;
    currentAmt: number;
    fortuneAmt: number;
    monthlyIncAmt: number;
    monthlyExpAmt: number;
    monthlyInvAmt: number;
    homeLoanAmt: number;
    vehLoanAmt: number;
    eduLoanAmt: number;
    currentAge: number;
    lifeExpectancy: number;
    retireAge: number;
  };
  onChange: (field: string, value: string | number) => void;
}

const SimulationForm: React.FC<SimulationFormProps> = ({ formData, onChange }) => {
  const { country, currentAmt, fortuneAmt, monthlyIncAmt, monthlyExpAmt, monthlyInvAmt, homeLoanAmt, vehLoanAmt, eduLoanAmt, currentAge, lifeExpectancy, retireAge } = formData;

  const { locale, currency } = COUNTRY_MAPPING[country] || COUNTRY_MAPPING["us"];

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="mb-6 p-6 bg-gray-900 rounded-xl shadow-lg border border-gray-800">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-300 mb-4 text-center">
        Start Your Financial Plan
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

        {/* Country Selector */}
        <div className="col-span-1">
          <label className="block text-gray-400 text-sm mb-1">Country</label>
          <select
            className="w-full p-3 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:ring-2 focus:ring-blue-500"
            value={country}
            onChange={(e) => onChange("country", e.target.value)}
          >
            {Object.entries(COUNTRY_MAPPING).map(([code, { name }]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Input Fields */}
        {[
          { label: "Current Corpus Amount", field: "currentAmt", value: currentAmt },
          { label: "Desired Amount", field: "fortuneAmt", value: fortuneAmt },
          { label: "Monthly Income", field: "monthlyIncAmt", value: monthlyIncAmt },
          { label: "Monthly Expense", field: "monthlyExpAmt", value: monthlyExpAmt },
          { label: "Monthly Investment Amount", field: "monthlyInvAmt", value: monthlyInvAmt },
          { label: "Home Loan Amount", field: "homeLoanAmt", value: homeLoanAmt },
          { label: "Vehicle Loan Amount", field: "vehLoanAmt", value: vehLoanAmt },
          { label: "Education Loan Amount", field: "eduLoanAmt", value: eduLoanAmt },
        ].map(({ label, field, value }) => (
          <div key={field} className="col-span-1">
            <label className="block text-gray-400 text-sm mb-1">{label}</label>
            <input
              type="text"
              className="w-full p-3 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:ring-2 focus:ring-blue-500 text-base"
              value={formatCurrency(value)}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                onChange(field, Math.max(Number(rawValue), 0));
              }}
              onFocus={(e) => e.target.select()}
            />
          </div>
        ))}
  
        {/* Age Inputs */}
        {[
          { label: "Current Age", field: "currentAge", value: currentAge },
          { label: "Expected Life Age", field: "lifeExpectancy", value: lifeExpectancy },
          { label: "Target Retirement Age", field: "retireAge", value: retireAge },
        ].map(({ label, field, value }) => (
          <div key={field} className="col-span-1">
            <label className="block text-gray-400 text-sm mb-1">{label}</label>
            <input
              type="number"
              className="w-full p-3 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:ring-2 focus:ring-blue-500 text-base"
              value={value}
              min={1}
              max={120}
              onChange={(e) => onChange(field, Math.min(Math.max(Number(e.target.value), 1), 120))}
              onFocus={(e) => e.target.select()}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimulationForm;
