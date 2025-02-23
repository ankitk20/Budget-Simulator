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
import PlausibleProvider from "next-plausible";
import Head from "next/head";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <Head>
        <title>FiSim - Plan with Confidence</title>
        <meta name="description" content="Take control of your financial future with FiSim. Simulate income, expenses, debt, and investments to make informed decisions." />
        <meta property="og:title" content="FiSim - Plan with Confidence" />
        <meta property="og:description" content="FiSim helps individuals project their financial future with powerful budget simulations and insights." />
        <meta property="og:url" content="https://fisim.com" />
        <meta property="og:site_name" content="FiSim" />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="FiSim - Budget Simulation Tool" />
      </Head>
      <body>
        <PlausibleProvider domain="fisim.vercel.app"> 
          <SessionProviderWrapper>{children}</SessionProviderWrapper>
        </PlausibleProvider>
      </body>
    </html>
  );
}