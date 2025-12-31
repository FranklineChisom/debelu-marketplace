-- ============================================================
-- DEBELU MARKETPLACE - SEED DATA FOR TESTING
-- Run this after schema.sql to add test data for chat testing
-- ============================================================

-- NOTE: This seed file creates test vendors and products without user references.
-- For production, vendors should be linked to actual authenticated users.

-- Disable RLS temporarily for seeding (requires superuser)
-- If you're using Supabase SQL Editor, you can run this directly.
-- ALTER TABLE public.vendors DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- 1. INSERT TEST VENDORS
-- ============================================================

INSERT INTO public.vendors (id, user_id, business_name, description, campus_id, phone, email, is_verified, verification_status, rating, review_count, total_sales, product_count) VALUES
-- TechHub NG - Electronics Vendor
('11111111-1111-1111-1111-111111111111', NULL, 'TechHub NG', 'Your one-stop shop for laptops, phones, and gadgets. Best prices on campus!', 'unilag', '08012345678', 'techhub@example.com', true, 'approved', 4.8, 156, 342, 15),

-- Campus Kicks - Fashion/Sneakers
('22222222-2222-2222-2222-222222222222', NULL, 'Campus Kicks', 'Authentic sneakers and streetwear. No fakes, only originals!', 'unilag', '08098765432', 'campuskicks@example.com', true, 'approved', 4.7, 89, 178, 12),

-- Book Worms - Academic Books
('33333333-3333-3333-3333-333333333333', NULL, 'Book Worms', 'Textbooks, past questions, and study materials for all courses.', 'unilag', '08055555555', 'bookworms@example.com', true, 'approved', 4.9, 234, 567, 45),

-- Gadget World - Accessories
('44444444-4444-4444-4444-444444444444', NULL, 'Gadget World', 'Phone accessories, chargers, earbuds, and everything tech.', 'unilag', '08077777777', 'gadgetworld@example.com', true, 'approved', 4.6, 312, 890, 32),

-- Campus Living - Home & Hostel
('55555555-5555-5555-5555-555555555555', NULL, 'Campus Living', 'Everything for your hostel - mattresses, fans, cooking items.', 'unilag', '08066666666', 'campusliving@example.com', true, 'approved', 4.5, 145, 234, 28);

-- ============================================================
-- 2. INSERT TEST PRODUCTS
-- ============================================================

-- ELECTRONICS (TechHub NG)
INSERT INTO public.products (id, vendor_id, campus_id, name, description, category, tags, price, compare_at_price, images, stock, status, is_featured, rating, review_count, sales) VALUES
-- Laptops
('a0000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'unilag', 
 'Dell Inspiron 15 Laptop - Core i5, 8GB RAM, 256GB SSD', 
 'Perfect for students! Dell Inspiron 15 with Intel Core i5 processor, 8GB RAM, and 256GB SSD. Runs all your school software smoothly. 1 year warranty included.',
 'electronics', ARRAY['laptop', 'dell', 'computer', 'student'], 
 165000, 195000, 
 '[{"id": "img1", "url": "https://images.unsplash.com/photo-1593642702749-b7d2a804fbcf?q=80&w=800", "alt": "Dell Laptop"}]'::jsonb,
 15, 'active', true, 4.8, 24, 45),

('a0000002-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'unilag', 
 'HP Pavilion 14 Laptop - Ryzen 5, 8GB RAM', 
 'Slim and powerful HP Pavilion with AMD Ryzen 5. Great for coding, design work, and everyday use. Battery lasts 8+ hours.',
 'electronics', ARRAY['laptop', 'hp', 'computer', 'ryzen'], 
 145000, NULL, 
 '[{"id": "img2", "url": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=800", "alt": "HP Laptop"}]'::jsonb,
 8, 'active', false, 4.5, 12, 23),

