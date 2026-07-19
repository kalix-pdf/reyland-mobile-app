export interface investment {
    id: number;
    investment_ref: string;
    user_id: string,
    transaction_id: number,
    principal_amount: number;
    annual_roi_base_rates: number;
    monthly_roi_percentage: number;
    term_months: number;
    status: string;
    maturity_action: string;
    invested_at: string;
    matures_at: string;
    matured_at: string;
    created_at: string;
    updated_at: string;
    monthly_payout_amount: number;
    locked_investment: boolean;
    investment_plan_range: number;
    next_payout_at: string;
    payouts_made: number;
    contract_file_url: string;
    investment_payouts: InvestmentPayout[];
}

export interface InvestmentPayout {
  id: number;
  investment_id: number;
  payout_month: number;
  expected_amount: number;
  due_date: string;
  paid_amount: number | null;
  paid_date: string | null;
  status: string;
  created_at: string;
}