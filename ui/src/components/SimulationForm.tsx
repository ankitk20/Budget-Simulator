import { COUNTRY_MAPPING } from "@/app/utils/data";
import React, { RefObject, useState, useEffect } from "react";

interface SimulationFormProps {
  countryRef : RefObject<HTMLSelectElement | null>;
  currentAmtRef : RefObject<HTMLInputElement | null>;
  fortuneAmtRef: RefObject<HTMLInputElement | null>;
  monthlyIncAmtRef : RefObject<HTMLInputElement | null>;
  monthlyExpAmtRef : RefObject<HTMLInputElement | null>;
  monthlyInvAmtRef : RefObject<HTMLInputElement | null>;
  homeLoanAmtRef : RefObject<HTMLInputElement | null>;
  vehLoanAmtRef : RefObject<HTMLInputElement | null>;
  eduLoanAmtRef : RefObject<HTMLInputElement | null>;
  currentAgeRef : RefObject<HTMLInputElement | null>;
  lifeExpectancyRef : RefObject<HTMLInputElement | null>;
  retireAgeRef : RefObject<HTMLInputElement | null>;
}

const SimulationForm: React.FC<SimulationFormProps> = ({
  countryRef,
  currentAmtRef,
  fortuneAmtRef,
  monthlyIncAmtRef,
  monthlyExpAmtRef,
  monthlyInvAmtRef,
  homeLoanAmtRef,
  vehLoanAmtRef,
  eduLoanAmtRef,
  currentAgeRef,
  lifeExpectancyRef,
  retireAgeRef,
}) => {
  const [currentAmt, setCurrentAmt] = useState(0);
  const [fortuneAmt, setFortuneAmt] = useState(0);
  const [monthlyInc, setMonthlyInc] = useState(0);
  const [monthlyExp, setMonthlyExp] = useState(0);
  const [monthlyInv, setMonthlyInv] = useState(0);
  const [homeLoanAmt, setHomeLoanAmt] = useState(0);
  const [vehLoanAmt, setVehLoanAmt] = useState(0);
  const [eduLoanAmt, setEduLoanAmt] = useState(0);
  const [locale, setLocale] = useState("en-US");
  const [currency, setCurrency] = useState("USD");

  // Format currency based on the selected locale & currency
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);

  // Update locale & currency when the country changes
  useEffect(() => {
    if (countryRef.current) {
      const selectedCountry = countryRef.current.value;
      const countrySettings =
        COUNTRY_MAPPING[selectedCountry] || COUNTRY_MAPPING["us"];
      setLocale(countrySettings.locale);
      setCurrency(countrySettings.currency);
    }
  }, [countryRef?.current?.value]);

  return (
    <div className="mb-4 p-4 bg-gray-800 rounded-lg shadow">
      <h2 className="text-lg font-semibold text-gray-200 mb-2">
        Start Your Financial Plan
      </h2>
      <div className="grid grid-cols-3 gap-4">

        {/* Country */}
        <div>
          <label className="block text-gray-300 text-sm mb-1">Country</label>
          <select
            ref={countryRef}
            className="w-full p-2 rounded bg-gray-700 text-white"
            defaultValue="us"
            onChange={() => {
              if (countryRef.current) {
                const selectedCountry = countryRef.current.value;
                const countrySettings =
                  COUNTRY_MAPPING[selectedCountry] || COUNTRY_MAPPING["us"];
                setLocale(countrySettings.locale);
                setCurrency(countrySettings.currency);
              }
            }}
          >
            {Object.entries(COUNTRY_MAPPING).map(([code, { name }]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Current Corpus Amount */}
        <div>
          <label className="block text-gray-300 text-sm mb-1">
            Current Corpus Amount
          </label>
          <input
            ref={currentAmtRef}
            type="text"
            className="w-full p-2 rounded bg-gray-700 text-white"
            value={formatCurrency(currentAmt)}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
              const numValue = Math.max(Number(rawValue), 0); // Ensure min value is 1
              setCurrentAmt(numValue);
            }}
            onFocus={(e) => e.target.select()}
          />
        </div>

         {/* Target Fortune Amount */}
         <div>
          <label className="block text-gray-300 text-sm mb-1">
            Desired Amount
          </label>
          <input
            ref={fortuneAmtRef}
            type="text"
            className="w-full p-2 rounded bg-gray-700 text-white"
            value={formatCurrency(fortuneAmt)}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
              const numValue = Math.max(Number(rawValue), 0); // Ensure min value is 1
              setFortuneAmt(numValue);
            }}
            onFocus={(e) => e.target.select()}
          />
        </div>

        {/* Monthly Income Amount */}
        <div>
          <label className="block text-gray-300 text-sm mb-1">
            Monthly Income
          </label>
          <input
            ref={monthlyIncAmtRef}
            type="text"
            className="w-full p-2 rounded bg-gray-700 text-white"
            value={formatCurrency(monthlyInc)}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
              const numValue = Math.max(Number(rawValue), 0); // Ensure min value is 1
              setMonthlyInc(numValue);
            }}
            onFocus={(e) => e.target.select()}
          />
        </div>

        {/* Monthly Expense Amount */}
        <div>
          <label className="block text-gray-300 text-sm mb-1">
            Monthly Expense
          </label>
          <input
            ref={monthlyExpAmtRef}
            type="text"
            className="w-full p-2 rounded bg-gray-700 text-white"
            value={formatCurrency(monthlyExp)}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
              const numValue = Math.max(Number(rawValue), 0); // Ensure min value is 1
              setMonthlyExp(numValue);
            }}
            onFocus={(e) => e.target.select()}
          />
        </div>

        {/* Monthly Investment Amount */}
        <div>
          <label className="block text-gray-300 text-sm mb-1">
            Monthly Investment Amount
          </label>
          <input
            ref={monthlyInvAmtRef}
            type="text"
            className="w-full p-2 rounded bg-gray-700 text-white"
            value={formatCurrency(monthlyInv)}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
              const numValue = Math.max(Number(rawValue), 0); // Ensure min value is 1
              setMonthlyInv(numValue);
            }}
            onFocus={(e) => e.target.select()}
          />
        </div>

        {/* Home Loan Amount */}
        <div>
          <label className="block text-gray-300 text-sm mb-1">
            Home Loan Amount
          </label>
          <input
            ref={homeLoanAmtRef}
            type="text"
            className="w-full p-2 rounded bg-gray-700 text-white"
            value={formatCurrency(homeLoanAmt)}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
              const numValue = Math.max(Number(rawValue), 0); // Ensure min value is 1
              setHomeLoanAmt(numValue);
            }}
            onFocus={(e) => e.target.select()}
          />
        </div>

        {/* Vehicle Loan Amount */}
        <div>
          <label className="block text-gray-300 text-sm mb-1">
            Vehicle Loan Amount
          </label>
          <input
            ref={vehLoanAmtRef}
            type="text"
            className="w-full p-2 rounded bg-gray-700 text-white"
            value={formatCurrency(vehLoanAmt)}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
              const numValue = Math.max(Number(rawValue), 0); // Ensure min value is 1
              setVehLoanAmt(numValue);
            }}
            onFocus={(e) => e.target.select()}
          />
        </div>

        {/* Education Loan Amount */}
        <div>
          <label className="block text-gray-300 text-sm mb-1">
            Education Loan Amount
          </label>
          <input
            ref={eduLoanAmtRef}
            type="text"
            className="w-full p-2 rounded bg-gray-700 text-white"
            value={formatCurrency(eduLoanAmt)}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
              const numValue = Math.max(Number(rawValue), 0); // Ensure min value is 1
              setEduLoanAmt(numValue);
            }}
            onFocus={(e) => e.target.select()}
          />
        </div>


        {/* Current Age */}
        <div>
          <label className="block text-gray-300 text-sm mb-1">
            Current Age (Years)
          </label>
          <input
            ref={currentAgeRef}
            type="number"
            className="w-full p-2 rounded bg-gray-700 text-white"
            defaultValue={25}
            min={1}
            max={120}
            onChange={(e) => {
              let value = Number(e.target.value);
              if (value < 1) value = 1;
              if (value > 120) value = 120;
              e.target.value = value.toString();
            }}
            onFocus={(e) => e.target.select()}
          />
        </div>

        {/* Life Expectancy */}
        <div>
          <label className="block text-gray-300 text-sm mb-1">
            Expected Life Age (Years)
          </label>
          <input
            ref={lifeExpectancyRef}
            type="number"
            className="w-full p-2 rounded bg-gray-700 text-white"
            defaultValue={85}
            min={1}
            max={120}
            onChange={(e) => {
              let value = Number(e.target.value);
              if (value < 1) value = 1;
              if (value > 120) value = 120;
              e.target.value = value.toString();
            }}
            onFocus={(e) => e.target.select()}
          />
        </div>

        {/* Target Retirement Age */}
        <div>
          <label className="block text-gray-300 text-sm mb-1">
            Target Retirement Age (Years)
          </label>
          <input
            ref={retireAgeRef}
            type="number"
            className="w-full p-2 rounded bg-gray-700 text-white"
            defaultValue={50}
            min={1}
            max={120}
            onChange={(e) => {
              let value = Number(e.target.value);
              if (value < 1) value = 1;
              if (value > 120) value = 120;
              e.target.value = value.toString();
            }}
            onFocus={(e) => e.target.select()}
          />
        </div>
      </div>
    </div>
  );
};

export default SimulationForm;
