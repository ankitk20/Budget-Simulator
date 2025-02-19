import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="rounded-lg mb-4 bg-gray-900 dark:bg-gray-800 text-gray-200 shadow-lg border-b border-gray-700 p-4 flex justify-between items-center">
      {/* Logo / Title */}
      <h1 className="text-xl font-semibold">Budget Simulator</h1>

      {/* User Profile & Logout */}
      {session?.user ? (
        <div className="flex items-center space-x-3">
          <img /*{src={session?.user?.image!}}*/ alt="User" className="w-10 h-10 rounded-full border border-gray-600" />
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
