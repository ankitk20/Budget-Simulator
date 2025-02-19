"use client"; // For Next.js App Router (if using app directory)

import { signIn, signOut, useSession } from "next-auth/react";

export default function GoogleSignIn() {
  const { data: session } = useSession();

  return (
    <div>
      {session ? (
        <>
          <p>Signed in as {session.user?.name}</p>
          <p>Signed in as {session.accessToken}</p>
          <button onClick={() => signOut()}>Sign out</button>
        </>
      ) : (
        <button onClick={() => signIn("google", { callbackUrl: "/protected" })}>Sign in with Google</button>
      )}
    </div>
  );
}
