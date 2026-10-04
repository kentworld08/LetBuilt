"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw } from "lucide-react";

type Withdrawal = {
  id: string;
  user_id: string;
  asset: string;
  network: string;
  amount: number;
  withdrawal_address: string;
  memo_tag: string | null;
  status: string;
  transaction_hash: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  processed_at: string | null;
  completed_at: string | null;
};

async function fetchAdminWithdrawals(): Promise<Withdrawal[]> {
  const response = await fetch("/api/admin/withdrawals", {
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("You must be logged in.");
    }

    if (response.status === 403) {
      throw new Error("You do not have admin access.");
    }

    throw new Error("Failed to load withdrawals.");
  }

  return response.json();
}

export default function AdminWithdrawalsPage() {
  const router = useRouter();

  const {
    data: withdrawals = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["admin-withdrawals"],
    queryFn: fetchAdminWithdrawals,
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  const formatAmount = (amount: number, asset: string) => {
    return `${Number(amount).toLocaleString(undefined, {
      maximumFractionDigits: 8,
    })} ${asset}`;
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400">Loading withdrawals...</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-screen bg-slate-950 text-white p-6">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="mb-8 flex items-center gap-2 text-slate-400 hover:text-white"
        >
          <ArrowLeft size={18} />
          Back to dashboard
        </button>

        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6">
          <h1 className="text-xl font-semibold text-red-400">
            Unable to load withdrawals
          </h1>

          <p className="mt-2 text-slate-400">
            {error instanceof Error ? error.message : "Something went wrong."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="mb-4 flex items-center gap-2 text-sm text-slate-400 hover:text-white"
            >
              <ArrowLeft size={17} />
              Back to dashboard
            </button>

            <h1 className="text-2xl font-bold">Withdrawal Management</h1>

            <p className="mt-1 text-sm text-slate-400">
              Review and manage customer withdrawal requests.
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
          >
            <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {withdrawals.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center">
            <p className="text-slate-400">No withdrawal requests yet.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left text-sm">
                <thead className="border-b border-slate-800 bg-slate-950">
                  <tr>
                    <th className="px-5 py-4 font-medium text-slate-400">
                      Date
                    </th>

                    <th className="px-5 py-4 font-medium text-slate-400">
                      Asset
                    </th>

                    <th className="px-5 py-4 font-medium text-slate-400">
                      Amount
                    </th>

                    <th className="px-5 py-4 font-medium text-slate-400">
                      Network
                    </th>

                    <th className="px-5 py-4 font-medium text-slate-400">
                      Wallet Address
                    </th>

                    <th className="px-5 py-4 font-medium text-slate-400">
                      Status
                    </th>

                    <th className="px-5 py-4 font-medium text-slate-400">
                      User ID
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {withdrawals.map((withdrawal) => (
                    <tr key={withdrawal.id} className="hover:bg-slate-800/50">
                      <td className="whitespace-nowrap px-5 py-4 text-slate-300">
                        {formatDate(withdrawal.created_at)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-medium text-white">
                          {withdrawal.asset}
                        </div>

                        {withdrawal.memo_tag && (
                          <div className="mt-1 text-xs text-slate-500">
                            Memo: {withdrawal.memo_tag}
                          </div>
                        )}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 font-medium text-white">
                        {formatAmount(withdrawal.amount, withdrawal.asset)}
                      </td>

                      <td className="px-5 py-4 text-slate-300">
                        {withdrawal.network}
                      </td>

                      <td className="max-w-[280px] px-5 py-4">
                        <p
                          className="truncate text-slate-300"
                          title={withdrawal.withdrawal_address}
                        >
                          {withdrawal.withdrawal_address}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            withdrawal.status === "pending"
                              ? "bg-yellow-500/10 text-yellow-400"
                              : withdrawal.status === "processing"
                                ? "bg-blue-500/10 text-blue-400"
                                : withdrawal.status === "completed"
                                  ? "bg-green-500/10 text-green-400"
                                  : withdrawal.status === "rejected"
                                    ? "bg-red-500/10 text-red-400"
                                    : "bg-slate-700 text-slate-300"
                          }`}
                        >
                          {withdrawal.status}
                        </span>
                      </td>

                      <td className="max-w-[220px] px-5 py-4">
                        <p
                          className="truncate text-xs text-slate-500"
                          title={withdrawal.user_id}
                        >
                          {withdrawal.user_id}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
