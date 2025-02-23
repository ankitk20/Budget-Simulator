"use client";

import { useEffect, useState } from "react";
import { usePlausible } from "next-plausible";
import MockCheckout from "./MockCheckout"; // Import the mock checkout component

const currencyMap: Record<string, string> = {
  US: "USD",
  IN: "INR",
  GB: "GBP",
  CA: "CAD",
  AU: "AUD",
  EU: "EUR",
  JP: "JPY",
};

export default function Pricing() {
  const [localCurrency, setLocalCurrency] = useState("USD");
  const [exchangeRate, setExchangeRate] = useState(1);
  const plausible = usePlausible();

  const plans = [
    {
      name: "Pay As You Go",
      priceUSD: 0.99,
      unit: "/simulation",
      buttonColor: "bg-gray-600 hover:bg-gray-500",
      event: "PayAsYouGoClicked",
      features: ["Exclusive insights", "No commitment", "One-time payment"],
    },
    {
      name: "Monthly",
      priceUSD: 4.99,
      unit: "/month",
      buttonColor: "bg-blue-600 hover:bg-blue-500",
      event: "MonthlyPlanClicked",
      features: ["Exclusive insights", "Unlimited simulations", "Cancel anytime"],
    },
    {
      name: "Yearly",
      priceUSD: 49.99,
      unit: "/year",
      buttonColor: "bg-green-600 hover:bg-green-500",
      event: "YearlyPlanClicked",
      features: ["Best value (2 months free)", "All monthly features", "Exclusive insights"],
    },
  ];

  useEffect(() => {
    const fetchCurrencyAndExchangeRate = async () => {
      try {
        const countryCode = "US";
        const currency = currencyMap[countryCode] || "USD";
        setLocalCurrency(currency);

        const rateRes = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
        const rateData = await rateRes.json();
        setExchangeRate(rateData.rates[currency] || 1);
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
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

              {/* Feature List */}
              <ul className="mt-4 text-gray-300 text-left space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    ✅ <span className="ml-2">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Mock Checkout Button */}
              <div className="mt-6">
                <MockCheckout />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
