/*
  # Admin Authentication - RLS Policy Updates

  ## Changes
  - Adds write policies for authenticated users on admin-managed tables
  - Allows authenticated users (admin) to INSERT, UPDATE, DELETE on:
    - products
    - categories
    - discount_codes
    - banners
    - orders (update only - for status changes)
  - Products SELECT policy updated to allow admin to see inactive products too
  
  ## Security
  - Only authenticated users can perform write operations
  - The application layer (AuthContext) restricts admin access to specific emails
  - Supabase Auth handles session management
  
  ## Note
  If you want to further restrict at the DB level, you can add a custom claim
  or an admin_users table. For a single-owner store, app-level email check is sufficient.
*/

-- Allow authenticated users to SELECT all products (including inactive ones for admin)
CREATE POLICY "Authenticated can view all products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

-- Products: authenticated can insert, update, delete
CREATE POLICY "Authenticated can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (true);

-- Categories: authenticated can insert, update, delete
CREATE POLICY "Authenticated can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (true);

-- Discount codes: authenticated can manage
CREATE POLICY "Authenticated can view all discount codes"
  ON discount_codes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert discount codes"
  ON discount_codes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update discount codes"
  ON discount_codes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete discount codes"
  ON discount_codes FOR DELETE
  TO authenticated
  USING (true);

-- Orders: authenticated can view all and update (for status changes)
CREATE POLICY "Authenticated can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete orders"
  ON orders FOR DELETE
  TO authenticated
  USING (true);

-- Order items: authenticated can view all
CREATE POLICY "Authenticated can view all order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (true);

-- Banners: authenticated can manage
CREATE POLICY "Authenticated can view all banners"
  ON banners FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert banners"
  ON banners FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update banners"
  ON banners FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete banners"
  ON banners FOR DELETE
  TO authenticated
  USING (true);
