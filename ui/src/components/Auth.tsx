"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
import Image from 'next/image';

export default function Auth() {
  const { data: session } = useSession();

  return (
    <div className="mt-10 text-center">
      {session ? (
        <>
          <p className="text-xl font-semibold text-gray-200">
            Welcome, {session.user?.name}!
          </p>
          <Image
            src={session.user?.image || "/public/icon_user.png"}
            alt="User"
            className="rounded-full border border-gray-600 mx-auto mt-3"
            width={64}   // Equivalent to w-16
            height={64}  // Equivalent to h-16
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
          onClick={() => signIn("google", { callbackUrl: "/simulate" })}
          className="flex items-center gap-3 px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-500 transition"
        >
          <FaGoogle className="text-2xl" />
          Sign in with Google
        </button>
      )}
    </div>
  );
}
