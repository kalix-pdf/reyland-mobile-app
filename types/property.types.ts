export interface Property {
  id: number;
  lot: string;
  lot_type: number;
  total_price: number;
  intallment_total_price?: number;
  installment_total_price: number;
  down_payment: number;
  installment_down_payment: number;
  monthly_installment?: number | null;
  title: string ;
  short_description: string;
  status: 0 | 1 | 2;
  category: string;
  units: number;
  area: number;
  image_url: string;
  public_id: string;
  date_completed: string;
  price: number;
  installment: number;
  installment_per_year?: number | null;
  years_to_pay?: number | null;
  created_at?: string;
  project_id?: number | null;
  project?: {
    id: number;
    project_name: string;
    location: string | null;
  } | null;
  property_images?: {
    image_id: number;
    image_url: string;
    public_id: string;
  }[];
  amenities: string[];
}
