"use client";

import { useSession } from "next-auth/react";

export default function UserSession() {
  const { data: session, status } = useSession();

  console.log("Session Info:", session); // Logs in the browser console

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>Not signed in</p>;

  return (
    <div>
      <h2>Session Data:</h2>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
