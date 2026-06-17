export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  category_id: string | null;
  images: string[];
  stock_quantity: number;
  low_stock_threshold: number;
  sku: string | null;
  is_active: boolean;
  is_featured: boolean;
  tags: string[];
  weight: number | null;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: ShippingAddress;
  subtotal: number;
  discount_amount: number;
  shipping_cost: number;
  total: number;
  currency: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  discount_code_id: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_image: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  region: string;
  country: string;
  postal_code?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'mobile_money' | 'card' | 'cash_on_delivery';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface DiscountCode {
  id: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  min_purchase_amount: number;
  max_uses: number | null;
  current_uses: number;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  image_url: string;
  background_color: string;
  text_color: string;
  is_active: boolean;
  sort_order: number;
  banner_type: 'hero' | 'promotional' | 'announcement';
  created_at: string;
}

export type Currency = 'GHS' | 'USD' | 'EUR' | 'GBP' | 'NGN' | 'KES';

export interface CurrencyInfo {
  code: Currency;
  symbol: string;
  name: string;
  rate: number;
}

export interface CheckoutFormData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: ShippingAddress;
  payment_method: PaymentMethod;
  discount_code: string;
  notes: string;
}
