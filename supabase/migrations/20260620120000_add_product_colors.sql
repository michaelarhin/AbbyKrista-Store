/*
  # Add Colors to Products

  Adds a `colors` column to the products table so each product can offer
  a set of color options that customers select before adding to cart.
*/

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS colors text[] DEFAULT '{}';
