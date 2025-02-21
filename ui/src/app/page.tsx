export const metadata = {
  title: "FinSim - Plan with Confidence",
  description: "Simulate your finances with FinSim. Plan your future with confidence by inputting your income, expenses, debt, and investments.",
  openGraph: {
    title: "FinSim - Plan with Confidence",
    description: "A budget simulation tool to help individuals gain insights into their financial future.",
    url: "https://fisim.com",
    siteName: "FiSim",
    images: [
      {
        url: "/og-image.jpg", // Replace with your actual OG image
        width: 1200,
        height: 630,
        alt: "FinSim Budget Simulation Tool",
      },
    ],
    type: "website",
  },
};

import Hero from "@/components/Hero";
import Features from "@/components/Features"; // New section

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-6">
      <Hero />
      <Features />
    </main>
  );
}
