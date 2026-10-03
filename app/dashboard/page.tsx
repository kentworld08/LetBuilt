"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/app/hooks/use-profile";
import { useAccountBalance } from "../hooks/use-account-balance";
import { useAssetBalances } from "../hooks/use-asset-balances";
import { useTransactions } from "../hooks/use-transactions";

import {
  ArrowDownToLine,
  ArrowUpFromLine,
  BarChart3,
  ChevronRight,
  CircleDollarSign,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Wallet,
  X,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useBtcPrice } from "../hooks/use-btc-price";

const Dashboard = () => {
  const router = useRouter();

  const { data: btcPriceData, isLoading: isBtcPriceLoading } = useBtcPrice();

  const btcPrice = btcPriceData?.bitcoin ?? 0;

  const {
    data: profile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useProfile();

  const {
    data: balance = 0,
    isLoading: isBalanceLoading,
    error: balanceError,
  } = useAccountBalance();

  const {
    data: assetBalances = [],
    isLoading: isAssetsLoading,
    error: assetsError,
  } = useAssetBalances();

  const {
    data: transactions = [],
    isLoading: isTransactionsLoading,
    error: transactionsError,
  } = useTransactions();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const loading =
    isProfileLoading ||
    isBalanceLoading ||
    isAssetsLoading ||
    isTransactionsLoading;

  const error =
    profileError?.message ||
    balanceError?.message ||
    assetsError?.message ||
    transactionsError?.message ||
    "";

  async function logout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    router.push("/auth");
  }

  function scrollToSection(id: string) {
    setMobileMenuOpen(false);

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  }

  function getInitials() {
    if (profile?.full_name) {
      return profile.full_name
        .split(" ")
        .map((name) => name[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    }

    if (profile?.username) {
      return profile.username.slice(0, 2).toUpperCase();
    }

    return "U";
  }

  function formatCryptoBalance(balance: number) {
    return balance.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    });
  }

  function formatTransactionAmount(amount: number) {
    return amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    });
  }

  if (loading) {
    return (
      <main className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />

          <p className="mt-4 text-sm font-medium text-gray-700">
            Loading dashboard...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex h-screen items-center justify-center bg-gray-50 px-6">
        <div className="rounded-xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <p className="font-medium text-red-600">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen overflow-hidden bg-gray-50 text-gray-900">
      <div className="flex h-full">
        {/* Desktop Sidebar */}
        <aside className="hidden h-full w-64 shrink-0 border-r border-gray-200 bg-white lg:flex lg:flex-col">
          {/* Logo */}
          <div className="flex h-20 items-center border-b border-gray-200 px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500 text-white">
                <CircleDollarSign size={21} />
              </div>

              <span className="text-xl font-bold text-gray-900">LetBuilt</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-6">
            <button
              type="button"
              onClick={() => scrollToSection("overview")}
              className="flex w-full items-center gap-3 rounded-lg bg-orange-50 px-4 py-3 text-left text-sm font-semibold text-orange-600"
            >
              <LayoutDashboard size={19} />
              Dashboard
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("assets")}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
            >
              <Wallet size={19} />
              Portfolio
            </button>

            <button
              type="button"
              onClick={() => router.push("/deposit")}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
            >
              <ArrowDownToLine size={19} />
              Deposit
            </button>

            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
            >
              <ArrowUpFromLine size={19} />
              Withdraw
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("transactions")}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
            >
              <History size={19} />
              Transactions
            </button>
          </nav>

          {/* Bottom Navigation */}
          <div className="border-t border-gray-200 p-4">
            <button
              type="button"
              className="mb-1 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
            >
              <Settings size={19} />
              Settings
            </button>

            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              <LogOut size={19} />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Application Area */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top Bar */}
          <header className="z-20 flex h-20 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-5 sm:px-8">
            <div className="flex items-center gap-3">
              {/* Mobile Menu */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="rounded-lg p-2 text-gray-700 transition hover:bg-gray-100 lg:hidden"
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>

              <div className="lg:hidden">
                <p className="text-lg font-bold text-gray-900">LetBuilt</p>
              </div>

              <div className="hidden lg:block">
                <p className="text-sm font-medium text-gray-500">
                  Account Overview
                </p>

                <p className="text-lg font-semibold text-gray-900">Dashboard</p>
              </div>
            </div>

            {/* Profile */}
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-gray-900">
                  {profile?.full_name || profile?.username || "User"}
                </p>

                <p className="text-xs text-gray-500">
                  {profile?.username
                    ? `@${profile.username}`
                    : "Personal account"}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">
                {getInitials()}
              </div>
            </div>
          </header>

          {/* Mobile Sidebar */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setMobileMenuOpen(false)}
              />

              <aside className="relative flex h-full w-72 flex-col bg-white shadow-xl">
                <div className="flex h-20 items-center justify-between border-b border-gray-200 px-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500 text-white">
                      <CircleDollarSign size={21} />
                    </div>

                    <span className="text-xl font-bold text-gray-900">
                      LetBuilt
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                    aria-label="Close menu"
                  >
                    <X size={20} />
                  </button>
                </div>

                <nav className="flex-1 space-y-1 px-4 py-6">
                  <button
                    type="button"
                    onClick={() => scrollToSection("overview")}
                    className="flex w-full items-center gap-3 rounded-lg bg-orange-50 px-4 py-3 text-left text-sm font-semibold text-orange-600"
                  >
                    <LayoutDashboard size={19} />
                    Dashboard
                  </button>

                  <button
                    type="button"
                    onClick={() => scrollToSection("assets")}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    <Wallet size={19} />
                    Portfolio
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      router.push("/deposit");
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    <ArrowDownToLine size={19} />
                    Deposit
                  </button>

                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    <ArrowUpFromLine size={19} />
                    Withdraw
                  </button>

                  <button
                    type="button"
                    onClick={() => scrollToSection("transactions")}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    <History size={19} />
                    Transactions
                  </button>
                </nav>

                <div className="border-t border-gray-200 p-4">
                  <button
                    type="button"
                    onClick={logout}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={19} />
                    Logout
                  </button>
                </div>
              </aside>
            </div>
          )}

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 sm:py-8">
              {/* Overview */}
              <section id="overview">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Overview
                    </p>

                    <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                      Welcome back
                      {profile?.full_name
                        ? `, ${profile.full_name.split(" ")[0]}`
                        : ""}
                    </h1>

                    <p className="mt-2 text-sm text-gray-600 sm:text-base">
                      Here&apos;s what&apos;s happening with your account.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => router.push("/deposit")}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
                  >
                    <ArrowDownToLine size={18} />
                    Deposit funds
                  </button>
                </div>
              </section>

              {/* Balance Cards */}
              <section className="mt-8 grid gap-5 md:grid-cols-2">
                {/* Account Balance */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Account Balance
                      </p>

                      <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        $
                        {balance.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>

                      <p className="mt-2 text-sm text-gray-500">
                        Available account funds
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                      <CircleDollarSign size={23} />
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={() => router.push("/deposit")}
                      className="flex-1 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
                    >
                      Deposit
                    </button>

                    <button
                      type="button"
                      className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
                    >
                      Withdraw
                    </button>
                  </div>
                </div>

                {/* Crypto Summary */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Crypto Assets
                      </p>

                      <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
                        {assetBalances.length}
                      </p>

                      <p className="mt-2 text-sm text-gray-500">
                        {assetBalances.length === 1
                          ? "Asset currently held"
                          : "Assets currently held"}
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Wallet size={23} />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => scrollToSection("assets")}
                    className="mt-6 flex w-full items-center justify-between rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
                  >
                    View portfolio
                    <ChevronRight size={17} />
                  </button>
                </div>
              </section>

              {/* Assets */}
              <section
                id="assets"
                className="mt-8 rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Your Crypto Assets
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                      Your current cryptocurrency balances.
                    </p>
                  </div>

                  <Wallet className="text-gray-400" size={21} />
                </div>

                {assetBalances.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                      <Wallet size={22} />
                    </div>

                    <p className="mt-4 font-medium text-gray-900">
                      No crypto assets yet
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      Your cryptocurrency balances will appear here after a
                      successful deposit.
                    </p>

                    <button
                      type="button"
                      onClick={() => router.push("/deposit")}
                      className="mt-5 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
                    >
                      Make a deposit
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
                    {assetBalances.map((asset) => (
                      <div
                        key={asset.id}
                        className="rounded-xl border border-gray-200 bg-gray-50 p-5 transition hover:border-gray-300 hover:bg-white"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">
                              {asset.asset.slice(0, 1)}
                            </div>

                            <div>
                              <p className="font-semibold text-gray-900">
                                {asset.asset}
                              </p>

                              <p className="text-xs text-gray-500">
                                Cryptocurrency
                              </p>
                            </div>
                          </div>

                          <BarChart3 size={18} className="text-gray-400" />
                        </div>

                        <p className="mt-6 text-2xl font-bold text-gray-900">
                          {formatCryptoBalance(asset.balance)}
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-600">
                          {asset.asset}
                        </p>

                        {/* BTC USD Value */}
                        {asset.asset.toUpperCase() === "BTC" && (
                          <div className="mt-4 border-t border-gray-200 pt-3">
                            <p className="text-xs font-medium text-gray-500">
                              Current value
                            </p>

                            <p className="mt-1 text-lg font-semibold text-gray-900">
                              {isBtcPriceLoading ? (
                                "Loading..."
                              ) : btcPrice > 0 ? (
                                <>
                                  $
                                  {(asset.balance * btcPrice).toLocaleString(
                                    "en-US",
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    },
                                  )}
                                </>
                              ) : (
                                "Price unavailable"
                              )}
                            </p>

                            {!isBtcPriceLoading && btcPrice > 0 && (
                              <p className="mt-1 text-xs text-gray-500">
                                BTC price: $
                                {btcPrice.toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Quick Actions */}
              <section className="mt-8 grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => router.push("/deposit")}
                  className="group flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:border-orange-300 hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                      <ArrowDownToLine size={21} />
                    </div>

                    <div>
                      <p className="font-semibold text-gray-900">
                        Deposit crypto
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        Add funds to your account
                      </p>
                    </div>
                  </div>

                  <ChevronRight
                    size={19}
                    className="text-gray-400 transition group-hover:translate-x-1"
                  />
                </button>

                <button
                  type="button"
                  className="group flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:border-gray-300 hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                      <ArrowUpFromLine size={21} />
                    </div>

                    <div>
                      <p className="font-semibold text-gray-900">
                        Withdraw funds
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        Send funds from your account
                      </p>
                    </div>
                  </div>

                  <ChevronRight
                    size={19}
                    className="text-gray-400 transition group-hover:translate-x-1"
                  />
                </button>
              </section>

              {/* Transactions */}
              <section
                id="transactions"
                className="mt-8 rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Recent Transactions
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                      Your latest account activity.
                    </p>
                  </div>

                  <History className="text-gray-400" size={21} />
                </div>

                {transactions.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                      <History size={22} />
                    </div>

                    <p className="mt-4 font-medium text-gray-900">
                      No transactions yet
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      Your account activity will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between gap-4 px-6 py-5"
                      >
                        <div className="flex min-w-0 items-center gap-4">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                              transaction.type === "withdrawal"
                                ? "bg-red-50 text-red-600"
                                : "bg-green-50 text-green-600"
                            }`}
                          >
                            {transaction.type === "withdrawal" ? (
                              <ArrowUpFromLine size={18} />
                            ) : (
                              <ArrowDownToLine size={18} />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-semibold capitalize text-gray-900">
                              {transaction.type}
                            </p>

                            <p className="mt-1 truncate text-sm text-gray-600">
                              {transaction.description || "Account transaction"}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {new Date(
                                transaction.created_at,
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <p
                            className={`font-semibold ${
                              transaction.type === "withdrawal"
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {transaction.type === "withdrawal" ? "-" : "+"}
                            {formatTransactionAmount(transaction.amount)}{" "}
                            {transaction.currency}
                          </p>

                          <span
                            className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                              transaction.status === "completed"
                                ? "bg-green-50 text-green-700"
                                : transaction.status === "pending"
                                  ? "bg-yellow-50 text-yellow-700"
                                  : transaction.status === "failed"
                                    ? "bg-red-50 text-red-700"
                                    : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Bottom spacing */}
              <div className="h-8" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