('a0000003-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'unilag', 
 'MacBook Air M1 - 8GB RAM, 256GB SSD', 
 'Apple MacBook Air with M1 chip. Ultra-fast, silent, and the battery lasts all day. Perfect for creative work and coding.',
 'electronics', ARRAY['laptop', 'macbook', 'apple', 'premium'], 
 485000, 520000, 
 '[{"id": "img3", "url": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800", "alt": "MacBook Air"}]'::jsonb,
 5, 'active', true, 4.9, 56, 34),

-- Phones
('a0000004-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'unilag', 
 'iPhone 13 - 128GB, Blue', 
 'Apple iPhone 13 in beautiful blue. A15 Bionic chip, great cameras, and all-day battery. Nigerian warranty included.',
 'electronics', ARRAY['phone', 'iphone', 'apple', 'smartphone'], 
 450000, 480000, 
 '[{"id": "img4", "url": "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?q=80&w=800", "alt": "iPhone 13"}]'::jsonb,
 12, 'active', true, 4.7, 89, 67),

('a0000005-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'unilag', 
 'Samsung Galaxy A54 - 128GB', 
 'Samsung Galaxy A54 5G. Great cameras, smooth 120Hz display, and 5000mAh battery. Best mid-range phone for students.',
 'electronics', ARRAY['phone', 'samsung', 'android', 'smartphone'], 
 185000, 210000, 
 '[{"id": "img5", "url": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=800", "alt": "Samsung Galaxy"}]'::jsonb,
 20, 'active', false, 4.6, 45, 38);

-- ACCESSORIES (Gadget World)
INSERT INTO public.products (id, vendor_id, campus_id, name, description, category, tags, price, compare_at_price, images, stock, status, is_featured, rating, review_count, sales) VALUES
('a0000006-0000-0000-0000-000000000006', '44444444-4444-4444-4444-444444444444', 'unilag', 
 'Apple AirPods Pro 2nd Gen', 
 'Active Noise Cancellation, Transparency mode, and incredible sound quality. Best earbuds for iPhone users.',
 'electronics', ARRAY['airpods', 'earbuds', 'apple', 'wireless'], 
 120000, 140000, 
 '[{"id": "img6", "url": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800", "alt": "AirPods Pro"}]'::jsonb,
 25, 'active', true, 4.9, 234, 189),

('a0000007-0000-0000-0000-000000000007', '44444444-4444-4444-4444-444444444444', 'unilag', 
 'Logitech MX Master 3S Wireless Mouse', 
 'The best mouse for productivity. Quiet clicks, smooth scrolling, works on any surface. Great for designers and coders.',
 'electronics', ARRAY['mouse', 'logitech', 'wireless', 'productivity'], 
 85000, NULL, 
 '[{"id": "img7", "url": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800", "alt": "Logitech Mouse"}]'::jsonb,
 18, 'active', false, 4.9, 156, 89),

('a0000008-0000-0000-0000-000000000008', '44444444-4444-4444-4444-444444444444', 'unilag', 
 'Anker PowerCore 20000mAh Power Bank', 
 'Never run out of battery! Charges iPhone 5 times, laptop 1 time. Fast charging with USB-C.',
 'electronics', ARRAY['powerbank', 'anker', 'charger', 'battery'], 
 15000, NULL, 
 '[{"id": "img8", "url": "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?q=80&w=800", "alt": "Anker PowerCore"}]'::jsonb,
 50, 'active', false, 4.8, 312, 278),

('a0000009-0000-0000-0000-000000000009', '44444444-4444-4444-4444-444444444444', 'unilag', 
 'Samsung Galaxy Watch 5', 
 'Track your fitness, receive notifications, and look stylish. Water resistant and great battery life.',
 'electronics', ARRAY['smartwatch', 'samsung', 'fitness', 'wearable'], 
 95000, NULL, 
 '[{"id": "img9", "url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800", "alt": "Galaxy Watch"}]'::jsonb,
 12, 'active', false, 4.6, 67, 45);

