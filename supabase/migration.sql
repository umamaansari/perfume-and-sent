-- ============================================
-- SCENTS-N-SECRETS - Full Supabase Schema
-- Paste this entire file into Supabase SQL Editor
-- ============================================

-- 1. PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  description TEXT DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  old_price NUMERIC DEFAULT 0,
  category TEXT DEFAULT '',
  product_type TEXT DEFAULT '',
  series TEXT DEFAULT '',
  size TEXT[] DEFAULT '{}',
  color TEXT DEFAULT '',
  image_urls TEXT[] DEFAULT '{}',
  image_url TEXT DEFAULT '',
  stock INTEGER DEFAULT 10,
  rating NUMERIC DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. USERS (linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT DEFAULT '',
  email TEXT,
  role TEXT DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CART ITEMS
CREATE TABLE IF NOT EXISTS cart_items (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size TEXT DEFAULT '',
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id, size)
);

-- 5. ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  total_amount NUMERIC NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending',
  address TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ORDER ITEMS
CREATE TABLE IF NOT EXISTS order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id),
  name TEXT DEFAULT '',
  price NUMERIC DEFAULT 0,
  size TEXT DEFAULT '',
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- PRODUCTS: anyone can view, only admins can modify
CREATE POLICY "Products viewable by everyone" ON products
  FOR SELECT USING (true);

CREATE POLICY "Products insertable by admins" ON products
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );

CREATE POLICY "Products updatable by admins" ON products
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );

CREATE POLICY "Products deletable by admins" ON products
  FOR DELETE USING (
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );

-- CATEGORIES: anyone can view, only admins can modify
CREATE POLICY "Categories viewable by everyone" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Categories manageable by admins" ON categories
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );

-- USERS: users can only access their own profile
CREATE POLICY "Users view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users deletable by admins" ON users
  FOR DELETE USING (
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );

-- CART: users own their cart items
CREATE POLICY "Cart viewable by owner" ON cart_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Cart insertable by owner" ON cart_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Cart updatable by owner" ON cart_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Cart deletable by owner" ON cart_items
  FOR DELETE USING (auth.uid() = user_id);

-- ORDERS: users own their orders, admins can view all
CREATE POLICY "Orders viewable by owner" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Orders insertable by owner" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Orders viewable by admins" ON orders
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );

-- ORDER ITEMS: access through owner's orders
CREATE POLICY "Order items viewable by owner" ON order_items
  FOR SELECT USING (
    order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
  );

CREATE POLICY "Order items insertable by owner" ON order_items
  FOR INSERT WITH CHECK (
    order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
  );

-- ============================================
-- SEED CATEGORIES
-- ============================================
INSERT INTO categories (id, name, description) VALUES
  ('signature', 'Signature Series', 'Our most iconic fragrances, crafted for those who dare to stand out.'),
  ('dessert', 'Dessert Perfume Series', 'Indulge in sweet, edible-inspired scents that are simply irresistible.'),
  ('oud', 'Oud Perfumes', 'Experience the depth and luxury of the world''s most precious ingredient.'),
  ('bundles', 'Bundles', 'Save more with curated fragrance bundles. Perfect for gifting or building your collection.'),
  ('testers', 'Tester Boxes', 'Same premium fragrances at tester prices. Plain packaging, identical quality.'),
  ('bath', 'Bath & Body', 'Complete your fragrance routine with body mists, lotions, and shower gels.')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- SEED PRODUCTS (20 items)
