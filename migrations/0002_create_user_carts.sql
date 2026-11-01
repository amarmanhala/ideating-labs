PRAGMA foreign_keys = ON;

CREATE TABLE cart_items (
  user_id TEXT NOT NULL,
  product_id INTEGER NOT NULL,
  size TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity BETWEEN 1 AND 99),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, product_id, size),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX cart_items_user_created_idx
  ON cart_items(user_id, created_at, product_id);
