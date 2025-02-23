"use client";

import { useState } from "react";
import { usePlausible } from "next-plausible";
import { signIn } from "next-auth/react";

export default function MockCheckout() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const plausible = usePlausible();

  const handleCheckout = () => {
    plausible("CheckoutInitiated");
    setIsOpen(true);
  };

  const handlePayment = async () => {
    if (cardNumber.length < 16 || expiry.length < 4 || cvc.length < 3) {
      alert("Please enter valid payment details.");
      return;
    }

    plausible("PaymentSuccess");
    setIsPaid(true);
    setTimeout(async () => {
      setIsOpen(false);
      await signIn("google", { callbackUrl: "/simulate" }); // 🚀 Trigger sign-in after payment
    }, 3000);
  };

  return (
    <>
      <button
        onClick={handleCheckout}
        className="mt-4 px-6 py-3 w-full text-lg font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition"
      >
        Get Started
      </button>

      {/* Payment Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-gray-900 text-white p-6 rounded-xl shadow-xl w-96">
            <h2 className="text-xl font-bold mb-4 text-gray-100">Complete Your Payment</h2>

            {isPaid ? (
              <div className="text-center">
                <p className="text-green-400 font-semibold">✅ Thank you for showing interest!</p>
                <p className="text-gray-400 mt-2">Redirecting to sign in...</p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300">Card Number</label>
                  <input
                    type="tel"
                    placeholder="1234 5678 9012 3456"
                    maxLength={16}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
                    className="mt-1 w-full border border-gray-700 bg-gray-800 rounded-lg p-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="flex gap-2 mb-4">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-300">Expiry (MM/YY)</label>
                    <input
                      type="tel"
                      placeholder="MM/YY"
                      maxLength={5}
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="mt-1 w-full border border-gray-700 bg-gray-800 rounded-lg p-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-300">CVC</label>
                    <input
                      type="tel"
                      placeholder="123"
                      maxLength={3}
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/\D/g, ""))}
                      className="mt-1 w-full border border-gray-700 bg-gray-800 rounded-lg p-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  className="w-full bg-green-500 hover:bg-green-400 text-white font-semibold py-2 rounded-lg transition"
                >
                  Pay Now
                </button>
              </>
            )}

            <button
              onClick={() => setIsOpen(false)}
              className="w-full mt-4 text-gray-400 hover:text-gray-300 hover:underline text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