-- FASHION (Campus Kicks)
INSERT INTO public.products (id, vendor_id, campus_id, name, description, category, tags, price, compare_at_price, images, stock, status, is_featured, rating, review_count, sales) VALUES
('a0000010-0000-0000-0000-000000000010', '22222222-2222-2222-2222-222222222222', 'unilag', 
 'Nike Air Jordan 1 High - Black/Red', 
 'Classic colorway, 100% authentic. Perfect for class or flexing on weekends. Limited stock!',
 'fashion', ARRAY['sneakers', 'nike', 'jordan', 'shoes'], 
 75000, NULL, 
 '[{"id": "img10", "url": "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800", "alt": "Air Jordan 1"}]'::jsonb,
 8, 'active', true, 4.7, 45, 34),

('a0000011-0000-0000-0000-000000000011', '22222222-2222-2222-2222-222222222222', 'unilag', 
 'Adidas Yeezy Boost 350 V2 - Zebra', 
 'Iconic Yeezy design. Boost cushioning for all-day comfort. Authenticated and verified.',
 'fashion', ARRAY['sneakers', 'adidas', 'yeezy', 'shoes'], 
 125000, 150000, 
 '[{"id": "img11", "url": "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800", "alt": "Yeezy 350"}]'::jsonb,
 5, 'active', true, 4.8, 34, 22),

('a0000012-0000-0000-0000-000000000012', '22222222-2222-2222-2222-222222222222', 'unilag', 
 'Vintage Band Tee - Nirvana', 
 'Authentic vintage Nirvana tee. Soft cotton, faded print. Size M-XL available.',
 'fashion', ARRAY['tshirt', 'vintage', 'band', 'clothing'], 
 8500, NULL, 
 '[{"id": "img12", "url": "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800", "alt": "Nirvana Tee"}]'::jsonb,
 15, 'active', false, 4.4, 19, 34),

('a0000013-0000-0000-0000-000000000013', '22222222-2222-2222-2222-222222222222', 'unilag', 
 'Backpack - 40L Travel Bag', 
 'Durable laptop backpack with USB charging port. Water resistant, multiple compartments. Perfect for school.',
 'fashion', ARRAY['backpack', 'bag', 'travel', 'laptop'], 
 22000, 28000, 
 '[{"id": "img13", "url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800", "alt": "Travel Backpack"}]'::jsonb,
 30, 'active', false, 4.6, 156, 123);

-- BOOKS (Book Worms)
INSERT INTO public.products (id, vendor_id, campus_id, name, description, category, tags, price, compare_at_price, images, stock, status, is_featured, rating, review_count, sales) VALUES
('a0000014-0000-0000-0000-000000000014', '33333333-3333-3333-3333-333333333333', 'unilag', 
 'Calculus: Early Transcendentals by James Stewart', 
 '8th Edition. Essential textbook for engineering and science students. Clear explanations and plenty of practice problems.',
 'books', ARRAY['textbook', 'calculus', 'math', 'engineering'], 
 25000, NULL, 
 '[{"id": "img14", "url": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800", "alt": "Calculus Book"}]'::jsonb,
 40, 'active', true, 4.9, 89, 156),

('a0000015-0000-0000-0000-000000000015', '33333333-3333-3333-3333-333333333333', 'unilag', 
 'Introduction to Algorithms (CLRS)', 
 '3rd Edition. The bible of computer science. Must-have for CS students and anyone learning programming.',
 'books', ARRAY['textbook', 'algorithms', 'computer-science', 'programming'], 
 35000, 40000, 
 '[{"id": "img15", "url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800", "alt": "CLRS Book"}]'::jsonb,
 25, 'active', true, 4.9, 67, 89),

