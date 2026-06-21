/*
  # Fix Order RLS Policies

  Ensures anonymous users can insert orders and read them back (needed for
  the .insert().select().single() pattern in checkout).

  Also adds UPDATE policy for anon on discount_codes so usage can be tracked.
*/

-- Drop existing restrictive policies if they conflict
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
DROP POLICY IF EXISTS "Customers can view own orders by email" ON orders;
DROP POLICY IF EXISTS "Anyone can create order items" ON order_items;
DROP POLICY IF EXISTS "Order items viewable with order" ON order_items;

-- Orders: anon and authenticated can INSERT
CREATE POLICY "anon_insert_orders"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Orders: anon and authenticated can SELECT (so .select() works after insert)
CREATE POLICY "anon_select_orders"
  ON orders FOR SELECT
  TO anon, authenticated
  USING (true);

-- Order items: anon and authenticated can INSERT
CREATE POLICY "anon_insert_order_items"
  ON order_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Order items: anon and authenticated can SELECT
CREATE POLICY "anon_select_order_items"
  ON order_items FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow anon to update discount code usage counter
CREATE POLICY "anon_update_discount_usage"
  ON discount_codes FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
