export interface Property {
  id: number;
  title: string;
  short_description: string;
  location: string;
  status: 0 | 1 | 2;
  category: string;
  units: number;
  area: number;
  image_url: string;
  public_id: string;
  date_completed: string;
  price: number;
  installment: number;
  created_at?: string;
}