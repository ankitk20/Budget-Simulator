import React, { RefObject, useState, useEffect } from "react";

interface SimulationFormProps {
  countryRef: RefObject<HTMLSelectElement | null>;
  yearsRef: RefObject<HTMLInputElement | null>;
  fortuneAmtRef: RefObject<HTMLInputElement | null>;
  currentAgeRef: RefObject<HTMLInputElement | null>;
  lifeExpectancyRef: RefObject<HTMLInputElement | null>;
}

const COUNTRY_MAPPING: Record<
  string,
  { name: string; locale: string; currency: string }
> = {
  au: { name: "Australia", locale: "en-AU", currency: "AUD" },
  br: { name: "Brazil", locale: "pt-BR", currency: "BRL" },
  ca: { name: "Canada", locale: "en-CA", currency: "CAD" },
  cn: { name: "China", locale: "zh-CN", currency: "CNY" },
  fr: { name: "France", locale: "fr-FR", currency: "EUR" },
  de: { name: "Germany", locale: "de-DE", currency: "EUR" },
  in: { name: "India", locale: "en-IN", currency: "INR" },
  id: { name: "Indonesia", locale: "id-ID", currency: "IDR" },
  it: { name: "Italy", locale: "it-IT", currency: "EUR" },
  jp: { name: "Japan", locale: "ja-JP", currency: "JPY" },
  mx: { name: "Mexico", locale: "es-MX", currency: "MXN" },
  ru: { name: "Russia", locale: "ru-RU", currency: "RUB" },
  sa: { name: "Saudi Arabia", locale: "ar-SA", currency: "SAR" },
  sg: { name: "Singapore", locale: "en-SG", currency: "SGD" },
  za: { name: "South Africa", locale: "en-ZA", currency: "ZAR" },
  kr: { name: "South Korea", locale: "ko-KR", currency: "KRW" },
  es: { name: "Spain", locale: "es-ES", currency: "EUR" },
  tr: { name: "Turkey", locale: "tr-TR", currency: "TRY" },
  ae: { name: "United Arab Emirates", locale: "ar-AE", currency: "AED" },
  gb: { name: "United Kingdom", locale: "en-GB", currency: "GBP" },
  us: { name: "United States", locale: "en-US", currency: "USD" },
};

const SimulationForm: React.FC<SimulationFormProps> = ({
  yearsRef,
  fortuneAmtRef,
  currentAgeRef,
  lifeExpectancyRef,
  countryRef,
}) => {
  const [amount, setAmount] = useState(1000000);
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

        {/* Number of Years Input */}
        <div>
          <label className="block text-gray-300 text-sm mb-1">
            Simulation Years
          </label>
          <input
            ref={yearsRef}
            type="number"
            className="w-full p-2 rounded bg-gray-700 text-white"
            placeholder="10"
            defaultValue={10}
            onChange={(e) => {
              let value = Number(e.target.value);
              if (value < 1) value = 1;
              if (value > 100) value = 100;
              e.target.value = value.toString();
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
            value={formatCurrency(amount)}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
              const numValue = Math.max(Number(rawValue), 0); // Ensure min value is 1
              setAmount(numValue);
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
      </div>
    </div>
  );
};

export default SimulationForm;
