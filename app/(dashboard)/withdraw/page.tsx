"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Loader2,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useAssetBalances } from "@/app/hooks/use-asset-balances";

type CryptoOption = {
  asset: "BTC" | "USDT";
  network: "Bitcoin" | "Ethereum (ERC-20)" | "Tron (TRC-20)";
  label: string;
};

const cryptoOptions: CryptoOption[] = [
  {
    asset: "BTC",
    network: "Bitcoin",
    label: "BTC — Bitcoin",
  },
  {
    asset: "USDT",
    network: "Ethereum (ERC-20)",
    label: "USDT — Ethereum (ERC-20)",
  },
  {
    asset: "USDT",
    network: "Tron (TRC-20)",
    label: "USDT — Tron (TRC-20)",
  },
];

export default function WithdrawPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: assetBalances = [], isLoading: balancesLoading } =
    useAssetBalances();

  const [amount, setAmount] = useState("");
  const [selectedOption, setSelectedOption] = useState(cryptoOptions[0]);
  const [withdrawalAddress, setWithdrawalAddress] = useState("");
  const [memoTag, setMemoTag] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [success, setSuccess] = useState<{
    id: string;
    amount: number;
    asset: string;
    network: string;
    address: string;
    status: string;
  } | null>(null);

  /*
   * Total balance and reserved balance are stored separately.
   *
   * Example:
   * balance = 1 BTC
   * reserved_balance = 0.3 BTC
   * available_balance = 0.7 BTC
   *
   * Withdrawals should only use available_balance.
   */
  const selectedAsset = assetBalances.find(
    (item) => item.asset === selectedOption.asset,
  );

  const availableBalance = selectedAsset?.available_balance ?? 0;

  function formatBalance(value: number) {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 8,
    });
  }

  function handleAssetChange(value: string) {
    const option = cryptoOptions.find(
      (item) => `${item.asset}|${item.network}` === value,
    );

    if (option) {
      setSelectedOption(option);
      setAmount("");
      setWithdrawalAddress("");
      setMemoTag("");
      setError("");
    }
  }

  function setMaxAmount() {
    if (availableBalance > 0) {
      setAmount(String(availableBalance));
      setError("");
    }
  }

  async function submitWithdrawal() {
    setError("");

    const numericAmount = Number(amount);
    const trimmedAddress = withdrawalAddress.trim();

    if (!amount || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid withdrawal amount.");
      return;
    }

    if (numericAmount > availableBalance) {
      setError(
        `Insufficient available balance. You can withdraw up to ${formatBalance(
          availableBalance,
        )} ${selectedOption.asset}.`,
      );
      return;
    }

    if (!trimmedAddress) {
      setError("Please enter your withdrawal wallet address.");
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

    const { data, error: withdrawalError } = await supabase.rpc(
      "create_withdrawal_request",
      {
        p_asset: selectedOption.asset,
        p_network: selectedOption.network,
        p_amount: numericAmount,
        p_withdrawal_address: trimmedAddress,
        p_memo_tag: memoTag.trim() || null,
      },
    );

    setLoading(false);

    if (withdrawalError) {
      setError(
        withdrawalError.message ||
          "We could not create your withdrawal request.",
      );
      return;
    }

    if (!data) {
      setError("We could not create your withdrawal request.");
      return;
    }

    setSuccess({
      id: data.id,
      amount: Number(data.amount),
      asset: data.asset,
      network: data.network,
      address: data.withdrawal_address,
      status: data.status,
    });

    await queryClient.invalidateQueries({
      queryKey: ["asset-balances"],
    });
  }

  if (balancesLoading) {
    return (
      <main className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
          <Loader2 size={18} className="animate-spin" />
          Loading your balances...
        </div>
      </main>
    );
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
                  Withdraw
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <ShieldCheck size={18} className="text-green-600" />
              Secure withdrawal
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
                    Withdrawal request submitted
                  </h2>

                  <p className="mx-auto mt-2 max-w-xl text-sm text-gray-600">
                    Your request has been received and is now waiting for
                    review. We&apos;ll notify you when there is an update.
                  </p>
                </div>

                {/* Main card */}
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                  {/* Summary */}
                  <div className="grid gap-4 border-b border-gray-200 p-5 sm:grid-cols-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Amount
                      </p>

                      <p className="mt-1 text-lg font-bold text-gray-900">
                        {success.amount.toLocaleString("en-US", {
                          minimumFractionDigits: 0,
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

                      <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-semibold text-yellow-700">
                        <Clock3 size={13} />
                        Pending review
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    {/* Wallet address */}
                    <div>
                      <p className="font-semibold text-gray-900">
                        Withdrawal address
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Funds will be sent to this address after your request is
                        approved and processed.
                      </p>
                    </div>

                    <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                      <p className="break-all font-mono text-xs leading-6 text-gray-700">
                        {success.address}
                      </p>
                    </div>

                    {/* Processing information */}
                    <div className="mt-5 rounded-xl border border-orange-200 bg-orange-50 p-4">
                      <div className="flex items-start gap-3">
                        <Clock3
                          size={20}
                          className="mt-0.5 shrink-0 text-orange-600"
                        />

                        <div>
                          <p className="text-sm font-semibold text-orange-900">
                            Withdrawal processing
                          </p>

                          <p className="mt-1 text-sm leading-5 text-orange-800">
                            Your request is pending review. Processing time
                            depends on the review and payout process.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Security note */}
                    <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
                      <div className="flex items-start gap-3">
                        <ShieldCheck
                          size={19}
                          className="mt-0.5 shrink-0 text-green-600"
                        />

                        <p className="text-sm leading-5 text-gray-600">
                          Your requested amount has been reserved from your
                          available balance while this withdrawal is being
                          processed.
                        </p>
                      </div>
                    </div>

                    {/* Bottom actions */}
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => router.push("/dashboard")}
                        className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
                      >
                        Back to dashboard
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSuccess(null);
                          setAmount("");
                          setWithdrawalAddress("");
                          setMemoTag("");
                          setError("");
                        }}
                        className="flex-1 rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                      >
                        Create another withdrawal
                      </button>
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

              <h1 className="text-base font-semibold text-gray-900">
                Withdraw
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <ShieldCheck size={18} className="text-green-600" />
            Secure withdrawal
          </div>
        </header>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto flex min-h-full w-full max-w-5xl items-center px-5 py-6 sm:px-8">
            <div className="w-full">
              {/* Page heading */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-500">Send funds</p>

                <h2 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                  Withdraw cryptocurrency
                </h2>

                <p className="mt-2 max-w-2xl text-sm text-gray-600 sm:text-base">
                  Choose an asset, enter the amount and provide the wallet
                  address where you want to receive your funds.
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
                        Withdrawal details
                      </h3>

                      <p className="text-xs text-gray-500">
                        Enter where and how much you want to withdraw.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-5">
                    {/* Cryptocurrency */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-800">
                        Cryptocurrency
                      </label>

                      <select
                        value={`${selectedOption.asset}|${selectedOption.network}`}
                        onChange={(event) =>
                          handleAssetChange(event.target.value)
                        }
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

                    {/* Available balance */}
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm text-gray-600">
                          Available balance
                        </span>

                        <span className="text-sm font-bold text-gray-900">
                          {formatBalance(availableBalance)}{" "}
                          {selectedOption.asset}
                        </span>
                      </div>
                    </div>

                    {/* Amount */}
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <label className="block text-sm font-semibold text-gray-800">
                          Amount
                        </label>

                        <button
                          type="button"
                          onClick={setMaxAmount}
                          disabled={availableBalance <= 0}
                          className="text-xs font-semibold text-orange-600 transition hover:text-orange-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Max
                        </button>
                      </div>

                      <div className="relative">
                        <input
                          type="number"
                          min="0"
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

                    {/* Wallet address */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-800">
                        Withdrawal wallet address
                      </label>

                      <input
                        type="text"
                        value={withdrawalAddress}
                        onChange={(event) => {
                          setWithdrawalAddress(event.target.value);
                          setError("");
                        }}
                        placeholder="Paste wallet address"
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono text-sm text-gray-900 outline-none transition placeholder:font-sans placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                      />

                      <p className="mt-2 text-xs leading-5 text-gray-500">
                        Make sure this address supports the{" "}
                        <span className="font-semibold">
                          {selectedOption.network}
                        </span>{" "}
                        network.
                      </p>
                    </div>

                    {/* Memo / Tag */}
                    {(selectedOption.asset === "USDT" ||
                      selectedOption.network !== "Bitcoin") && (
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-800">
                          Memo / Tag{" "}
                          <span className="font-normal text-gray-400">
                            (if required)
                          </span>
                        </label>

                        <input
                          type="text"
                          value={memoTag}
                          onChange={(event) => {
                            setMemoTag(event.target.value);
                            setError("");
                          }}
                          placeholder="Enter memo or tag if your wallet requires one"
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                        />
                      </div>
                    )}

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
                      onClick={submitWithdrawal}
                      disabled={loading || availableBalance <= 0}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Submitting request...
                        </>
                      ) : (
                        <>
                          Submit withdrawal request
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </div>
                </section>

                {/* Right - Information */}
                <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Withdrawal destination
                    </p>

                    <h3 className="mt-1 text-xl font-bold text-gray-900">
                      {selectedOption.asset} withdrawal
                    </h3>

                    <p className="mt-1 text-sm text-gray-600">
                      Your request will be reviewed before the funds are sent to
                      your wallet.
                    </p>
                  </div>

                  {/* Network */}
                  <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Network
                      </span>

                      <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                        Supported
                      </span>
                    </div>

                    <p className="mt-3 text-sm font-bold text-gray-900">
                      {selectedOption.network}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Only provide a wallet address compatible with this
                      network.
                    </p>
                  </div>

                  {/* Warning */}
                  <div className="mt-5 rounded-xl border border-orange-200 bg-orange-50 p-4">
                    <p className="text-sm font-semibold text-orange-900">
                      Check your wallet address
                    </p>

                    <p className="mt-1 text-sm leading-5 text-orange-800">
                      Cryptocurrency transactions cannot normally be reversed.
                      Make sure the wallet address and network are correct
                      before submitting your request.
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
                          Enter the amount and destination wallet address.
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600">
                          2
                        </span>

                        <p className="text-sm text-gray-600">
                          Your request is reviewed by the administrator.
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600">
                          3
                        </span>

                        <p className="text-sm text-gray-600">
                          After approval, your cryptocurrency is processed and
                          sent to the provided address.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Processing note */}
                  <div className="mt-6 flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4">
                    <Clock3
                      size={18}
                      className="mt-0.5 shrink-0 text-orange-500"
                    />

                    <p className="text-xs leading-5 text-gray-600">
                      Withdrawal requests remain pending until reviewed.
                      Processing time depends on the review and payout process.
                    </p>
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
                  Your requested amount is reserved when the withdrawal request
                  is created. If the request is rejected, the reserved amount is
                  released back to your available balance.
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
