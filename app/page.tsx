"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiEdit3, FiX, FiSearch } from "react-icons/fi";
import ProfileMenu from "@/app/Components/ProfileMenu";

type User = {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
};

export default function Home() {
  const [index, setIndex] = useState(0);
  const [query, setQuery] = useState("");
  const [isVibeOpen, setIsVibeOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [theme, setTheme] = useState("white");
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const texts = [
    { text: "EGB.", className: "font-[var(--font-press)] text-pink-500" },
    {
      text: "EGOBAR.",
      className:
        "font-[var(--font-orbitron)] bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent tracking-widest",
    },
    {
      text: "Express. Grow. Build.",
      className:
        "whitespace-nowrap font-[var(--font-audio)] bg-gradient-to-r from-yellow-400 to-red-600 bg-clip-text text-transparent drop-shadow-[0_0_6px_#ffae00]",
    },
    {
      text: "Every Genius Builds.",
      className:
        "whitespace-nowrap font-serif text-yellow-500 drop-shadow-[0_0_6px_#ffd700] italic",
    },
  ];

  // 🔄 Rotate logo text
  useEffect(() => {
    const interval = setInterval(
      () => setIndex((prev) => (prev + 1) % texts.length),
      2500
    );
    return () => clearInterval(interval);
  }, [texts.length]);

  // 🎨 Load & Save theme
  useEffect(() => {
    const saved = localStorage.getItem("egb-theme");
    if (saved) setTheme(saved);
  }, []);
  useEffect(() => {
    localStorage.setItem("egb-theme", theme);
  }, [theme]);

  // 👤 Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user || null);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  // 🔍 Search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  // 🎨 Close panel with animation
  const closeVibe = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsVibeOpen(false);
      setIsAnimating(false);
    }, 300);
  };

  const themes = [
    { name: "Default", value: "white", preview: "bg-white border" },
    {
      name: "Sunset",
      value: "linear-gradient(to right, #ffecd2, #fcb69f)",
      preview: "bg-gradient-to-r from-pink-200 to-orange-200",
    },
    {
      name: "Aurora",
      value: "linear-gradient(to right, #6a11cb, #2575fc)",
      preview: "bg-gradient-to-r from-purple-600 to-blue-500",
    },
    {
      name: "Jungle",
      value: "linear-gradient(to right, #11998e, #38ef7d)",
      preview: "bg-gradient-to-r from-green-500 to-teal-400",
    },
    {
      name: "Passion",
      value: "linear-gradient(to right, #ff512f, #dd2476)",
      preview: "bg-gradient-to-r from-red-500 to-pink-600",
    },
  ];

  return (
    <div
      className="flex flex-col min-h-screen font-sans text-gray-900 transition-colors duration-500 relative"
      style={{ background: theme }}
    >
      {/* 🔝 Header */}
      <header className="w-full flex justify-end items-center px-6 py-3 relative z-20">
        <ProfileMenu user={user} />
      </header>

      {/* 🌟 Main */}
      <main className="flex flex-col items-center justify-center flex-grow px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Rotating Logo */}
        <div className="relative h-[120px] sm:h-[140px] mb-10 sm:mb-12 flex items-center justify-center">
          {texts.map((item, i) => (
            <span
              key={`${i}-${index}`}
              className={`absolute text-center text-3xl sm:text-5xl md:text-6xl transition-all duration-700 ease-in-out ${
                i === index ? "opacity-100 scale-100" : "opacity-0 scale-90"
              } ${item.className} ${
                i === index
                  ? i < 2
                    ? "flicker-once"
                    : "fade-up delay-[500ms]"
                  : ""
              }`}
            >
              {item.text}
            </span>
          ))}
        </div>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="w-full max-w-xl flex flex-col items-center"
        >
          <div className="flex items-center w-full border border-gray-400 rounded-full px-3 sm:px-4 py-2 shadow-sm hover:shadow-md focus-within:shadow-md">
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

          {!user && (
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-8 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => router.push("/signup")}
                className="animate-pulse-yellow bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-2 rounded-full text-sm sm:text-base font-semibold shadow-md hover:shadow-lg transition"
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => router.push("/signin")}
                className="animate-pulse-red bg-gradient-to-r from-red-500 to-red-700 text-white px-6 py-2 rounded-full text-sm sm:text-base font-semibold shadow-md hover:shadow-lg transition"
              >
                Sign In
              </button>
            </div>
          )}
        </form>
      </main>

      {/* Footer */}
      <footer className="relative w-full border-t border-gray-300 bg-gray-100 py-4 z-20">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
          <button
            onClick={() => setIsVibeOpen(true)}
            className="animate-pulse-purple flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white px-4 py-2 rounded-full font-semibold shadow-md hover:shadow-lg transition"
          >
            <FiEdit3 className="text-lg" />
            Vibe
          </button>
          <div className="flex flex-wrap gap-4">
            <a href="#" className="hover:text-red-600">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-red-600">
              Terms of Use
            </a>
          </div>
        </div>
      </footer>

      {/* Vibe Panel */}
      {isVibeOpen && (
        <div className="fixed inset-0 flex justify-end z-40">
          <div
            className="absolute inset-0 backdrop-blur-sm bg-white/20"
            onClick={closeVibe}
          ></div>

          <div
            className={`relative w-80 bg-white h-full shadow-xl p-6 transform transition-transform duration-300 z-50 ${
              isAnimating ? "translate-x-full" : "translate-x-0"
            }`}
          >
            <button
              onClick={closeVibe}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
            >
              <FiX size={20} />
            </button>

            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FiEdit3 /> Customize Vibe
            </h2>
            <p className="text-sm text-gray-600 mb-4">Pick a background:</p>

            <div className="grid grid-cols-2 gap-4">
              {themes.map((t) => (
                <button
                  key={t.name}
                  onClick={() => {
                    setTheme(t.value);
                    closeVibe();
                  }}
                  className={`h-20 rounded-lg shadow-md flex items-center justify-center text-xs font-semibold transition hover:scale-105 ${t.preview}`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
