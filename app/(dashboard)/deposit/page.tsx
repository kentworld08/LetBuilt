"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clipboard,
  Copy,
  Loader2,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type CryptoOption = {
  asset: "BTC" | "USDT";
  network: "Bitcoin" | "Ethereum (ERC-20)" | "Tron (TRC-20)";
  address: string;
  label: string;
};

const cryptoOptions: CryptoOption[] = [
  {
    asset: "BTC",
    network: "Bitcoin",
    address: "bc1pr652fa7ehmkv8ztmr2ve6rgdhyfjnnua4keasa5qs0l5cvl7hkfqjfg98r",
    label: "BTC — Bitcoin",
  },
  {
    asset: "USDT",
    network: "Ethereum (ERC-20)",
    address: "0x20813C2cbfccFc2c2680773F2CaF5a583c8711a6",
    label: "USDT — Ethereum (ERC-20)",
  },
  {
    asset: "USDT",
    network: "Tron (TRC-20)",
    address: "TFP4m7sJKrfwBTxpXpjzCH3VowXjrxUhMk",
    label: "USDT — Tron (TRC-20)",
  },
];

export default function DepositPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [amount, setAmount] = useState("");
  const [selectedOption, setSelectedOption] = useState(cryptoOptions[0]);

  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hashLoading, setHashLoading] = useState(false);

  const [error, setError] = useState("");
  const [hashError, setHashError] = useState("");

  const [transactionHash, setTransactionHash] = useState("");

  const [success, setSuccess] = useState<{
    id: string;
    reference: string;
    amount: number;
    asset: string;
    network: string;
    address: string;
  } | null>(null);

  const [hashSubmitted, setHashSubmitted] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");

  async function copyAddress(address: string) {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError("Unable to copy the address. Please copy it manually.");
    }
  }

  async function submitDeposit() {
    setError("");
    setCopied(false);

    const numericAmount = Number(amount);

    if (!amount || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid deposit amount.");
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setLoading(false);
      router.push("/auth");
      return;
    }

    const { data, error: depositError } = await supabase.rpc(
      "create_crypto_deposit_request",
      {
        p_amount: numericAmount,
        p_asset: selectedOption.asset,
        p_network: selectedOption.network,
      },
    );

    setLoading(false);

    if (depositError) {
      setError(depositError.message);
      return;
    }

    if (!data) {
      setError("We could not create your deposit request.");
      return;
    }

    setSuccess({
      id: data.id,
      reference: data.reference,
      amount: Number(data.amount),
      asset: data.asset,
      network: data.network,
      address: selectedOption.address,
    });

    setAmount("");
  }

  async function submitTransactionHash() {
    setHashError("");
    setVerificationMessage("");

    const hash = transactionHash.trim();

    if (!hash) {
      setHashError("Please enter your transaction ID.");
      return;
    }

    if (hash.length < 32) {
      setHashError("The transaction ID appears to be invalid.");
      return;
    }

    if (!success) {
      setHashError("Deposit information is missing.");
      return;
    }

    setHashLoading(true);

    try {
      const response = await fetch("/api/deposits/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          depositId: success.id,
          transactionHash: hash,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setHashError(
          result?.error ||
            "We could not verify this transaction. Please check the transaction ID and try again.",
        );
        return;
      }

      setTransactionHash(hash);

      setVerificationMessage(
        result?.message ||
          "Your Bitcoin deposit has been verified and credited to your account.",
      );

      // Refresh dashboard data immediately after a successful deposit.
      await queryClient.invalidateQueries({
        queryKey: ["account-balance"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["asset-balances"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });

      setHashSubmitted(true);
    } catch {
      setHashError(
        "Something went wrong while verifying the transaction. Please try again.",
      );
    } finally {
      setHashLoading(false);
    }
  }

  if (success) {
    return (
      <main className="h-screen overflow-hidden bg-gray-50">
        <div className="flex h-full flex-col">
          {/* Top bar */}
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-5 sm:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                aria-label="Back to dashboard"
              >
                <ArrowLeft size={20} />
              </button>

              <div>
                <p className="text-sm font-medium text-gray-500">Wallet</p>

                <h1 className="text-base font-semibold text-gray-900">
                  Deposit
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <ShieldCheck size={18} className="text-green-600" />
              Secure deposit
            </div>
          </header>

          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto flex min-h-full w-full max-w-3xl items-center px-5 py-6 sm:px-8">
              <div className="w-full">
                {/* Success heading */}
                <div className="mb-6 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600">
                    <CheckCircle2 size={30} />
                  </div>

                  <h2 className="mt-4 text-2xl font-bold text-gray-900">
                    Deposit request created
                  </h2>

                  <p className="mx-auto mt-2 max-w-xl text-sm text-gray-600">
                    Send your cryptocurrency to the address below, then enter
                    your transaction ID so we can verify the payment.
                  </p>
                </div>

                {/* Main card */}
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                  {/* Deposit summary */}
                  <div className="grid gap-4 border-b border-gray-200 p-5 sm:grid-cols-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Amount requested
                      </p>

                      <p className="mt-1 text-lg font-bold text-gray-900">
                        {success.amount.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 8,
                        })}{" "}
                        {success.asset}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Network
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {success.network}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Status
                      </p>

                      <span
                        className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          hashSubmitted
                            ? "bg-green-50 text-green-700"
                            : "bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        {hashSubmitted ? "Completed" : "Pending"}
                      </span>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-gray-900">
                          Payment address
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          Send only {success.asset} on {success.network}
                        </p>
                      </div>

                      <Wallet size={20} className="text-gray-400" />
                    </div>

                    <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                      <p className="break-all font-mono text-xs leading-6 text-gray-700">
                        {success.address}
                      </p>

                      <button
                        type="button"
                        onClick={() => copyAddress(success.address)}
                        className="mt-3 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-100"
                      >
                        {copied ? (
                          <>
                            <CheckCircle2
                              size={16}
                              className="text-green-600"
                            />
                            Address copied
                          </>
                        ) : (
                          <>
                            <Copy size={16} />
                            Copy address
                          </>
                        )}
                      </button>
                    </div>

                    {/* Reference */}
                    <div className="mt-4 flex flex-col gap-1 rounded-lg bg-gray-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-sm text-gray-600">
                        Deposit reference
                      </span>

                      <span className="font-mono text-sm font-semibold text-gray-900">
                        {success.reference}
                      </span>
                    </div>

                    {/* Warning */}
                    <div className="mt-4 rounded-xl border border-orange-200 bg-orange-50 p-4">
                      <p className="text-sm font-semibold text-orange-900">
                        Important
                      </p>

                      <p className="mt-1 text-sm leading-5 text-orange-800">
                        Send only {success.asset} using the {success.network}{" "}
                        network to the address above. Sending a different asset
                        or network may result in permanent loss of funds.
                      </p>
                    </div>

                    {/* Verification */}
                    {!hashSubmitted ? (
                      <div className="mt-6 border-t border-gray-200 pt-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                            <Clipboard size={18} />
                          </div>

                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Confirm your payment
                            </h3>

                            <p className="text-xs text-gray-500">
                              Enter the transaction ID from your wallet.
                            </p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <input
                            type="text"
                            value={transactionHash}
                            onChange={(event) => {
                              setTransactionHash(event.target.value);
                              setHashError("");
                            }}
                            placeholder="Paste transaction ID"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                          />

                          {hashError && (
                            <p className="mt-2 text-sm font-medium text-red-600">
                              {hashError}
                            </p>
                          )}

                          <button
                            type="button"
                            onClick={submitTransactionHash}
                            disabled={hashLoading}
                            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {hashLoading ? (
                              <>
                                <Loader2 size={18} className="animate-spin" />
                                Verifying transaction...
                              </>
                            ) : (
                              <>
                                Verify payment
                                <ArrowRight size={18} />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-6 border-t border-gray-200 pt-6">
                        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                          <div className="flex items-start gap-3">
                            <CheckCircle2
                              size={21}
                              className="mt-0.5 shrink-0 text-green-600"
                            />

                            <div>
                              <p className="font-semibold text-green-900">
                                Deposit verified successfully
                              </p>

                              <p className="mt-1 text-sm leading-5 text-green-800">
                                {verificationMessage}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Bottom action */}
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => router.push("/dashboard")}
                        className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
                      >
                        Back to dashboard
                      </button>

                      {!hashSubmitted && (
                        <button
                          type="button"
                          onClick={() => router.push("/deposit")}
                          className="flex-1 rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                        >
                          Create another deposit
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen overflow-hidden bg-gray-50">
      <div className="flex h-full flex-col">
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
              aria-label="Back to dashboard"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <p className="text-sm font-medium text-gray-500">Wallet</p>

              <h1 className="text-base font-semibold text-gray-900">Deposit</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <ShieldCheck size={18} className="text-green-600" />
            Secure deposit
          </div>
        </header>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto flex min-h-full w-full max-w-5xl items-center px-5 py-6 sm:px-8">
            <div className="w-full">
              {/* Page heading */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-500">Add funds</p>

                <h2 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                  Deposit cryptocurrency
                </h2>

                <p className="mt-2 max-w-2xl text-sm text-gray-600 sm:text-base">
                  Choose an asset, enter the amount, and send the cryptocurrency
                  to the deposit address provided.
                </p>
              </div>

              {/* Main layout */}
              <div className="grid gap-5 lg:grid-cols-[1fr_1.15fr]">
                {/* Left - Form */}
                <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                      <Wallet size={20} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Deposit details
                      </h3>

                      <p className="text-xs text-gray-500">
                        Enter the amount and choose your network.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-5">
                    {/* Amount */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-800">
                        Amount
                      </label>

                      <div className="relative">
                        <input
                          type="number"
                          min="0.000001"
                          step="any"
                          value={amount}
                          onChange={(event) => {
                            setAmount(event.target.value);
                            setError("");
                          }}
                          placeholder="0.012"
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-16 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                        />

                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500">
                          {selectedOption.asset}
                        </span>
                      </div>
                    </div>

                    {/* Asset */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-800">
                        Cryptocurrency
                      </label>

                      <select
                        value={`${selectedOption.asset}|${selectedOption.network}`}
                        onChange={(event) => {
                          const option = cryptoOptions.find(
                            (item) =>
                              `${item.asset}|${item.network}` ===
                              event.target.value,
                          );

                          if (option) {
                            setSelectedOption(option);
                            setError("");
                            setCopied(false);
                          }
                        }}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                      >
                        {cryptoOptions.map((option) => (
                          <option
                            key={`${option.asset}-${option.network}`}
                            value={`${option.asset}|${option.network}`}
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Network */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-800">
                        Network
                      </label>

                      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                        <span className="text-sm font-semibold text-gray-900">
                          {selectedOption.network}
                        </span>

                        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-600 shadow-sm">
                          Supported
                        </span>
                      </div>
                    </div>

                    {/* Error */}
                    {error && (
                      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                        <p className="text-sm font-medium text-red-700">
                          {error}
                        </p>
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="button"
                      onClick={submitDeposit}
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Creating request...
                        </>
                      ) : (
                        <>
                          Continue to deposit
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </div>
                </section>

                {/* Right - Address Preview */}
                <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Deposit destination
                    </p>

                    <h3 className="mt-1 text-xl font-bold text-gray-900">
                      {selectedOption.asset} address
                    </h3>

                    <p className="mt-1 text-sm text-gray-600">
                      This is where you will send your cryptocurrency after
                      creating the deposit request.
                    </p>
                  </div>

                  <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {selectedOption.network}
                      </span>

                      <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                        Active
                      </span>
                    </div>

                    <p className="mt-4 break-all font-mono text-xs leading-6 text-gray-700">
                      {selectedOption.address}
                    </p>

                    <button
                      type="button"
                      onClick={() => copyAddress(selectedOption.address)}
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 transition hover:bg-gray-100"
                    >
                      {copied ? (
                        <>
                          <CheckCircle2 size={16} className="text-green-600" />
                          Address copied
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          Copy address
                        </>
                      )}
                    </button>
                  </div>

                  {/* Warning */}
                  <div className="mt-5 rounded-xl border border-orange-200 bg-orange-50 p-4">
                    <p className="text-sm font-semibold text-orange-900">
                      Send only {selectedOption.asset}
                    </p>

                    <p className="mt-1 text-sm leading-5 text-orange-800">
                      Use the{" "}
                      <span className="font-semibold">
                        {selectedOption.network}
                      </span>{" "}
                      network only. Using another network or asset may result in
                      permanent loss of funds.
                    </p>
                  </div>

                  {/* How it works */}
                  <div className="mt-6">
                    <p className="text-sm font-semibold text-gray-900">
                      How it works
                    </p>

                    <div className="mt-3 space-y-3">
                      <div className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600">
                          1
                        </span>

                        <p className="text-sm text-gray-600">
                          Enter the amount and create your deposit request.
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600">
                          2
                        </span>

                        <p className="text-sm text-gray-600">
                          Send the selected cryptocurrency to the provided
                          address.
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600">
                          3
                        </span>

                        <p className="text-sm text-gray-600">
                          Submit your transaction ID for blockchain
                          verification.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Bottom note */}
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                <ShieldCheck
                  size={18}
                  className="mt-0.5 shrink-0 text-green-600"
                />

                <p className="text-xs leading-5 text-gray-600">
                  Your balance is not changed when a deposit request is created.
                  Funds are credited only after the blockchain transaction has
                  been verified successfully.
                </p>
              </div>

              <div className="h-6" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
