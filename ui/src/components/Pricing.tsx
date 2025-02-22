"use client";

import { useEffect, useState } from "react";

const currencyMap: Record<string, string> = {
  US: "USD",
  IN: "INR",
  GB: "GBP",
  CA: "CAD",
  AU: "AUD",
  EU: "EUR",
  JP: "JPY",
  // Add more country-to-currency mappings as needed
};

export default function Pricing() {
  const [localCurrency, setLocalCurrency] = useState("USD");
  const [exchangeRate, setExchangeRate] = useState(1);

  const plans = [
    { name: "Pay As You Go", priceUSD: 4.99, unit: "/simulation", buttonColor: "bg-gray-600 hover:bg-gray-500" },
    { name: "Monthly", priceUSD: 29.99, unit: "/month", buttonColor: "bg-blue-600 hover:bg-blue-500" },
    { name: "Yearly", priceUSD: 299.99, unit: "/year", buttonColor: "bg-green-600 hover:bg-green-500" },
  ];

  useEffect(() => {
    const fetchCurrencyAndExchangeRate = async () => {
      try {
        // Fetch user location via geolocation API
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        const countryCode = "US"; // Default to "US" if unknown
        const currency = currencyMap[countryCode] || "USD";

        setLocalCurrency(currency);

        // Fetch exchange rates based on USD
        const rateRes = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
        const rateData = await rateRes.json();
        setExchangeRate(rateData.rates[currency] || 1);
      } catch (error) {
        console.error("Error fetching currency or exchange rate:", error);
      }
    };

    fetchCurrencyAndExchangeRate();
  }, []);

  return (
    <section className="py-16 bg-gray-900 text-white text-center">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Choose Your Plan</h2>
        <p className="text-gray-400 mb-12">Find the perfect plan to match your financial planning needs.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div key={index} className="p-8 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
              <h3 className="text-2xl font-semibold">{plan.name}</h3>
              <p className="text-3xl font-bold mt-4">
                {new Intl.NumberFormat(undefined, {
                  style: "currency",
                  currency: localCurrency,
                }).format(plan.priceUSD * exchangeRate)}
                <span className="text-lg text-gray-400">{plan.unit}</span>
              </p>
              <button className={`mt-6 px-6 py-3 w-full text-lg font-semibold rounded-lg transition ${plan.buttonColor}`}>
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