('a0000016-0000-0000-0000-000000000016', '33333333-3333-3333-3333-333333333333', 'unilag', 
 'Medical Biochemistry - Harper''s', 
 'Latest edition. Essential for medical and pharmacy students. Comprehensive and well-illustrated.',
 'books', ARRAY['textbook', 'biochemistry', 'medical', 'pharmacy'], 
 28000, NULL, 
 '[{"id": "img16", "url": "https://images.unsplash.com/photo-1576872381149-7847515ce5d8?q=80&w=800", "alt": "Biochemistry Book"}]'::jsonb,
 35, 'active', false, 4.8, 45, 78);

-- HOME & HOSTEL (Campus Living)
INSERT INTO public.products (id, vendor_id, campus_id, name, description, category, tags, price, compare_at_price, images, stock, status, is_featured, rating, review_count, sales) VALUES
('a0000017-0000-0000-0000-000000000017', '55555555-5555-5555-5555-555555555555', 'unilag', 
 'LED Desk Lamp with Wireless Charging', 
 'Three brightness levels, wireless phone charging base, flexible neck. Perfect for late-night studying.',
 'home', ARRAY['lamp', 'desk', 'led', 'wireless-charging'], 
 18000, 22000, 
 '[{"id": "img17", "url": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800", "alt": "Desk Lamp"}]'::jsonb,
 22, 'active', true, 4.7, 89, 67),

('a0000018-0000-0000-0000-000000000018', '55555555-5555-5555-5555-555555555555', 'unilag', 
 'Hostel Single Mattress - Memory Foam', 
 '3-inch memory foam mattress topper. Makes any hostel bed comfortable. Washable cover included.',
 'home', ARRAY['mattress', 'hostel', 'bedding', 'comfort'], 
 35000, NULL, 
 '[{"id": "img18", "url": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800", "alt": "Mattress"}]'::jsonb,
 15, 'active', false, 4.3, 28, 45),

('a0000019-0000-0000-0000-000000000019', '55555555-5555-5555-5555-555555555555', 'unilag', 
 'Mini Electric Kettle - 1L', 
 'Fast boiling, auto shut-off, compact size for hostel use. Perfect for making noodles and tea.',
 'home', ARRAY['kettle', 'electric', 'kitchen', 'hostel'], 
 8500, NULL, 
 '[{"id": "img19", "url": "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?q=80&w=800", "alt": "Electric Kettle"}]'::jsonb,
 40, 'active', false, 4.5, 56, 89),

('a0000020-0000-0000-0000-000000000020', '55555555-5555-5555-5555-555555555555', 'unilag', 
 'Portable Rechargeable Fan', 
 'Save yourself from NEPA! 4 speed levels, USB rechargeable, lasts 8+ hours. Essential for Lagos heat.',
 'home', ARRAY['fan', 'rechargeable', 'portable', 'hostel'], 
 12000, 15000, 
 '[{"id": "img20", "url": "https://images.unsplash.com/photo-1617375407361-9a9c2022f65b?q=80&w=800", "alt": "Portable Fan"}]'::jsonb,
 60, 'active', true, 4.8, 234, 312);

-- ============================================================
-- VERIFICATION QUERIES (Run these to verify data was inserted)
-- ============================================================

-- SELECT COUNT(*) AS vendor_count FROM public.vendors;
-- SELECT COUNT(*) AS product_count FROM public.products;
-- SELECT name, category, price FROM public.products ORDER BY category, name;

-- ============================================================
-- TEST QUERIES FOR CHAT (These are what the AI will run)
-- ============================================================

-- Example: Search for "laptop"
-- SELECT id, name, price, image, vendor_id, rating, stock, category, description 
-- FROM products 
-- WHERE name ILIKE '%laptop%' OR description ILIKE '%laptop%'
-- LIMIT 5;

-- Example: Search for items under 50000 Naira
-- SELECT id, name, price, category FROM products WHERE price <= 50000 ORDER BY price;

-- Example: Search for "phone" in electronics category
-- SELECT id, name, price, category FROM products 
-- WHERE (name ILIKE '%phone%' OR description ILIKE '%phone%') AND category = 'electronics'
-- LIMIT 5;
