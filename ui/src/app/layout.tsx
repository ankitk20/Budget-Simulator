export const metadata = {
  title: "FiSim - Plan with Confidence",
  description: "Take control of your financial future with FiSim. Simulate income, expenses, debt, and investments to make informed decisions.",
  openGraph: {
    title: "FiSim - Plan with Confidence",
    description: "FiSim helps individuals project their financial future with powerful budget simulations and insights.",
    url: "https://fisim.com",
    siteName: "FiSim",
    images: [
      {
        url: "/og-image.jpg", // Replace with actual OG image
        width: 1200,
        height: 630,
        alt: "FiSim - Budget Simulation Tool",
      },
    ],
    type: "website",
  },
};

import type { ReactNode } from "react";
import "../app/globals.css";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}