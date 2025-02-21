"use client";

import { useEffect, useState } from "react";
import Auth from "./Auth";

export default function UserSession({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Mock function to check user session - Replace this with actual auth logic
    const checkSession = async () => {
      const storedUser = localStorage.getItem("user"); // Example method (Use proper auth)
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };

    checkSession();
  }, []);

  if (!user) {
    return <Auth />; // Show login/signup if no session exists
  }

  return <>{children}</>;
}
