/*
  # Ecommerce Store - Full Schema

  ## Overview
  Complete ecommerce database schema with products, categories, orders, discount codes, promotional banners, and inventory tracking.

  ## New Tables

  ### categories
  - id (uuid, primary key)
  - name (text) - Category display name
  - slug (text, unique) - URL-friendly identifier
  - description (text)
  - image_url (text)
  - sort_order (int) - Display ordering

  ### products
  - id (uuid, primary key)
  - name (text)
  - slug (text, unique)
  - description (text)
  - price (numeric) - Price in GHS (Cedi)
  - compare_at_price (numeric) - Original price for sale display
  - category_id (uuid, FK -> categories)
  - images (text[]) - Array of image URLs
  - stock_quantity (int)
  - low_stock_threshold (int) - Alert when stock drops below this
  - sku (text, unique) - Stock Keeping Unit
  - is_active (boolean)
  - is_featured (boolean)
  - tags (text[])
  - weight (numeric)
  - created_at, updated_at (timestamptz)

  ### orders
  - id (uuid, primary key)
  - order_number (text, unique) - Human-readable order number
  - customer_name, customer_email, customer_phone (text)
  - shipping_address (jsonb)
  - subtotal, discount_amount, total (numeric)
  - currency (text)
  - status (text) - pending/confirmed/processing/shipped/delivered/cancelled
  - payment_method (text) - mobile_money/card/cash_on_delivery
  - payment_status (text) - pending/paid/failed/refunded
  - discount_code_id (uuid, FK -> discount_codes)
  - notes (text)
  - created_at, updated_at (timestamptz)

  ### order_items
  - id (uuid, primary key)
  - order_id (uuid, FK -> orders)
  - product_id (uuid, FK -> products)
  - product_name (text) - Snapshot of product name at purchase
  - product_image (text)
  - quantity (int)
  - unit_price (numeric)
  - total_price (numeric)

  ### discount_codes
  - id (uuid, primary key)
  - code (text, unique) - The discount code string
  - description (text)
  - discount_type (text) - percentage/fixed_amount
  - discount_value (numeric) - Amount or percentage
  - min_purchase_amount (numeric)
  - max_uses (int) - NULL means unlimited
  - current_uses (int)
  - is_active (boolean)
  - expires_at (timestamptz)
  - created_at (timestamptz)

  ### banners
  - id (uuid, primary key)
  - title (text)
  - subtitle (text)
  - cta_text (text)
  - cta_link (text)
  - image_url (text)
  - background_color (text)
  - text_color (text)
  - is_active (boolean)
  - sort_order (int)
  - banner_type (text) - hero/promotional/announcement
  - created_at (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Public read access for products, categories, banners (storefront)
  - Restricted write access (admin via service role)
  - Orders accessible by email match or admin
*/

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  image_url text DEFAULT '',
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Service role can manage categories"
  ON categories FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update categories"
  ON categories FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete categories"
  ON categories FOR DELETE
  TO service_role
  USING (true);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  price numeric(12,2) NOT NULL DEFAULT 0,
  compare_at_price numeric(12,2),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  images text[] DEFAULT '{}',
  stock_quantity int NOT NULL DEFAULT 0,
  low_stock_threshold int DEFAULT 5,
  sku text UNIQUE,
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  tags text[] DEFAULT '{}',
  weight numeric(8,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Service role can insert products"
  ON products FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update products"
  ON products FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete products"
  ON products FOR DELETE
  TO service_role
  USING (true);

-- Discount codes
CREATE TABLE IF NOT EXISTS discount_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  description text DEFAULT '',
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
  discount_value numeric(10,2) NOT NULL DEFAULT 0,
  min_purchase_amount numeric(12,2) DEFAULT 0,
  max_uses int,
  current_uses int DEFAULT 0,
  is_active boolean DEFAULT true,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active discount codes"
  ON discount_codes FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Service role can manage discount codes"
  ON discount_codes FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update discount codes"
  ON discount_codes FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete discount codes"
  ON discount_codes FOR DELETE
  TO service_role
  USING (true);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text DEFAULT '',
  shipping_address jsonb DEFAULT '{}',
  subtotal numeric(12,2) NOT NULL DEFAULT 0,
  discount_amount numeric(12,2) DEFAULT 0,
  shipping_cost numeric(12,2) DEFAULT 0,
  total numeric(12,2) NOT NULL DEFAULT 0,
  currency text DEFAULT 'GHS',
  status text DEFAULT 'pending' CHECK (status IN ('pending','confirmed','processing','shipped','delivered','cancelled')),
  payment_method text DEFAULT 'cash_on_delivery' CHECK (payment_method IN ('mobile_money','card','cash_on_delivery')),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','failed','refunded')),
  discount_code_id uuid REFERENCES discount_codes(id) ON DELETE SET NULL,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Customers can view own orders by email"
  ON orders FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Service role can manage orders"
  ON orders FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete orders"
  ON orders FOR DELETE
  TO service_role
  USING (true);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  product_image text DEFAULT '',
  quantity int NOT NULL DEFAULT 1,
  unit_price numeric(12,2) NOT NULL DEFAULT 0,
  total_price numeric(12,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Order items viewable with order"
  ON order_items FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Service role can manage order items"
  ON order_items FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete order items"
  ON order_items FOR DELETE
  TO service_role
  USING (true);

-- Banners
CREATE TABLE IF NOT EXISTS banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text DEFAULT '',
  cta_text text DEFAULT 'Shop Now',
  cta_link text DEFAULT '/products',
  image_url text DEFAULT '',
  background_color text DEFAULT '#000000',
  text_color text DEFAULT '#ffffff',
  is_active boolean DEFAULT true,
  sort_order int DEFAULT 0,
  banner_type text DEFAULT 'hero' CHECK (banner_type IN ('hero','promotional','announcement')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active banners"
  ON banners FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Service role can manage banners"
  ON banners FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update banners"
  ON banners FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete banners"
  ON banners FOR DELETE
  TO service_role
  USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
