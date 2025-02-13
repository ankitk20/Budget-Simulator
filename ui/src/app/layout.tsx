// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css"; // Ensure you have global styles (optional)

export const metadata: Metadata = {
  title: "Budget Simulation",
  description: "A tool to simulate budget and investments over years.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
