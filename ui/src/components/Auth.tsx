"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";

export default function AuthSection() {
  const { data: session } = useSession();

  return (
    <div className="mt-10 text-center">
      {session ? (
        <>
          <p className="text-xl font-semibold text-gray-200">
            Welcome, {session.user?.name}!
          </p>
          <img
            src={session.user?.image || "/default-avatar.png"}
            alt="User"
            className="w-16 h-16 rounded-full border border-gray-600 mx-auto mt-3"
          />
          <button
            onClick={() => signOut()}
            className="mt-4 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 transition"
          >
            Sign out
          </button>
        </>
      ) : (
        <button
          onClick={() => signIn("google", { callbackUrl: "/protected" })}
          className="flex items-center gap-3 px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-500 transition"
        >
          <FaGoogle className="text-2xl" />
          Sign in with Google
        </button>
      )}
    </div>
  );
}
