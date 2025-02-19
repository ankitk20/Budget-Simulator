"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import "../app/globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </SessionProvider>
  );
}