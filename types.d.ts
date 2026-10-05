declare interface FaqProps {
  id: number;
  question: string;
  answer: string;
}

declare interface TradingFeaturesProps {
  icon: string;
  title: string;
  description: string;
}

declare interface ForexMarketProps {
  value: string;
  label: string;
}

declare type ActiveView = "dashboard" | "admin";

declare type WithdrawalStatus =
  | "pending"
  | "processing"
  | "completed"
  | "rejected"
  | "cancelled";

declare type AdminWithdrawal = {
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
