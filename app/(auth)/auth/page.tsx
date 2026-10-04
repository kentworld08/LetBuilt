"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
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

  useEffect(() => {
    if (resendCountdown <= 0) return;

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
    if (resendCountdown > 0 || resending) return;

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

    if (profile) {
      router.push("/dashboard");
      return;
    }

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
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="absolute left-6 top-6">
        <button
          type="button"
          onClick={() => router.push("/")}
          aria-label="Back to website"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-slate-400 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>
      </div>
      <div className="flex min-h-screen items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          {/* Auth Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/20 sm:p-8">
            {!codeSent ? (
              <>
                <div className="mb-7">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Welcome back
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Enter your email address and we&apos;ll send you a secure
                    verification code.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-slate-200"
                    >
                      Email address
                    </label>

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setError("");
                      }}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-white placeholder:text-slate-600 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={sendCode}
                    disabled={loading || !email.trim()}
                    className="w-full rounded-xl bg-orange-500 px-4 py-3.5 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? "Sending code..." : "Continue"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-7">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                    ✉
                  </div>

                  <h2 className="text-2xl font-semibold tracking-tight">
                    Check your email
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    We sent a 6-digit verification code to
                  </p>

                  <p className="mt-1 break-all text-sm font-medium text-white">
                    {email}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="otp"
                      className="mb-2 block text-sm font-medium text-slate-200"
                    >
                      Verification code
                    </label>

                    <input
                      id="otp"
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
                      placeholder="000000"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 text-center text-2xl font-semibold tracking-[0.45em] text-white placeholder:text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={verifyCode}
                    disabled={loading || otp.length !== 6}
                    className="w-full rounded-xl bg-orange-500 px-4 py-3.5 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? "Verifying..." : "Verify code"}
                  </button>

                  <div className="pt-1 text-center">
                    {resendCountdown > 0 ? (
                      <p className="text-sm text-slate-500">
                        Resend code in{" "}
                        <span className="font-medium text-slate-300">
                          {resendCountdown}s
                        </span>
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={resendCode}
                        disabled={resending}
                        className="text-sm font-medium text-orange-400 transition hover:text-orange-300 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {resending ? "Sending..." : "Resend code"}
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={changeEmail}
                    className="w-full pt-1 text-sm text-slate-500 transition hover:text-white"
                  >
                    Use a different email
                  </button>
                </div>
              </>
            )}

            {message && (
              <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
                <p className="text-sm leading-5 text-emerald-400">{message}</p>
              </div>
            )}

            {error && (
              <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                <p className="text-sm leading-5 text-red-400">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
