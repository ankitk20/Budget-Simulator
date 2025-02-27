export const metadata = {
  title: "FiSim - Plan with Confidence",
  description: "Take control of your financial future with FiSim. Simulate income, expenses, debt, and investments to make informed decisions.",
  openGraph: {
    title: "FiSim - Plan with Confidence",
    description: "FiSim helps individuals project their financial future with powerful budget simulations and insights.",
    url: "https://fisim.vercel.app",
    siteName: "FiSim",
    images: [
      {
        url: "https://fisim.vercel.app/logo_fisim.png",
        width: 1200,
        height: 630,
        alt: "FiSim - Budget Simulation Tool",
      },
    ],
    type: "website",
  },
  other: {
    "og:image:secure_url": "https://fisim.vercel.app/logo_fisim.png",
    "og:image:type": "image/png",
    "og:image:width": "1024",
    "og:image:height": "1024",
  },
};

import type { ReactNode } from "react";
import "../app/globals.css";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import PlausibleProvider from "next-plausible";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "FiSim - Plan with Confidence",
    "url": "https://fisim.vercel.app",
    "description": "Take control of your financial future with FiSim. Simulate income, expenses, debt, and investments to make informed decisions.",
    "publisher": {
      "@type": "Organization",
      "name": "FiSim",
      "logo": {
        "@type": "ImageObject",
        "url": "https://fisim.vercel.app/logo_fisim.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://fisim.vercel.app",
    },
  };

  return (
    <html lang="en" className={inter.className}>
      <body>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        <PlausibleProvider domain="fisim.vercel.app"> 
          <SessionProviderWrapper>{children}</SessionProviderWrapper>
        </PlausibleProvider>
      </body>
    </html>
  );
}