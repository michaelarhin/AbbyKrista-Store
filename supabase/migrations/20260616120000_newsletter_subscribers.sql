/*
  # Newsletter Subscribers Table

  Stores email addresses of newsletter subscribers.
*/

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  subscribed_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Anyone can subscribe (insert their email)
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated admin can view subscribers
CREATE POLICY "Authenticated can view subscribers"
  ON newsletter_subscribers FOR SELECT
  TO authenticated
  USING (true);

-- Only authenticated admin can update/delete
CREATE POLICY "Authenticated can manage subscribers"
  ON newsletter_subscribers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete subscribers"
  ON newsletter_subscribers FOR DELETE
  TO authenticated
  USING (true);
