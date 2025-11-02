export interface Transaction {
  id: number;
  date: string;
  transaction_type: '01' | '02';  // '01': 収入, '02': 支出
  category_id: number;
  amount: number;
  payment_method_id?: number;
  description?: string;
  tags?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  code: string;
  name: string;
  description?: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethod {
  id: number;
  code: string;
  name: string;
  description?: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}