import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="rounded-lg mb-4 bg-gray-900 dark:bg-gray-800 text-gray-200 shadow-lg border-b border-gray-700 p-4 flex justify-between items-center">
      {/* Logo / Title */}
      <h1 className="text-xl font-semibold">Budget Simulator</h1>

      {/* User Profile & Logout */}
      {session?.user ? (
        <div className="flex items-center space-x-3">
          <Image
            src={session.user?.image && session.user.image.startsWith("http") ? session.user.image : "/icon_user.png"}
            alt="User"
            width={40}
            height={40}
            className="rounded-full border border-gray-500 object-cover bg-gray-200"
         />
          <span className="text-sm font-medium">{session.user.name}</span>
          <button
            onClick={() => signOut()}
            className="px-3 py-1 text-sm font-semibold bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition"
          >
            Logout
          </button>
        </div>
      ) : null}
    </nav>
  );
}
