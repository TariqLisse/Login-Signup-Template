"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

// Icons
import { FiMail, FiEye, FiEyeOff, FiCheck, FiX } from "react-icons/fi";
import { FaLockOpen, FaLock, FaShieldAlt } from "react-icons/fa";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignUpPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    birthday: "",
  });

  const [error, setError] = useState("");
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [emailTaken, setEmailTaken] = useState(false);
  const [mobileTaken, setMobileTaken] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const [suggestedPassword, setSuggestedPassword] = useState("");
  const [suggestUsed, setSuggestUsed] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const rules = {
    length: /.{8,}/,
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /\d/,
    special: /[@$!%*?&]/,
  };

  useEffect(() => {
    let score = 0;
    if (rules.length.test(form.password)) score++;
    if (rules.uppercase.test(form.password)) score++;
    if (rules.lowercase.test(form.password)) score++;
    if (rules.number.test(form.password)) score++;
    if (rules.special.test(form.password)) score++;
    setStrength(score);
  }, [form.password]);

  useEffect(() => {
    if (form.password !== suggestedPassword) setSuggestUsed(false);
  }, [form.password, suggestedPassword]);

  // 🔍 Check availability
  useEffect(() => {
    if (form.username.trim()) {
      const check = setTimeout(async () => {
        const res = await fetch(`/api/auth/check-username?username=${form.username}`);
        const data = await res.json();
        setUsernameTaken(data.taken);
      }, 500);
      return () => clearTimeout(check);
    }
  }, [form.username]);

  useEffect(() => {
    if (form.email.trim()) {
      const check = setTimeout(async () => {
        const res = await fetch(`/api/auth/check-email?email=${form.email}`);
        const data = await res.json();
        setEmailTaken(data.taken);
      }, 500);
      return () => clearTimeout(check);
    }
  }, [form.email]);

  useEffect(() => {
    if (form.mobile.trim()) {
      const check = setTimeout(async () => {
        const res = await fetch(`/api/auth/check-mobile?mobile=${form.mobile}`);
        const data = await res.json();
        setMobileTaken(data.taken);
      }, 500);
      return () => clearTimeout(check);
    }
  }, [form.mobile]);

  const isFormValid =
    form.username &&
    (form.email || form.mobile) &&
    (form.email ? emailRegex.test(form.email) : true) &&
    form.password &&
    form.confirmPassword &&
    form.birthday &&
    !usernameTaken &&
    !emailTaken &&
    !mobileTaken &&
    strength === 5 &&
    form.password === form.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!isFormValid) {
      setError("Please fix the errors before signing up.");
      return;
    }
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/signin");
    } else {
      const data = await res.json();
      setError(data.error || "Failed to sign up");
    }
  };

  const generatePassword = async () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@$!%*?&";
    let pwd = "";
    for (let i = 0; i < 14; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setForm({ ...form, password: pwd, confirmPassword: pwd });
    setSuggestedPassword(pwd);
    setSuggestUsed(true);

    try {
      await navigator.clipboard.writeText(pwd);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard copy failed", err);
    }
  };

  const getStrengthIcon = () => {
    if (strength <= 2) return <FaLockOpen className="text-red-500" />;
    if (strength <= 4) return <FaLock className="text-yellow-600" />;
    if (strength === 5) return <FaShieldAlt className="text-green-600" />;
    return <FaLock />;
  };

  const getStrengthLabel = () => {
    if (strength <= 2) return "Weak";
    if (strength === 3 || strength === 4) return "Medium";
    if (strength === 5) return "Strong";
    return "";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 text-center">Create a new account</h1>
        <p className="text-gray-600 text-center text-sm mb-4">Explore the world of EGOBAR.</p>

        {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Username */}
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition`}
            required
          />
          {usernameTaken && <p className="text-xs text-red-500">This username is already taken.</p>}

          {/* Email */}
          <div className="relative">
            <FiMail className="absolute left-3 top-3 text-gray-500" />
            <input
              type="email"
              placeholder="Email (optional)"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={`w-full pl-10 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition`}
            />
          </div>
          {emailTaken && <p className="text-xs text-red-500">This email is already linked.</p>}

          {/* Mobile */}
          <PhoneInput
            country={"us"}
            value={form.mobile.startsWith("+") ? form.mobile.replace("+", "") : ""}
            onChange={(phone) => setForm({ ...form, mobile: `+${phone}` })}
            inputStyle={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
            containerClass="w-full"
          />
          {mobileTaken && <p className="text-xs text-red-500">This mobile is already linked.</p>}

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 text-gray-500 hover:text-red-600"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {/* Confirm Password */}
          <input
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            required
          />
          {form.confirmPassword && form.password !== form.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
          )}

          {/* Strength Indicator */}
          <div className="mt-2">
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  strength <= 2
                    ? "bg-red-500 w-1/3"
                    : strength < 5
                    ? "bg-yellow-500 w-2/3"
                    : "bg-green-600 w-full"
                }`}
              ></div>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-2xl">{getStrengthIcon()}</span>
              <p
                className={`text-xs font-medium ${
                  strength <= 2
                    ? "text-red-500"
                    : strength < 5
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {getStrengthLabel()}
              </p>
            </div>
          </div>

          {/* Suggest Strong Password */}
          <button
            type="button"
            onClick={generatePassword}
            disabled={suggestUsed}
            className={`w-full py-2 rounded-full font-semibold shadow-md transition ${
              suggestUsed
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "animate-pulse-yellow bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:shadow-lg"
            }`}
          >
            {suggestUsed ? "Password Suggested" : "Suggest Strong Password"}
          </button>
          {suggestedPassword && (
            <p className="text-xs text-center mt-1">
              Suggested: <span className="font-mono">{suggestedPassword}</span>{" "}
              {copied && <span className="text-green-600">✓ Copied</span>}
            </p>
          )}

          {/* Birthday */}
          <div>
            <label className="text-sm text-gray-700 mb-1 block">Birthday</label>
            <input
              type="date"
              value={form.birthday}
              onChange={(e) => setForm({ ...form, birthday: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              required
            />
          </div>

          {/* Sign Up */}
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-2 rounded-full font-bold text-lg mt-4 shadow-md transition ${
              isFormValid
                ? "animate-pulse-red bg-gradient-to-r from-red-500 to-red-700 text-white hover:shadow-lg"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          >
            Sign Up
          </button>
        </form>

        {/* Already have account */}
        <button
          onClick={() => router.push("/signin")}
          className="w-full mt-3 py-2 rounded-full font-bold text-lg bg-gradient-to-r from-gray-800 to-black text-white shadow-md hover:shadow-lg transition animate-pulse"
        >
          Already have an account?
        </button>
      </div>
    </div>
  );
}
