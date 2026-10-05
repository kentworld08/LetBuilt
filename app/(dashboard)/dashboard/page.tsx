"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { useProfile } from "@/app/hooks/use-profile";
import { useAccountBalance } from "@/app/hooks/use-account-balance";
import { useAssetBalances } from "@/app/hooks/use-asset-balances";
import { useTransactions } from "@/app/hooks/use-transactions";
import { useWithdrawals } from "@/app/hooks/use-withdrawals";
import { useBtcPrice } from "@/app/hooks/use-btc-price";

import {
  AlertCircle,
  ArrowDownToLine,
  ArrowUpFromLine,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleDollarSign,
  Clock3,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  Settings,
  ShieldCheck,
  Wallet,
  X,
  XCircle,
} from "lucide-react";

import { createClient } from "@/utils/supabase/client";
import Image from "next/image";

/* =========================================================
   TYPES
========================================================= */

type ActiveView = "dashboard" | "admin";

type WithdrawalStatus =
  | "pending"
  | "processing"
  | "completed"
  | "rejected"
  | "cancelled";

type AdminWithdrawal = {
  id: string;
  customer_name: string;
  asset: string;
  network: string;

  request_balance: number;
  current_balance: number;
  remaining_balance: number;

  withdrawal_address: string;
  memo_tag: string | null;

  status: WithdrawalStatus;

  transaction_hash: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  processed_at: string | null;
  completed_at: string | null;
};

/* =========================================================
   DASHBOARD
========================================================= */

