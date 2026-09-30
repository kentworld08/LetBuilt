"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function AuthPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  // Countdown for resend button
  useEffect(() => {
    if (resendCountdown <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setResendCountdown((current) => current - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCountdown]);

  function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function sendCode() {
    setError("");
    setMessage("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email: trimmedEmail,
      options: {
        shouldCreateUser: true,
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setEmail(trimmedEmail);
    setOtp("");
    setCodeSent(true);
    setResendCountdown(60);
    setMessage("We've sent a verification code to your email.");
  }

  async function resendCode() {
    if (resendCountdown > 0 || resending) {
      return;
    }

    setError("");
    setMessage("");
    setResending(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: true,
      },
    });

    setResending(false);

    if (error) {
      setError(error.message);
      return;
    }

    setOtp("");
    setResendCountdown(60);
    setMessage("A new verification code has been sent.");
  }

  async function verifyCode() {
    setLoading(true);
    setMessage("");
    setError("");

    const supabase = createClient();

    const { data, error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: otp,
      type: "email",
    });

    if (error) {
      setLoading(false);

      setError(
        "The verification code is invalid or has expired. Please request a new code.",
      );

      return;
    }

    if (!data.user) {
      setLoading(false);

      setError("Authentication succeeded, but we could not find your user.");

      return;
    }

    // Check whether this user already has a profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", data.user.id)
      .maybeSingle();

    setLoading(false);

    if (profileError) {
      setError("We could not load your profile. Please try again.");
      return;
    }

    // Existing user → dashboard
    if (profile) {
      router.push("/dashboard");
      return;
    }

    // First-time user → profile setup
    router.push("/profile/setup");
  }

  function changeEmail() {
    setCodeSent(false);
    setOtp("");
    setMessage("");
    setError("");
    setResendCountdown(0);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md space-y-6">
        {!codeSent ? (
          <>
            <div>
              <h1 className="text-3xl font-bold">Welcome</h1>

              <p className="mt-2 text-gray-600">
                Enter your email to continue.
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError("");
                }}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full rounded-md border px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
              />

              <button
                type="button"
                onClick={sendCode}
                disabled={loading || !email.trim()}
                className="w-full rounded-md bg-orange-500 px-4 py-3 font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Sending..." : "Continue"}
              </button>
            </div>
          </>
        ) : (
          <>
            <div>
              <h1 className="text-3xl font-bold">Check your email</h1>

              <p className="mt-2 text-gray-600">
                We sent a verification code to{" "}
                <span className="font-medium text-gray-900">{email}</span>
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={otp}
                onChange={(event) => {
                  const value = event.target.value.replace(/\D/g, "");
                  setOtp(value);
                  setError("");
                }}
                placeholder="Enter 6-digit code"
                className="w-full rounded-md border px-4 py-3 text-center text-xl tracking-[0.4em] outline-none focus:ring-2 focus:ring-orange-500"
              />

              <button
                type="button"
                onClick={verifyCode}
                disabled={loading || otp.length !== 6}
                className="w-full rounded-md bg-orange-500 px-4 py-3 font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify code"}
              </button>

              {/* Resend code */}
              <div className="text-center">
                {resendCountdown > 0 ? (
                  <p className="text-sm text-gray-500">
                    Resend code in {resendCountdown}s
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={resendCode}
                    disabled={resending}
                    className="text-sm font-medium text-orange-500 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {resending ? "Sending..." : "Resend code"}
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={changeEmail}
                className="w-full text-sm text-gray-600 hover:text-gray-900"
              >
                Use a different email
              </button>
            </div>
          </>
        )}

        {message && <p className="text-sm text-green-600">{message}</p>}

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </main>
  );
}
