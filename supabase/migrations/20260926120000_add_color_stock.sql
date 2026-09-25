/*
  # Add per-color stock tracking to products

  Adds a `color_stock` jsonb column that maps each color name to its
  available quantity, e.g. { "Black": 10, "Red": 5, "Pink": 20 }.

  When color_stock is empty ({}) the product falls back to the global
  stock_quantity for backwards compatibility.
*/

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS color_stock jsonb DEFAULT '{}';
