// Multilingual Text
export interface MultilingualText {
  nl: string;
  fr: string;
  en: string;
  tr: string;
}

// Category
export interface Category {
  id: string;
  name: MultilingualText;
  description: MultilingualText;
  image?: string;
  parent_id?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// Product
export interface Product {
  id: string;
  name: MultilingualText;
  description: MultilingualText;
  price: number;
  stock: number;
  sku: string;
  category_id: string;
  images: string[];
  is_active: boolean;
  unit: string;
  brand: string;
  specifications: Record<string, string>;
  created_at: string;
  updated_at: string;
}

// Cart Item
export interface CartItem {
  product: Product;
  quantity: number;
}

// Order Item
export interface OrderItem {
  product_id: string;
  product_name: MultilingualText;
  quantity: number;
  price: number;
  total: number;
}

// Customer Info
export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
}

// Order
export interface Order {
  id: string;
  order_number: string;
  items: OrderItem[];
  customer: CustomerInfo;
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  payment_status: string;
  payment_method: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

// Discount
export interface Discount {
  id: string;
  code: string;
  name: MultilingualText;
  description: MultilingualText;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  max_uses: number;
  used_count: number;
  is_active: boolean;
  valid_from: string;
  valid_until?: string;
}

// Customer
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  total_orders: number;
  total_spent: number;
  created_at: string;
}

// Dashboard Stats
export interface DashboardStats {
  total_products: number;
  total_orders: number;
  total_revenue: number;
  total_customers: number;
  pending_orders: number;
  low_stock_products: number;
  recent_orders: any[];
  top_products: any[];
}

// Language
export type Language = 'nl' | 'fr' | 'en' | 'tr';