const Dashboard = () => {
  const router = useRouter();

  const [activeView, setActiveView] = useState<ActiveView>("dashboard");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [withdrawalsExpanded, setWithdrawalsExpanded] = useState(false);

  const [transactionsExpanded, setTransactionsExpanded] = useState(false);

  const [completionWithdrawalId, setCompletionWithdrawalId] = useState<
    string | null
  >(null);

  const [transactionHash, setTransactionHash] = useState("");

  const [rejectionWithdrawalId, setRejectionWithdrawalId] = useState<
    string | null
  >(null);

  const [rejectionReason, setRejectionReason] = useState("");

  /* =========================================================
     USER DATA
  ========================================================= */

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

  const {
    data: withdrawals = [],
    isLoading: isWithdrawalsLoading,
    error: withdrawalsError,
  } = useWithdrawals();

  const { data: btcPriceData, isLoading: isBtcPriceLoading } = useBtcPrice();

  const btcPrice = btcPriceData?.bitcoin ?? 0;

  /* =========================================================
     ADMIN WITHDRAWALS
  ========================================================= */

  const {
    data: adminWithdrawals = [],
    isLoading: isAdminWithdrawalsLoading,
    isError: isAdminWithdrawalsError,
    refetch: refetchAdminWithdrawals,
  } = useQuery<AdminWithdrawal[]>({
    queryKey: ["admin-withdrawals"],
    queryFn: async () => {
      const response = await fetch("/api/admin/withdrawals");

      if (!response.ok) {
        throw new Error("Failed to load withdrawal requests");
      }

      return response.json();
    },
    enabled: profile?.role === "admin" && activeView === "admin",
  });

  /* =========================================================
     LOADING / ERROR
  ========================================================= */

  const loading =
    isProfileLoading ||
    isBalanceLoading ||
    isAssetsLoading ||
    isTransactionsLoading;

  /*
   * Withdrawal loading is intentionally NOT included here.
   *
   * A temporary withdrawal-query issue should not prevent
   * the rest of the dashboard from loading.
   */

  const error =
    profileError?.message ||
    balanceError?.message ||
    assetsError?.message ||
    transactionsError?.message ||
    "";

  /* =========================================================
     LOGOUT
  ========================================================= */

  async function logout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    router.push("/auth");
  }

  /* =========================================================
     VIEW SWITCHING
  ========================================================= */

  function openDashboard() {
    setActiveView("dashboard");
    setMobileMenuOpen(false);
  }

  function openAdmin() {
    if (profile?.role !== "admin") {
      return;
    }

    setActiveView("admin");
    setMobileMenuOpen(false);
  }

  /* =========================================================
     HELPERS
  ========================================================= */

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

  function formatCryptoBalance(value: number) {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    });
  }

  function formatTransactionAmount(value: number) {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    });
  }

  function getWithdrawalStatusClass(status: WithdrawalStatus) {
    switch (status) {
      case "pending":
        return "bg-yellow-50 text-yellow-700";

      case "processing":
        return "bg-blue-50 text-blue-700";

      case "completed":
        return "bg-green-50 text-green-700";

      case "rejected":
        return "bg-red-50 text-red-700";

      case "cancelled":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  /* =========================================================
     WITHDRAWAL ACTIONS
  ========================================================= */

  async function handleWithdrawalAction(
    withdrawalId: string,
    action: "approve" | "reject" | "complete",
    transactionHash?: string,
    adminNotes?: string,
  ) {
    try {
      const response = await fetch(`/api/admin/withdrawals/${withdrawalId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,

          ...(transactionHash
            ? {
                transaction_hash: transactionHash.trim(),
              }
            : {}),

          ...(adminNotes
            ? {
                admin_notes: adminNotes.trim(),
              }
            : {}),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update withdrawal");
      }

      if (action === "complete") {
        setCompletionWithdrawalId(null);
        setTransactionHash("");
      }

      if (action === "reject") {
        setRejectionWithdrawalId(null);
        setRejectionReason("");
      }

      await refetchAdminWithdrawals();
    } catch (error) {
      console.error("Withdrawal action error:", error);
    }
  }

  /* =========================================================
     LOADING
  ========================================================= */

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

  /* =========================================================
     ERROR
  ========================================================= */

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
        {/* =====================================================
            DESKTOP SIDEBAR
        ====================================================== */}

        <aside className="hidden h-full w-64 shrink-0 border-r border-gray-200 bg-white lg:flex lg:flex-col">
          <div className="flex h-20 items-center border-b border-gray-200 px-6">
            <div className="flex items-center gap-3">
              <Image
                src="/letbuilt.png"
                alt="LetBuilt Logo"
                width={21}
                height={21}
                className="h-9 w-9 rounded-lg"
              />

              <span className="text-xl font-bold text-gray-900">LetBuilt</span>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-4 py-6">
            <button
              type="button"
              onClick={openDashboard}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-semibold transition ${
                activeView === "dashboard"
                  ? "bg-orange-50 text-orange-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <LayoutDashboard size={19} />
              Dashboard
            </button>

            <button
              type="button"
              onClick={() => {
                openDashboard();

                setTimeout(() => {
                  document.getElementById("assets")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }, 0);
              }}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              <Wallet size={19} />
              Portfolio
            </button>

            <button
              type="button"
              onClick={() => router.push("/deposit")}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              <ArrowDownToLine size={19} />
              Deposit
            </button>

            <button
              type="button"
              onClick={() => router.push("/withdraw")}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              <ArrowUpFromLine size={19} />
              Withdraw
            </button>

            <button
              type="button"
              onClick={() => {
                openDashboard();
                setWithdrawalsExpanded(true);

                setTimeout(() => {
                  document.getElementById("withdrawals")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }, 0);
              }}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              <Clock3 size={19} />
              Withdrawals
            </button>

            <button
              type="button"
              onClick={() => {
                openDashboard();
                setTransactionsExpanded(true);

                setTimeout(() => {
                  document.getElementById("transactions")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }, 0);
              }}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              <History size={19} />
              Transactions
            </button>

            {profile?.role === "admin" && (
              <button
                type="button"
                onClick={openAdmin}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-semibold transition ${
                  activeView === "admin"
                    ? "bg-orange-50 text-orange-600"
                    : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                <ShieldCheck size={19} />
                Admin
              </button>
            )}
          </nav>

          <div className="border-t border-gray-200 p-4">
            <button
              type="button"
              className="mb-1 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100"
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

        {/* =====================================================
            MAIN APPLICATION
        ====================================================== */}

        <div className="flex min-w-0 flex-1 flex-col">
          {/* TOP BAR */}

          <header className="z-20 flex h-20 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-5 sm:px-8">
            <div className="flex items-center gap-3">
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
                  {activeView === "admin"
                    ? "Admin Management"
                    : "Account Overview"}
                </p>

                <p className="text-lg font-semibold text-gray-900">
                  {activeView === "admin" ? "Admin Management" : "Dashboard"}
                </p>
              </div>
            </div>

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

          {/* MOBILE MENU */}

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
                    onClick={openDashboard}
                    className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-semibold ${
                      activeView === "dashboard"
                        ? "bg-orange-50 text-orange-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <LayoutDashboard size={19} />
                    Dashboard
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      openDashboard();

                      setTimeout(() => {
                        document.getElementById("assets")?.scrollIntoView({
                          behavior: "smooth",
                        });
                      }, 0);
                    }}
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
                    onClick={() => {
                      setMobileMenuOpen(false);
                      router.push("/withdraw");
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    <ArrowUpFromLine size={19} />
                    Withdraw
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      openDashboard();
                      setWithdrawalsExpanded(true);

                      setTimeout(() => {
                        document.getElementById("withdrawals")?.scrollIntoView({
                          behavior: "smooth",
                        });
                      }, 0);
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    <Clock3 size={19} />
                    Withdrawals
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      openDashboard();
                      setTransactionsExpanded(true);

                      setTimeout(() => {
                        document
                          .getElementById("transactions")
                          ?.scrollIntoView({
                            behavior: "smooth",
                          });
                      }, 0);
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    <History size={19} />
                    Transactions
                  </button>

                  {profile?.role === "admin" && (
                    <button
                      type="button"
                      onClick={openAdmin}
                      className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-semibold ${
                        activeView === "admin"
                          ? "bg-orange-50 text-orange-600"
                          : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                      }`}
                    >
                      <ShieldCheck size={19} />
                      Admin
                    </button>
                  )}
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

          {/* =====================================================
              CONTENT
          ====================================================== */}

          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 sm:py-8">
              {/* =================================================
                  NORMAL DASHBOARD
              ================================================== */}

              {activeView === "dashboard" && (
                <>
                  {/* OVERVIEW */}

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

                  {/* BALANCE CARDS */}

                  <section className="mt-8 grid gap-5 md:grid-cols-2">
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
                          onClick={() => router.push("/withdraw")}
                          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
                        >
                          Withdraw
                        </button>
                      </div>
                    </div>

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
                        onClick={() =>
                          document.getElementById("assets")?.scrollIntoView({
                            behavior: "smooth",
                          })
                        }
                        className="mt-6 flex w-full items-center justify-between rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
                      >
                        View portfolio
                        <ChevronRight size={17} />
                      </button>
                    </div>
                  </section>

                  {/* ASSETS */}

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
                                      {(
                                        asset.balance * btcPrice
                                      ).toLocaleString("en-US", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      })}
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

                  {/* QUICK ACTIONS */}

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
                      onClick={() => router.push("/withdraw")}
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

                  {/* =================================================
                      WITHDRAWAL STATUS - COLLAPSIBLE
                  ================================================== */}

                  <section
                    id="withdrawals"
                    className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setWithdrawalsExpanded((previous) => !previous)
                      }
                      className="flex w-full items-center justify-between px-6 py-5 text-left transition hover:bg-gray-50"
                      aria-expanded={withdrawalsExpanded}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                          <ArrowUpFromLine size={20} />
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-lg font-semibold text-gray-900">
                              Withdrawal Requests
                            </h2>

                            {withdrawals.length > 0 && (
                              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                                {withdrawals.length}
                              </span>
                            )}
                          </div>

                          <p className="mt-1 text-sm text-gray-600">
                            Track the progress of your withdrawal requests.
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-gray-400">
                        {withdrawalsExpanded ? (
                          <ChevronUp size={21} />
                        ) : (
                          <ChevronDown size={21} />
                        )}
                      </div>
                    </button>

                    {withdrawalsExpanded && (
                      <div className="border-t border-gray-200">
                        {isWithdrawalsLoading ? (
                          <div className="px-6 py-10">
                            <div className="animate-pulse space-y-4">
                              <div className="h-5 w-40 rounded bg-gray-200" />
                              <div className="h-3 w-64 rounded bg-gray-200" />
                              <div className="h-2 w-full rounded bg-gray-200" />
                            </div>
                          </div>
                        ) : withdrawalsError ? (
                          <div className="px-6 py-10 text-center">
                            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-500">
                              <AlertCircle size={21} />
                            </div>

                            <p className="mt-3 font-medium text-gray-900">
                              Unable to load withdrawal requests
                            </p>

                            <p className="mt-1 text-sm text-gray-600">
                              Please refresh the page and try again.
                            </p>
                          </div>
                        ) : withdrawals.length === 0 ? (
                          <div className="px-6 py-12 text-center">
                            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                              <History size={21} />
                            </div>

                            <p className="mt-3 font-medium text-gray-900">
                              No withdrawal requests
                            </p>

                            <p className="mt-1 text-sm text-gray-600">
                              Your withdrawal requests will appear here after
                              you submit one.
                            </p>

                            <button
                              type="button"
                              onClick={() => router.push("/withdraw")}
                              className="mt-5 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
                            >
                              Make a withdrawal
                            </button>
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-200">
                            {withdrawals.slice(0, 5).map((withdrawal) => {
                              const isPending = withdrawal.status === "pending";

                              const isProcessing =
                                withdrawal.status === "processing";

                              const isCompleted =
                                withdrawal.status === "completed";

                              const isRejected =
                                withdrawal.status === "rejected";

                              const isCancelled =
                                withdrawal.status === "cancelled";

                              const steps = [
                                {
                                  label: "Submitted",
                                  completed: true,
                                },
                                {
                                  label: "Approved",
                                  completed: isProcessing || isCompleted,
                                },
                                {
                                  label: "Processing",
                                  completed: isProcessing || isCompleted,
                                },
                                {
                                  label: "Completed",
                                  completed: isCompleted,
                                },
                              ];

                              return (
                                <div key={withdrawal.id} className="px-6 py-6">
                                  {/* REQUEST HEADER */}

                                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                      <p className="text-lg font-semibold text-gray-900">
                                        {formatCryptoBalance(
                                          Number(withdrawal.amount),
                                        )}{" "}
                                        {withdrawal.asset}
                                      </p>

                                      <p className="mt-1 text-sm text-gray-500">
                                        {withdrawal.network}
                                      </p>

                                      <p className="mt-1 text-xs text-gray-400">
                                        Requested{" "}
                                        {new Date(
                                          withdrawal.created_at,
                                        ).toLocaleString()}
                                      </p>
                                    </div>

                                    <span
                                      className={`w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${getWithdrawalStatusClass(
                                        withdrawal.status,
                                      )}`}
                                    >
                                      {withdrawal.status}
                                    </span>
                                  </div>

                                  {/* REJECTED */}

                                  {isRejected && (
                                    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
                                      <div className="flex gap-3">
                                        <XCircle
                                          size={20}
                                          className="mt-0.5 shrink-0 text-red-500"
                                        />

                                        <div>
                                          <p className="font-semibold text-red-700">
                                            Withdrawal rejected
                                          </p>

                                          <p className="mt-1 text-sm leading-6 text-red-600">
                                            {withdrawal.admin_notes ||
                                              "Your withdrawal request was rejected. Please contact support for assistance."}
                                          </p>

                                          <button
                                            type="button"
                                            onClick={() =>
                                              router.push("/contact")
                                            }
                                            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
                                          >
                                            <MessageCircle size={15} />
                                            Contact Support
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* CANCELLED */}

                                  {isCancelled && (
                                    <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
                                      <div className="flex gap-3">
                                        <XCircle
                                          size={20}
                                          className="mt-0.5 shrink-0 text-gray-500"
                                        />

                                        <p className="text-sm text-gray-600">
                                          This withdrawal request was cancelled.
                                        </p>
                                      </div>
                                    </div>
                                  )}

                                  {/* NORMAL PROGRESS */}

                                  {!isRejected && !isCancelled && (
                                    <>
                                      <div className="mt-7 overflow-x-auto">
                                        <div className="flex min-w-[520px] items-start">
                                          {steps.map((step, index) => (
                                            <div
                                              key={step.label}
                                              className="flex flex-1 items-start"
                                            >
                                              <div className="flex flex-col items-center">
                                                <div
                                                  className={`flex h-9 w-9 items-center justify-center rounded-full border ${
                                                    step.completed
                                                      ? "border-green-500 bg-green-500 text-white"
                                                      : isPending && index === 1
                                                        ? "border-yellow-400 bg-yellow-50 text-yellow-600"
                                                        : isProcessing &&
                                                            index === 2
                                                          ? "border-blue-500 bg-blue-50 text-blue-600"
                                                          : "border-gray-200 bg-gray-50 text-gray-400"
                                                  }`}
                                                >
                                                  {step.completed ? (
                                                    <CheckCircle2 size={18} />
                                                  ) : isPending &&
                                                    index === 1 ? (
                                                    <Clock3 size={18} />
                                                  ) : isProcessing &&
                                                    index === 2 ? (
                                                    <Clock3 size={18} />
                                                  ) : (
                                                    index + 1
                                                  )}
                                                </div>

                                                <span
                                                  className={`mt-2 whitespace-nowrap text-xs ${
                                                    step.completed
                                                      ? "font-medium text-gray-700"
                                                      : "text-gray-400"
                                                  }`}
                                                >
                                                  {step.label}
                                                </span>
                                              </div>

                                              {index < steps.length - 1 && (
                                                <div
                                                  className={`mx-2 mt-4 h-px flex-1 ${
                                                    steps[index + 1].completed
                                                      ? "bg-green-500"
                                                      : "bg-gray-200"
                                                  }`}
                                                />
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      </div>

                                      {/* STATUS MESSAGE */}

                                      <div className="mt-5 rounded-xl bg-gray-50 px-4 py-3">
                                        <p className="text-sm text-gray-600">
                                          {isPending &&
                                            "Your withdrawal request has been submitted."}

                                          {isProcessing &&
                                            "Your withdrawal has been approved and is currently being processed."}

                                          {isCompleted &&
                                            "Your withdrawal has been completed successfully."}
                                        </p>
                                      </div>
                                    </>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </section>

                  {/* =================================================
                      TRANSACTIONS - COLLAPSIBLE
                  ================================================== */}

                  <section
                    id="transactions"
                    className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setTransactionsExpanded((previous) => !previous)
                      }
                      className="flex w-full items-center justify-between px-6 py-5 text-left transition hover:bg-gray-50"
                      aria-expanded={transactionsExpanded}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                          <History size={20} />
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-lg font-semibold text-gray-900">
                              Recent Transactions
                            </h2>

                            {transactions.length > 0 && (
                              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                                {transactions.length}
                              </span>
                            )}
                          </div>

                          <p className="mt-1 text-sm text-gray-600">
                            Your latest account activity.
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-gray-400">
                        {transactionsExpanded ? (
                          <ChevronUp size={21} />
                        ) : (
                          <ChevronDown size={21} />
                        )}
                      </div>
                    </button>

                    {transactionsExpanded && (
                      <div className="border-t border-gray-200">
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
                                      {transaction.description ||
                                        "Account transaction"}
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
                                    {transaction.type === "withdrawal"
                                      ? "-"
                                      : "+"}
                                    {formatTransactionAmount(
                                      transaction.amount,
                                    )}{" "}
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
                      </div>
                    )}
                  </section>
                </>
              )}

              {/* =================================================
                  ADMIN VIEW
              ================================================== */}

              {activeView === "admin" && profile?.role === "admin" && (
                <section className="min-h-full">
                  <div className="mt-8 rounded-2xl border border-gray-200 bg-white shadow-sm">
                    {/* ADMIN HEADER */}

                    <div className="flex flex-col gap-3 border-b border-gray-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          Withdrawal Requests
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                          Review and manage customer withdrawal requests.
                        </p>
                      </div>

                      <div className="w-fit rounded-full bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-700">
                        {adminWithdrawals.length}{" "}
                        {adminWithdrawals.length === 1 ? "Request" : "Requests"}
                      </div>
                    </div>

                    <div className="p-5">
                      {/* ERROR */}

                      {isAdminWithdrawalsError ? (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-6 text-center">
                          <p className="font-medium text-red-700">
                            Failed to load withdrawal requests.
                          </p>

                          <button
                            type="button"
                            onClick={() => refetchAdminWithdrawals()}
                            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                          >
                            Try again
                          </button>
                        </div>
                      ) : isAdminWithdrawalsLoading ? (
                        <div className="flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50 py-14">
                          <div className="text-center">
                            <div className="mx-auto h-7 w-7 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />

                            <p className="mt-3 text-sm text-gray-600">
                              Loading withdrawal requests...
                            </p>
                          </div>
                        </div>
                      ) : adminWithdrawals.length === 0 ? (
                        <div className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-14 text-center">
                          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm">
                            <History size={20} />
                          </div>

                          <p className="mt-3 font-semibold text-gray-900">
                            No withdrawal requests
                          </p>

                          <p className="mt-1 text-sm text-gray-600">
                            Customer withdrawal requests will appear here.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {adminWithdrawals.map((withdrawal) => (
                            <div
                              key={withdrawal.id}
                              className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                            >
                              {/* CUSTOMER + STATUS */}

                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="truncate font-semibold text-gray-900">
                                    {withdrawal.customer_name}
                                  </p>

                                  <p className="mt-0.5 text-xs text-gray-500">
                                    Withdrawal request
                                  </p>
                                </div>

                                <span
                                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${getWithdrawalStatusClass(
                                    withdrawal.status,
                                  )}`}
                                >
                                  {withdrawal.status}
                                </span>
                              </div>

                              {/* BALANCE SUMMARY */}

                              <div className="mt-3 grid grid-cols-3 gap-2">
                                <div className="rounded-lg border border-gray-200 bg-white px-3 py-2.5">
                                  <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                                    Current
                                  </p>

                                  <p className="mt-0.5 truncate text-sm font-bold text-gray-900">
                                    {formatCryptoBalance(
                                      withdrawal.current_balance,
                                    )}{" "}
                                    {withdrawal.asset}
                                  </p>
                                </div>

                                <div className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-2.5">
                                  <p className="text-[10px] font-medium uppercase tracking-wide text-orange-500">
                                    Request
                                  </p>

                                  <p className="mt-0.5 truncate text-sm font-bold text-orange-600">
                                    {formatCryptoBalance(
                                      withdrawal.request_balance,
                                    )}{" "}
                                    {withdrawal.asset}
                                  </p>
                                </div>

                                <div className="rounded-lg border border-gray-200 bg-white px-3 py-2.5">
                                  <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                                    Remaining
                                  </p>

                                  <p
                                    className={`mt-0.5 truncate text-sm font-bold ${
                                      withdrawal.remaining_balance < 0
                                        ? "text-red-600"
                                        : "text-gray-900"
                                    }`}
                                  >
                                    {formatCryptoBalance(
                                      withdrawal.remaining_balance,
                                    )}{" "}
                                    {withdrawal.asset}
                                  </p>
                                </div>
                              </div>

                              {/* NETWORK + DATE */}

                              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-gray-500">
                                <span>
                                  <span className="text-gray-400">
                                    Network:
                                  </span>{" "}
                                  <span className="font-semibold text-gray-700">
                                    {withdrawal.network}
                                  </span>
                                </span>

                                <span>
                                  <span className="text-gray-400">
                                    Requested:
                                  </span>{" "}
                                  <span className="font-semibold text-gray-700">
                                    {new Date(
                                      withdrawal.created_at,
                                    ).toLocaleString()}
                                  </span>
                                </span>
                              </div>

                              {/* ADDRESS */}

                              <div className="mt-3">
                                <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                                  Withdrawal Address
                                </p>

                                <p className="mt-1 break-all rounded-lg border border-gray-200 bg-white px-3 py-2 font-mono text-[11px] leading-relaxed text-gray-700">
                                  {withdrawal.withdrawal_address}
                                </p>
                              </div>

                              {/* MEMO */}

                              {withdrawal.memo_tag && (
                                <div className="mt-2 text-xs text-gray-600">
                                  <span className="font-medium text-gray-400">
                                    Memo / Tag:
                                  </span>{" "}
                                  {withdrawal.memo_tag}
                                </div>
                              )}

                              {/* TRANSACTION ID */}

                              {withdrawal.transaction_hash && (
                                <div className="mt-2">
                                  <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                                    Transaction ID
                                  </p>

                                  <p className="mt-1 break-all font-mono text-[11px] text-gray-700">
                                    {withdrawal.transaction_hash}
                                  </p>
                                </div>
                              )}

                              {/* ACTIONS */}

                              {withdrawal.status === "pending" && (
                                <div className="mt-4 border-t border-gray-200 pt-3">
                                  {rejectionWithdrawalId === withdrawal.id ? (
                                    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                                      <p className="text-sm font-semibold text-red-700">
                                        Reject withdrawal
                                      </p>

                                      <p className="mt-1 text-xs text-red-600">
                                        Please provide a reason for rejecting
                                        this withdrawal request.
                                      </p>

                                      <textarea
                                        value={rejectionReason}
                                        onChange={(event) =>
                                          setRejectionReason(event.target.value)
                                        }
                                        placeholder="Enter rejection reason..."
                                        rows={3}
                                        className="mt-3 w-full rounded-lg border border-red-200 bg-white px-3 py-2.5 text-xs text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                      />

                                      <div className="mt-3 flex justify-end gap-2">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setRejectionWithdrawalId(null);
                                            setRejectionReason("");
                                          }}
                                          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
                                        >
                                          Cancel
                                        </button>

                                        <button
                                          type="button"
                                          disabled={!rejectionReason.trim()}
                                          onClick={() =>
                                            handleWithdrawalAction(
                                              withdrawal.id,
                                              "reject",
                                              undefined,
                                              rejectionReason,
                                            )
                                          }
                                          className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                          Confirm Rejection
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex justify-end gap-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setRejectionWithdrawalId(
                                            withdrawal.id,
                                          );
                                          setRejectionReason("");
                                        }}
                                        className="rounded-lg border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                                      >
                                        Reject
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleWithdrawalAction(
                                            withdrawal.id,
                                            "approve",
                                          )
                                        }
                                        className="rounded-lg bg-orange-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-orange-600"
                                      >
                                        Approve
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* PROCESSING */}

                              {withdrawal.status === "processing" && (
                                <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50 px-3 py-3">
                                  {completionWithdrawalId === withdrawal.id ? (
                                    <div className="space-y-3">
                                      <div>
                                        <p className="text-xs font-semibold text-blue-700">
                                          Enter transaction ID
                                        </p>

                                        <p className="mt-1 text-[11px] text-blue-600">
                                          Enter the blockchain transaction
                                          ID/hash after the withdrawal has been
                                          sent.
                                        </p>
                                      </div>

                                      <input
                                        type="text"
                                        value={transactionHash}
                                        onChange={(event) =>
                                          setTransactionHash(event.target.value)
                                        }
                                        placeholder="Enter transaction ID / hash"
                                        className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2.5 text-xs text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                      />

                                      <div className="flex justify-end gap-2">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setCompletionWithdrawalId(null);
                                            setTransactionHash("");
                                          }}
                                          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
                                        >
                                          Cancel
                                        </button>

                                        <button
                                          type="button"
                                          disabled={!transactionHash.trim()}
                                          onClick={() =>
                                            handleWithdrawalAction(
                                              withdrawal.id,
                                              "complete",
                                              transactionHash,
                                            )
                                          }
                                          className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                          Confirm Completion
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                      <p className="text-xs font-medium text-blue-700">
                                        Approved and waiting for completion.
                                      </p>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          setCompletionWithdrawalId(
                                            withdrawal.id,
                                          );
                                          setTransactionHash("");
                                        }}
                                        className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                                      >
                                        Complete
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* COMPLETED */}

                              {withdrawal.status === "completed" && (
                                <div className="mt-3 rounded-lg border border-green-100 bg-green-50 px-3 py-2.5">
                                  <p className="text-xs font-medium text-green-700">
                                    Withdrawal completed successfully.
                                  </p>
                                </div>
                              )}

                              {/* REJECTED */}

                              {withdrawal.status === "rejected" && (
                                <div className="mt-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2.5">
                                  <p className="text-xs font-medium text-red-700">
                                    This withdrawal was rejected.
                                  </p>

                                  {withdrawal.admin_notes && (
                                    <p className="mt-1 text-xs text-red-600">
                                      Note: {withdrawal.admin_notes}
                                    </p>
                                  )}
                                </div>
                              )}

                              {/* CANCELLED */}

                              {withdrawal.status === "cancelled" && (
                                <div className="mt-3 rounded-lg border border-gray-200 bg-gray-100 px-3 py-2.5">
                                  <p className="text-xs font-medium text-gray-700">
                                    This withdrawal was cancelled.
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              )}

              <div className="h-8" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
