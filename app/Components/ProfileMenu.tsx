"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiUser,
  FiLogOut,
  FiLogIn,
  FiUserPlus,
  FiFileText,
  FiShield,
} from "react-icons/fi";

type User = {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
};

export default function ProfileMenu({ user }: { user: User | null }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
    setMenuOpen(false);
  };

  return (
    <div className="relative">
      {user ? (
        <img
          src={user.avatar || "/default-avatar.png"}
          alt={user.username}
          className="w-10 h-10 rounded-full cursor-pointer border hover:shadow-md"
          onClick={() => setMenuOpen((prev) => !prev)}
        />
      ) : (
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition"
        >
          <FiUser className="text-gray-700 text-xl" />
        </button>
      )}

      {/* Dropdown */}
      <div
        className={`absolute right-0 mt-2 w-52 rounded-lg shadow-lg border z-50 transform transition-all duration-300 origin-top-right ${
          menuOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
        style={{ background: "white" }}
      >
        <ul className="py-2 text-sm text-gray-800">
          {user ? (
            <li
              className="px-4 py-2 flex items-center gap-2 hover:bg-gray-200 cursor-pointer"
              onClick={handleLogout}
            >
              <FiLogOut /> Log out
            </li>
          ) : (
            <>
              <li
                className="px-4 py-2 flex items-center gap-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => router.push("/signin")}
              >
                <FiLogIn /> Sign in
              </li>
              <li
                className="px-4 py-2 flex items-center gap-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => router.push("/signup")}
              >
                <FiUserPlus /> Create account
              </li>
            </>
          )}
          <li
            className="px-4 py-2 flex items-center gap-2 hover:bg-gray-200 cursor-pointer"
            onClick={() => router.push("/privacy")}
          >
            <FiShield /> Privacy Policy
          </li>
          <li
            className="px-4 py-2 flex items-center gap-2 hover:bg-gray-200 cursor-pointer"
            onClick={() => router.push("/terms")}
          >
            <FiFileText /> Terms of Use
          </li>
        </ul>
      </div>
    </div>
  );
}
