import { Property } from "./property.types";
import { User } from "./user.types";

export interface Transaction {
  id: number,
  property: Property | null,
  transaction_id: string,
  type: number,
  payment_type: number,
  payment_method: string,
  initial_amount_paid: number,
  reference_no: string,
  transaction_no: string,
  created_at: string,
  status: 'pending' | 'completed'
  user_profiles: User;
  due_date: string;
  total_price: number;
}

export type InstallmentPayment = {
    id: number;
    transaction_id: number;
    amount_paid: number;
    payment_date: string;
    payment_method: string;
    reference_no: string;
    notes: string;
    recorded_by: string;
    created_at: string;
}

export type InstallmentSummary = {
    total_price: number;
    initial_amount_paid: number;
    due_date: string;
    years_to_pay: number | null;
    total_paid: number;
    payment_balance: number;
    monthly_installment: number | null;
}

export type TransactionContract = {
    file_url: string;
    view_url: string | null;
    file_name: string;
}

export type FetchInstallmentResponseData = {
    payments: InstallmentPayment[];
    summary: InstallmentSummary;
    contract?: TransactionContract | null;
}
