"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function SignInPage() {
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"login" | "otp">("login");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const otpInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      setSuccess("Your email has been verified. You can now sign in.");
    }
  }, [searchParams]);

  useEffect(() => {
    if (step === "otp" && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [step]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setShowResend(false);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact, password }),
      });

      if (res.ok) {
        setStep("otp");
      } else {
        const data = await res.json();
        setError(data.error);
        if (data.error?.toLowerCase().includes("verify your email")) {
          setShowResend(true);
        }
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setVerifying(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact, otp }),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        const data = await res.json();
        setError(data.error);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleResendVerification = async () => {
    setError("");
    setSuccess("");
    if (!contact || !contact.includes("@")) {
      setError("Please enter your email to resend verification.");
      return;
    }

    const res = await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: contact }),
    });

    if (res.ok) {
      setSuccess("Verification email has been resent. Please check your inbox.");
      setShowResend(false);
    } else {
      const data = await res.json();
      setError(data.error || "Failed to resend verification email.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        {step === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <h1 className="text-2xl font-bold text-center">Sign In</h1>

            {success && <p className="text-green-600 text-sm text-center">{success}</p>}
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            {/* Contact */}
            <input
              type="text"
              placeholder="Email or Mobile"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
              disabled={loading}
              required
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                disabled={loading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-gray-500 hover:text-red-600"
                disabled={loading}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {/* Continue Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-full font-semibold flex justify-center items-center shadow-md transition ${
                loading
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-500 to-red-700 text-white hover:shadow-lg"
              }`}
            >
              {loading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                  Processing...
                </>
              ) : (
                "Continue"
              )}
            </button>

            {/* Create Account */}
            <button
              type="button"
              onClick={() => router.push("/signup")}
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-2 rounded-full font-semibold shadow-md hover:shadow-lg transition"
            >
              Create Account
            </button>

            {/* Resend Verification */}
            {showResend && (
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white py-2 rounded-full font-semibold shadow-md hover:shadow-lg transition"
              >
                Resend Verification Email
              </button>
            )}
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleOtp} className="space-y-4">
            <h1 className="text-2xl font-bold text-center">Enter OTP</h1>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <input
              ref={otpInputRef}
              type="text"
              placeholder="6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              disabled={verifying}
              required
            />

            <button
              type="submit"
              disabled={verifying}
              className={`w-full py-2 rounded-full font-semibold flex justify-center items-center shadow-md transition ${
                verifying
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-green-700 text-white hover:shadow-lg"
              }`}
            >
              {verifying ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
