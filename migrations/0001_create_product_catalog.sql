PRAGMA foreign_keys = ON;

CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (
    category IN ('Tops', 'Outerwear', 'Objects', 'Accessories')
  ),
  price_minor INTEGER NOT NULL CHECK (price_minor >= 0),
  currency TEXT NOT NULL DEFAULT 'CAD' CHECK (currency = 'CAD'),
  image_url TEXT NOT NULL,
  description TEXT NOT NULL,
  materials TEXT NOT NULL,
  fit TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE product_sizes (
  product_id INTEGER NOT NULL,
  size TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (product_id, size),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX products_active_display_order_idx
  ON products(is_active, display_order, id);

CREATE INDEX products_category_active_display_order_idx
  ON products(category, is_active, display_order, id);

INSERT INTO products (
  id,
  slug,
  name,
  category,
  price_minor,
  currency,
  image_url,
  description,
  materials,
  fit,
  display_order
) VALUES
  (
    1,
    'one-thing-tee',
    'ONE THING TEE',
    'Tops',
    4200,
    'CAD',
    '/images/products/one-thing-tee.png',
    'A heavyweight everyday tee for busy minds. The front carries a simple prompt to return to what is in front of you—one thing, one breath, one moment at a time.',
    '100% heavyweight combed cotton. Machine wash cold and hang dry.',
    'Relaxed, oversized fit with dropped shoulders. Size down for a closer fit.',
    1
  ),
  (
    2,
    'breathe-hoodie',
    'BREATHE HOODIE',
    'Outerwear',
    8800,
    'CAD',
    '/images/products/breathe-hoodie.png',
    'A soft, substantial hoodie designed as a wearable pause. The quiet chest reminder is there when the day feels loud: breathe, notice, begin again.',
    'Heavyweight cotton fleece with a brushed interior. Wash cold with like colors.',
    'Roomy unisex fit with a structured hood and relaxed sleeves.',
    2
  ),
  (
    3,
    'better-days-half-zip',
    'BETTER DAYS HALF ZIP',
    'Outerwear',
    9600,
    'CAD',
    '/images/products/better-days-quarter-zip.png',
    'A clean quarter-zip for the in-between days. Better days ahead is printed close to the heart—a small statement of perspective, not pressure.',
    'Dense cotton-blend fleece with a metal quarter zip. Gentle cycle and air dry.',
    'Relaxed through the body with a slightly cropped, structured hem.',
    3
  ),
  (
    4,
    'be-here-socks',
    'BE HERE SOCKS',
    'Accessories',
    1800,
    'CAD',
    '/images/products/be-here-socks.png',
    'Two reminders for wherever your feet take you: breathe and be here. Cushioned, comfortable, and made for ordinary days that ask a lot of you.',
    'Combed cotton blend with a cushioned sole. Machine wash cold.',
    'Ribbed crew length with a flexible unisex fit.',
    4
  ),
  (
    5,
    'be-present-cap',
    'BE PRESENT CAP',
    'Accessories',
    3200,
    'CAD',
    '/images/products/be-present-cap.png',
    'A familiar silhouette with a direct message. Put it on when you need a visible cue to step out of the mental noise and back into the moment.',
    'Cotton front panel, recycled mesh back, and adjustable snap closure. Spot clean.',
    'One size with an adjustable back closure.',
    5
  ),
  (
    6,
    'kinder-thoughts-tote',
    'KINDER THOUGHTS TOTE',
    'Objects',
    5400,
    'CAD',
    '/images/products/kinder-thoughts-tote.png',
    'A roomy everyday carry with space for the practical things—and a reminder to make a little less room for self-criticism.',
    'Heavyweight cotton canvas with reinforced handles. Spot clean only.',
    'One size. Fits a laptop, notebook, water bottle, and daily essentials.',
    6
  );

INSERT INTO product_sizes (product_id, size, display_order) VALUES
  (1, 'XS', 1),
  (1, 'S', 2),
  (1, 'M', 3),
  (1, 'L', 4),
  (1, 'XL', 5),
  (1, 'XXL', 6),
  (2, 'XS', 1),
  (2, 'S', 2),
  (2, 'M', 3),
  (2, 'L', 4),
  (2, 'XL', 5),
  (2, 'XXL', 6),
  (3, 'XS', 1),
  (3, 'S', 2),
  (3, 'M', 3),
  (3, 'L', 4),
  (3, 'XL', 5),
  (3, 'XXL', 6),
  (4, 'S/M', 1),
  (4, 'L/XL', 2),
  (5, 'OS', 1),
  (6, 'OS', 1);
