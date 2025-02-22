"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStartSimulating = async () => {
    setLoading(true);
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
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          FiSim - <span className="text-blue-500"> Plan Your Finances with Confidence</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-6">
          Simulate your income, expenses, debt, and investments over time. 
          Gain clarity and make informed financial decisions.
        </p>

        {/* Start Simulating Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`mt-6 px-6 py-3 text-lg font-semibold rounded-lg shadow-md transition ${
            loading ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"
          }`}
          onClick={handleStartSimulating}
          disabled={loading}
        >
          {loading ? "Redirecting..." : "Start Planning"}
        </motion.button>
      </motion.div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 animate-bounce">
        <Link href="#features">
          <ChevronDown className="h-10 w-10 text-gray-400 cursor-pointer" />
        </Link>
      </div>
    </section>
  );
}
