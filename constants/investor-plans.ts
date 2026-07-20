export type InvestorPlan = {
  id: string;
  code: number;
  range: string;
  label: string;
  annualRate: number;
  minimum: number;
};

export const INVESTOR_PLANS: InvestorPlan[] = [
  { id: 'starter', code: 1, range: '₱100,000 to ₱499,999', label: 'Starter', annualRate: 15, minimum: 100000 },
  { id: 'growth', code: 2, range: '₱500,000 to ₱999,999', label: 'Growth', annualRate: 17, minimum: 500000 },
  { id: 'premier', code: 3, range: '₱1M to ₱1.999M', label: 'Premier', annualRate: 20, minimum: 1000000 },
  { id: 'elite', code: 4, range: '₱2M to ₱5M', label: 'Elite', annualRate: 24, minimum: 2000000 },
];
