"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Hero() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStartSimulating = async () => {
    setLoading(true); // Show loading state to prevent flickering
    if (session) {
      router.push("/simulate");
    } else {
      await signIn("google", { callbackUrl: "/simulate" });
    }
    setLoading(false);
  };

  return (
    <section className="relative flex flex-col items-center justify-center text-center min-h-screen bg-gray-900 text-white px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl"
      >
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          FinSim - <span className="text-blue-500">Plan with Confidence</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-6">
          Take control of your financial future. Simulate your income, expenses, 
          debt, and investments across multiple years and gain clarity over your finances.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`mt-6 px-6 py-3 text-lg font-semibold rounded-lg shadow-md transition ${
            loading ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"
          }`}
          onClick={handleStartSimulating}
          disabled={loading}
        >
          {loading ? "Redirecting..." : "Start Simulating"}
        </motion.button>
      </motion.div>
    </section>
  );
}
