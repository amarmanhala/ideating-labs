PRAGMA foreign_keys = ON;

CREATE TABLE stripe_customers (
  user_id TEXT PRIMARY KEY,
  stripe_customer_id TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  checkout_key TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN (
      'pending',
      'paid',
      'payment_failed',
      'expired',
      'refunded',
      'partially_refunded',
      'fulfilled'
    )
  ),
  stripe_customer_id TEXT,
  stripe_checkout_session_id TEXT UNIQUE,
  stripe_checkout_url TEXT,
  stripe_payment_intent_id TEXT UNIQUE,
  customer_email TEXT,
  currency TEXT NOT NULL DEFAULT 'CAD' CHECK (currency = 'CAD'),
  subtotal_minor INTEGER NOT NULL CHECK (subtotal_minor >= 0),
  shipping_minor INTEGER NOT NULL DEFAULT 1200 CHECK (shipping_minor >= 0),
  tax_minor INTEGER NOT NULL DEFAULT 0 CHECK (tax_minor >= 0),
  total_minor INTEGER NOT NULL CHECK (total_minor >= 0),
  shipping_name TEXT,
  shipping_line1 TEXT,
  shipping_line2 TEXT,
  shipping_city TEXT,
  shipping_province TEXT,
  shipping_postal_code TEXT,
  shipping_country TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  paid_at TEXT,
  fulfilled_at TEXT
);

CREATE TABLE order_items (
  order_id TEXT NOT NULL,
  product_id INTEGER NOT NULL,
  product_slug TEXT NOT NULL,
  product_name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  size TEXT NOT NULL,
  unit_price_minor INTEGER NOT NULL CHECK (unit_price_minor >= 0),
  quantity INTEGER NOT NULL CHECK (quantity BETWEEN 1 AND 99),
  PRIMARY KEY (order_id, product_id, size),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE stripe_webhook_events (
  event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  processed_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX orders_user_created_idx
  ON orders(user_id, created_at DESC);

CREATE INDEX orders_status_created_idx
  ON orders(status, created_at);

CREATE INDEX order_items_order_idx
  ON order_items(order_id);
