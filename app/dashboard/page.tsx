// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiLogOut,
  FiUser,
  FiSettings,
  FiHome,
  FiGlobe,
  FiDivideCircle,
  FiShoppingBag,
  FiMessageCircle,
  FiSearch,
} from "react-icons/fi";

type User = {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const router = useRouter();

  // 👤 Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
          router.push("/signin");
        }
      } catch {
        setUser(null);
        router.push("/signin");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  // 🚪 Logout
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/signin");
  };

  // 🔍 Search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg">
        Loading...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 hidden sm:flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-purple-600 mb-8">EGOBAR</h2>
          <nav className="space-y-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 text-gray-700 hover:text-purple-600"
            >
              <FiHome /> Home
            </button>
            <button
              onClick={() => router.push("/dashboard/profile")}
              className="flex items-center gap-2 text-gray-700 hover:text-purple-600"
            >
              <FiUser /> Profile
            </button>
            <button
              onClick={() => router.push("/dashboard/settings")}
              className="flex items-center gap-2 text-gray-700 hover:text-purple-600"
            >
              <FiSettings /> Settings
            </button>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 hover:text-red-800"
        >
          <FiLogOut /> Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        {/* Topbar */}
        <header className="flex justify-between items-center bg-white rounded-lg shadow-sm p-4 mb-6">
          <h1 className="text-xl font-bold text-gray-800">
            Welcome back, {user.username}
          </h1>
          <div className="flex items-center gap-3">
            <img
              src={user.avatar || "/default-avatar.png"}
              alt={user.username}
              className="w-10 h-10 rounded-full border"
            />
            <span className="hidden sm:inline text-gray-700">{user.email}</span>
          </div>
        </header>

        {/* Dashboard widgets */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <h2 className="text-lg font-semibold mb-2">Your Activity</h2>
            <p className="text-gray-600">No activity yet. Start exploring.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <h2 className="text-lg font-semibold mb-2">Stats</h2>
            <p className="text-gray-600">Coming soon...</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <h2 className="text-lg font-semibold mb-2">News</h2>
            <p className="text-gray-600">Stay tuned for updates!</p>
          </div>
        </section>

        {/* Quick Apps */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <button
            onClick={() => router.push("/citizens-lens")}
            className="flex flex-col items-center justify-center rounded-2xl aspect-square w-full shadow-lg transition group bg-gradient-to-r from-purple-400 to-purple-600 text-white hover:scale-105 hover:ring-4 hover:ring-purple-300/50"
          >
            <FiGlobe className="text-5xl group-hover:scale-110 transition-transform" />
            <span className="mt-4 text-lg font-semibold">Citizens Lens</span>
          </button>

          <button
            onClick={() => router.push("/the-divide")}
            className="flex flex-col items-center justify-center rounded-2xl aspect-square w-full shadow-lg transition group bg-gradient-to-r from-red-400 to-red-600 text-white hover:scale-105 hover:ring-4 hover:ring-red-300/50"
          >
            <FiDivideCircle className="text-5xl group-hover:scale-110 transition-transform" />
            <span className="mt-4 text-lg font-semibold">The Divide</span>
          </button>

          <button
            onClick={() => router.push("/marketplace")}
            className="flex flex-col items-center justify-center rounded-2xl aspect-square w-full shadow-lg transition group bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:scale-105 hover:ring-4 hover:ring-yellow-300/50"
          >
            <FiShoppingBag className="text-5xl group-hover:scale-110 transition-transform" />
            <span className="mt-4 text-lg font-semibold">The Trading Post</span>
          </button>

          <button
            onClick={() => router.push("/whispers")}
            className="flex flex-col items-center justify-center rounded-2xl aspect-square w-full shadow-lg transition group bg-gradient-to-r from-blue-400 to-blue-600 text-white hover:scale-105 hover:ring-4 hover:ring-blue-300/50"
          >
            <FiMessageCircle className="text-5xl group-hover:scale-110 transition-transform" />
            <span className="mt-4 text-lg font-semibold">Whispers</span>
          </button>
        </section>

        {/* Search with pulse glow */}
        <form
          onSubmit={handleSearch}
          className="w-full max-w-xl flex flex-col items-center mx-auto"
        >
          <div className="flex items-center w-full border border-gray-400 rounded-full px-3 sm:px-4 py-2 shadow-sm bg-white transition-all focus-within:ring-2 focus-within:ring-red-400 focus-within:animate-pulse">
            <button
              type="submit"
              className="text-gray-500 mr-2 hover:text-red-600 transition-transform duration-150 active:scale-90"
            >
              <FiSearch size={20} />
            </button>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Explore The Portal..."
              className="flex-grow outline-none text-base sm:text-lg bg-transparent placeholder-gray-500 text-gray-800"
            />
          </div>
        </form>
      </main>
    </div>
  );
}