-- ============================================
INSERT INTO products (name, subtitle, description, price, old_price, category, product_type, series, size, image_url, image_urls, stock, rating, reviews) VALUES
  ('THE KING', 'Limited Edition', 'A bold and regal fragrance that commands attention. Notes of oud, amber, and sandalwood create an unforgettable presence.', 2499, 2999, 'bestseller', 'UNISEX', 'signature', ARRAY['50ML', '15ML'], 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&h=700&fit=crop&q=80', ARRAY['https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1594035910387-fbd1a485b18e?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1519669011783-4eaa95fa1b7d?w=600&h=700&fit=crop&q=80'], 50, 4.8, 256),
  ('THE QUEEN', 'Best Seller', 'An elegant floral masterpiece with hints of jasmine, rose, and vanilla. Perfect for the modern queen.', 2299, 2799, 'bestseller', 'WOMEN', 'signature', ARRAY['50ML', '15ML'], 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=700&fit=crop&q=80', ARRAY['https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&h=700&fit=crop&q=80'], 50, 4.9, 312),
  ('MIDNIGHT OUD', 'Premium Collection', 'Deep, mysterious, and intoxicating. A luxurious blend of rare oud, musk, and dark spices.', 3199, 3899, 'bestseller', 'UNISEX', 'oud', ARRAY['50ML', '15ML'], 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=700&fit=crop&q=80', ARRAY['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1587017539504-0748c3209a3d?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1594035910387-fbd1a485b18e?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1590739225287-bd31519780c3?w=600&h=700&fit=crop&q=80'], 50, 4.7, 189),
  ('VELVET ROSE', 'New Arrival', 'A romantic bouquet of Turkish rose, peony, and soft musk. Wrapped in velvet sophistication.', 1899, 2299, 'bestseller', 'WOMEN', 'dessert', ARRAY['50ML', '15ML'], 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&h=700&fit=crop&q=80', ARRAY['https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&h=700&fit=crop&q=80'], 50, 4.6, 145),
  ('ROYAL AMBER', 'Exclusive', 'Warm, rich, and sophisticated. Amber and leather notes blended with a touch of bergamot.', 2799, 3299, 'bestseller', 'MEN', 'oud', ARRAY['50ML', '15ML'], 'https://images.unsplash.com/photo-1594035910387-fbd1a485b18e?w=600&h=700&fit=crop&q=80', ARRAY['https://images.unsplash.com/photo-1594035910387-fbd1a485b18e?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1587017539504-0748c3209a3d?w=600&h=700&fit=crop&q=80'], 50, 4.8, 203),
  ('GOLDEN SUEDE', 'Limited Edition', 'A luxurious fusion of golden saffron, smooth suede, and warm vanilla. Pure indulgence.', 2599, 3099, 'bestseller', 'UNISEX', 'signature', ARRAY['50ML', '15ML'], 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=600&h=700&fit=crop&q=80', ARRAY['https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1519669011783-4eaa95fa1b7d?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=700&fit=crop&q=80'], 50, 4.5, 98),
  ('SWEET DREAMS', 'Dessert Series', 'An irresistible gourmand blend of caramel, praline, and tonka bean. Like a delicious dessert.', 1599, 1999, 'new', 'UNISEX', 'dessert', ARRAY['50ML', '15ML'], 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600&h=700&fit=crop&q=80', ARRAY['https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&h=700&fit=crop&q=80'], 50, 4.7, 167),
  ('NOIR INTENSE', 'Best Seller', 'Dark, intense, and captivating. Black pepper, tobacco, and smoky vetiver create a bold statement.', 2899, 3499, 'bestseller', 'MEN', 'oud', ARRAY['50ML', '15ML'], 'https://images.unsplash.com/photo-1587017539504-0748c3209a3d?w=600&h=700&fit=crop&q=80', ARRAY['https://images.unsplash.com/photo-1587017539504-0748c3209a3d?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1594035910387-fbd1a485b18e?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&h=700&fit=crop&q=80'], 50, 4.9, 278),
  ('POWER DUO', 'Best Seller Bundle', 'Save big with The King + The Queen bundle. Two iconic fragrances at an unbeatable price.', 3999, 5298, 'bestseller', 'BUNDLE', 'bundles', ARRAY['50ML'], 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600&h=700&fit=crop&q=80', ARRAY['https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1616401784845-180882cf0d68?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1588405765191-bfcc57aa9f63?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&h=700&fit=crop&q=80'], 50, 4.9, 187),
  ('COUPLE ESSENTIALS', 'Value Bundle', 'Midnight Oud + Royal Amber pair. Perfect gift set for couples who love bold scents.', 3499, 4598, 'bestseller', 'BUNDLE', 'bundles', ARRAY['50ML'], 'https://images.unsplash.com/photo-1616401784845-180882cf0d68?w=600&h=700&fit=crop&q=80', ARRAY['https://images.unsplash.com/photo-1616401784845-180882cf0d68?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1588405765191-bfcc57aa9f63?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=700&fit=crop&q=80'], 50, 4.7, 134),
  ('FRAGRANCE TRIO', 'Premium Bundle', 'Three bestsellers in one luxurious bundle. The ultimate fragrance collection for any occasion.', 5499, 7297, 'new', 'BUNDLE', 'bundles', ARRAY['50ML'], 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600&h=700&fit=crop&q=80', ARRAY['https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1616401784845-180882cf0d68?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1519669011783-4eaa95fa1b7d?w=600&h=700&fit=crop&q=80'], 50, 4.8, 96),
  ('MINI COLLECTION', 'Discovery Bundle', 'Try three travel-size favorites. Perfect for gifting or exploring our range.', 2199, 2997, 'bestseller', 'BUNDLE', 'bundles', ARRAY['15ML'], 'https://images.unsplash.com/photo-1588405765191-bfcc57aa9f63?w=600&h=700&fit=crop&q=80', ARRAY['https://images.unsplash.com/photo-1588405765191-bfcc57aa9f63?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1616401784845-180882cf0d68?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=700&fit=crop&q=80'], 50, 4.6, 211),
  ('THE KING TESTER', '100ML Tester Box', 'Full-size fragrance in tester packaging. Same premium scent, incredible value. Plain box, no outer packaging.', 1799, 2999, 'bestseller', 'TESTER', 'testers', ARRAY['100ML'], 'https://images.unsplash.com/photo-1519669011783-4eaa95fa1b7d?w=600&h=700&fit=crop&q=80', ARRAY['https://images.unsplash.com/photo-1519669011783-4eaa95fa1b7d?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1587017539504-0748c3209a3d?w=600&h=700&fit=crop&q=80'], 50, 4.8, 89),
  ('THE QUEEN TESTER', '100ML Tester Box', 'The complete feminine fragrance in tester format. Identical juice, smart savings.', 1599, 2799, 'bestseller', 'TESTER', 'testers', ARRAY['100ML'], 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=700&fit=crop&q=80', ARRAY['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1588405765191-bfcc57aa9f63?w=600&h=700&fit=crop&q=80'], 50, 4.9, 145),
  ('MIDNIGHT OUD TESTER', '100ML Tester Box', 'Experience our premium oud at a tester price. Plain box, full bottle, same luxury.', 2199, 3899, 'new', 'TESTER', 'testers', ARRAY['100ML'], 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=700&fit=crop&q=80', ARRAY['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1594035910387-fbd1a485b18e?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1587017539504-0748c3209a3d?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1590739225287-bd31519780c3?w=600&h=700&fit=crop&q=80'], 50, 4.7, 76),
  ('NOIR INTENSE TESTER', '100ML Tester Box', 'Our most popular men fragrance at an unmatched tester price. Same scent, different box.', 1999, 3499, 'bestseller', 'TESTER', 'testers', ARRAY['100ML'], 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&h=700&fit=crop&q=80', ARRAY['https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1587017539504-0748c3209a3d?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1594035910387-fbd1a485b18e?w=600&h=700&fit=crop&q=80'], 50, 4.9, 112),
  ('VELVET ROSE BODY MIST', 'Bath & Body', 'Luxurious rose-scented body mist. Perfect for layering with Velvet Rose perfume or wearing alone.', 899, 1199, 'bestseller', 'BODY', 'bath', ARRAY['200ML'], 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=700&fit=crop&q=80', ARRAY['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=600&h=700&fit=crop&q=80'], 50, 4.5, 198),
  ('OUD BODY LOTION', 'Bath & Body', 'Rich, moisturizing body lotion infused with oud essence. Leaves skin silky and beautifully scented.', 1099, 1499, 'bestseller', 'BODY', 'bath', ARRAY['250ML'], 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=600&h=700&fit=crop&q=80', ARRAY['https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1594035910387-fbd1a485b18e?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=700&fit=crop&q=80'], 50, 4.6, 134),
  ('GOLDEN SUEDE SHOWER GEL', 'Bath & Body', 'Invigorating shower gel with golden saffron and suede notes. Start your day wrapped in luxury.', 749, 999, 'new', 'BODY', 'bath', ARRAY['300ML'], 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=700&fit=crop&q=80', ARRAY['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&h=700&fit=crop&q=80'], 50, 4.4, 87),
  ('ROYAL AMBER HAIR MIST', 'Bath & Body', 'Lightweight hair mist with amber and bergamot. Adds a subtle, lingering fragrance to your hair.', 949, 1299, 'bestseller', 'BODY', 'bath', ARRAY['100ML'], 'https://images.unsplash.com/photo-1590739225287-bd31519780c3?w=600&h=700&fit=crop&q=80', ARRAY['https://images.unsplash.com/photo-1590739225287-bd31519780c3?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1594035910387-fbd1a485b18e?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=700&fit=crop&q=80','https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=700&fit=crop&q=80'], 50, 4.7, 156)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- UPDATE PRODUCT IMAGE URLS
-- ============================================
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop' WHERE name = 'THE KING';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop' WHERE name = 'THE QUEEN';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=800&auto=format&fit=crop' WHERE name = 'MIDNIGHT OUD';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800&auto=format&fit=crop' WHERE name = 'VELVET ROSE';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800&auto=format&fit=crop' WHERE name = 'ROYAL AMBER';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?q=80&w=800&auto=format&fit=crop' WHERE name = 'GOLDEN SUEDE';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?q=80&w=800&auto=format&fit=crop' WHERE name = 'NOIR INTENSE';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?q=80&w=800&auto=format&fit=crop' WHERE name = 'POWER DUO';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?auto=format&fit=crop&w=900&q=80' WHERE name = 'COUPLE ESSENTIALS';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80' WHERE name = 'FRAGRANCE TRIO';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop' WHERE name = 'MINI COLLECTION';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1619994403073-2cec99c8a9a8?q=80&w=800&auto=format&fit=crop' WHERE name = 'THE KING TESTER';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?q=80&w=800&auto=format&fit=crop' WHERE name = 'THE QUEEN TESTER';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1608528577891-eb055944f2e8?q=80&w=800&auto=format&fit=crop' WHERE name = 'MIDNIGHT OUD TESTER';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?q=80&w=800&auto=format&fit=crop' WHERE name = 'NOIR INTENSE TESTER';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop' WHERE name = 'VELVET ROSE BODY MIST';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop' WHERE name = 'OUD BODY LOTION';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=800&auto=format&fit=crop' WHERE name = 'GOLDEN SUEDE SHOWER GEL';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1600959907703-125ba1374a12?q=80&w=800&auto=format&fit=crop' WHERE name = 'ROYAL AMBER HAIR MIST';

-- ============================================
-- ADD NEW PRODUCT: ROYAL OUD
-- ============================================
INSERT INTO products (name, subtitle, description, price, old_price, category, product_type, series, size, image_url, image_urls, stock, rating, reviews) VALUES
  ('Royal Oud', 'New Arrival', 'A majestic oud fragrance fit for royalty. Rich agarwood blended with saffron, leather, and warm amber creates an unforgettable scent experience.', 2999, 3499, 'new', 'UNISEX', 'oud', ARRAY['50ML', '15ML'], 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1594035910387-fbd1a485b18e?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800&auto=format&fit=crop'], 50, 4.7, 0)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- TRIGGER: Auto-create user profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    'customer'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- BACKFILL: Create profiles for existing auth users
-- (Run this if users already signed up before trigger existed)
-- ============================================
INSERT INTO public.users (id, name, email, role)
SELECT
  id,
  COALESCE(raw_user_meta_data->>'name', ''),
  email,
  'customer'
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- OPTIONAL: Disable email confirmation (dev only)
-- Go to Supabase Dashboard → Authentication → Settings
-- Set "Enable email confirmation" to OFF
-- Otherwise users must verify email before logging in
-- ============================================

-- ============================================
-- BACKFILL: Set image_urls for existing products
-- Run this if you already have products with image_url but empty image_urls
-- ============================================
UPDATE products SET image_urls = ARRAY[image_url] WHERE image_url != '' AND image_urls = '{}';

-- ============================================
-- AFTER RUNNING: Make yourself admin
-- Run this separately with your email:
-- UPDATE public.users SET role = 'admin' WHERE email = 'your@email.com';
-- UPDATE public.users SET role = 'admin' WHERE email = 'hb395586@gmail.com';
-- ============================================
