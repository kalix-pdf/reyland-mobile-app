import { Property } from "./property.types";
import { User } from "./user.types";

export interface Transaction {
  id: number,
  property: Property,
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