-- ShopSphere E-Commerce Platform
-- MySQL schema + sample data
-- Database: ecommerce_db

CREATE DATABASE IF NOT EXISTS ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecommerce_db;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS wishlist;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS carts;
DROP TABLE IF EXISTS product_variants;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_users_email (email)
) ENGINE=InnoDB;

CREATE TABLE categories (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(80) NOT NULL UNIQUE,
  image_url VARCHAR(500)
) ENGINE=InnoDB;

CREATE TABLE products (
  product_id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  product_name VARCHAR(150) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  old_price DECIMAL(10,2) DEFAULT NULL,
  stock INT NOT NULL DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INT DEFAULT 0,
  image_url VARCHAR(500),
  brand VARCHAR(80) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(category_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX idx_products_category (category_id),
  INDEX idx_products_price (price),
  INDEX idx_products_rating (rating),
  INDEX idx_products_name (product_name),
  INDEX idx_products_created (created_at)
) ENGINE=InnoDB;

CREATE TABLE product_images (
  image_id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  CONSTRAINT fk_images_product FOREIGN KEY (product_id) REFERENCES products(product_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  INDEX idx_images_product (product_id)
) ENGINE=InnoDB;

CREATE TABLE product_variants (
  variant_id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  size VARCHAR(20) DEFAULT NULL,
  color VARCHAR(40) DEFAULT NULL,
  stock INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_variants_product FOREIGN KEY (product_id) REFERENCES products(product_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  INDEX idx_variants_product (product_id)
) ENGINE=InnoDB;

CREATE TABLE carts (
  cart_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  CONSTRAINT fk_carts_user FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE cart_items (
  cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
  cart_id INT NOT NULL,
  product_id INT NOT NULL,
  variant_id INT DEFAULT NULL,
  quantity INT NOT NULL DEFAULT 1,
  CONSTRAINT fk_cart_items_cart FOREIGN KEY (cart_id) REFERENCES carts(cart_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_cart_items_product FOREIGN KEY (product_id) REFERENCES products(product_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_cart_items_variant FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  INDEX idx_cart_items_cart (cart_id)
) ENGINE=InnoDB;

CREATE TABLE wishlist (
  wishlist_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  CONSTRAINT fk_wishlist_user FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_wishlist_product FOREIGN KEY (product_id) REFERENCES products(product_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  UNIQUE KEY uq_wishlist_user_product (user_id, product_id)
) ENGINE=InnoDB;

CREATE TABLE addresses (
  address_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address_line VARCHAR(255) NOT NULL,
  apartment VARCHAR(100) DEFAULT NULL,
  city VARCHAR(80) NOT NULL,
  state VARCHAR(80) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  is_default TINYINT(1) NOT NULL DEFAULT 0,
  CONSTRAINT fk_addresses_user FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  INDEX idx_addresses_user (user_id)
) ENGINE=InnoDB;

CREATE TABLE orders (
  order_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  address_id INT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  order_status VARCHAR(40) NOT NULL DEFAULT 'PLACED',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_orders_address FOREIGN KEY (address_id) REFERENCES addresses(address_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX idx_orders_user (user_id),
  INDEX idx_orders_status (order_status)
) ENGINE=InnoDB;

CREATE TABLE order_items (
  order_item_id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  variant_id INT DEFAULT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(order_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(product_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_order_items_variant FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  INDEX idx_order_items_order (order_id)
) ENGINE=InnoDB;

CREATE TABLE payments (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  payment_method VARCHAR(40) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES orders(order_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  INDEX idx_payments_order (order_id)
) ENGINE=InnoDB;

CREATE TABLE reviews (
  review_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  rating INT NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_reviews_product FOREIGN KEY (product_id) REFERENCES products(product_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5),
  INDEX idx_reviews_product (product_id)
) ENGINE=InnoDB;

CREATE TABLE bookings (
  booking_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  booking_date DATE NOT NULL,
  booking_time VARCHAR(20) NOT NULL,
  booking_status VARCHAR(30) NOT NULL DEFAULT 'CONFIRMED',
  CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  INDEX idx_bookings_user (user_id)
) ENGINE=InnoDB;

CREATE TABLE messages (
  message_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT DEFAULT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_messages_user FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- Demo user password: Password123!
INSERT INTO users (name, email, phone, password) VALUES
('Alex Rivera', 'alex@shopsphere.com', '9876543210', '$2a$10$8K1p/a0dL3.H1mN8Q9xKXeYxYqYqYqYqYqYqYqYqYqYqYqYqYqYq'),
('Priya Sharma', 'priya@shopsphere.com', '9123456780', '$2a$10$8K1p/a0dL3.H1mN8Q9xKXeYxYqYqYqYqYqYqYqYqYqYqYqYqYqYq');

INSERT INTO categories (category_name, image_url) VALUES
('Men', 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800'),
('Women', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800'),
('Footwear', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'),
('Bags', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800'),
('Watches', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'),
('Electronics', 'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?w=800');

INSERT INTO products (category_id, product_name, description, price, old_price, stock, rating, total_reviews, image_url, brand) VALUES
(1, 'Premium Casual Cotton Shirt', 'Breathable cotton shirt with a tailored fit. Ideal for everyday wear and smart-casual looks.', 29.99, 44.99, 80, 4.5, 128, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800', 'NovaWear'),
(3, 'Classic Running Shoes', 'Lightweight running shoes with responsive cushioning and a grippy outsole for daily training.', 59.99, 79.99, 60, 4.6, 210, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', 'StrideLab'),
(4, 'Leather Shoulder Bag', 'Full-grain leather shoulder bag with multiple compartments and an adjustable strap.', 49.99, 69.99, 40, 4.4, 76, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800', 'Atelier'),
(5, 'Minimalist Wrist Watch', 'Slim analog watch with a stainless-steel case and sapphire-coated crystal.', 89.99, 119.99, 35, 4.7, 94, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', 'Aether'),
(2, 'Women''s Summer Dress', 'Flowing midi dress in a lightweight fabric, designed for warm-weather comfort.', 45.99, 59.99, 50, 4.5, 142, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800', 'Lumen'),
(6, 'Wireless Headphones', 'Over-ear Bluetooth headphones with active noise cancellation and 30-hour battery life.', 79.99, 109.99, 70, 4.6, 301, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', 'Pulse'),
(1, 'Denim Jacket', 'Classic denim jacket with a slightly oversized cut and durable stitching.', 64.99, 84.99, 45, 4.3, 88, 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800', 'NovaWear'),
(3, 'Premium Sneakers', 'Everyday sneakers with a clean silhouette, cushioned insole, and rubber cupsole.', 89.99, 109.99, 55, 4.8, 190, 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800', 'StrideLab'),
(4, 'Leather Wallet', 'Compact bifold wallet in genuine leather with RFID lining.', 24.99, 34.99, 120, 4.4, 67, 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800', 'Atelier'),
(5, 'Smart Watch Pro', 'Fitness-focused smartwatch with heart-rate tracking, GPS, and a vibrant AMOLED display.', 129.99, 169.99, 40, 4.7, 256, 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800', 'Pulse'),
(1, 'Slim Fit Chinos', 'Stretch cotton chinos with a tapered leg and clean front pockets.', 39.99, 54.99, 90, 4.2, 54, 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800', 'NovaWear'),
(2, 'Floral Maxi Dress', 'Printed maxi dress with a cinched waist and breezy silhouette.', 54.99, 74.99, 38, 4.6, 101, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800', 'Lumen'),
(4, 'Crossbody Mini Bag', 'Compact crossbody with a structured shape and gold-tone hardware.', 34.99, 44.99, 65, 4.3, 49, 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800', 'Atelier'),
(5, 'Chronograph Watch', 'Sport chronograph with a tachymeter bezel and date window.', 149.99, 189.99, 22, 4.8, 73, 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800', 'Aether'),
(6, 'Bluetooth Speaker', 'Portable waterproof speaker with 360° sound and 12-hour playtime.', 44.99, 59.99, 85, 4.5, 188, 'https://images.unsplash.com/photo-1608043152269-423dbba4d8e4?w=800', 'Pulse'),
(3, 'Oxford Dress Shoes', 'Polished leather oxfords with a stacked heel and leather lining.', 99.99, 129.99, 28, 4.4, 41, 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800', 'StrideLab'),
(1, 'Linen Blend Shirt', 'Relaxed linen-blend shirt for warm days and weekend travel.', 34.99, 49.99, 72, 4.1, 33, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800', 'NovaWear'),
(2, 'High-Waist Jeans', 'High-rise straight jeans with a comfortable stretch denim blend.', 49.99, 69.99, 58, 4.5, 119, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800', 'Lumen'),
(4, 'Laptop Backpack', 'Padded 15-inch laptop backpack with USB charging port and water-resistant shell.', 59.99, 79.99, 47, 4.6, 162, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800', 'Atelier'),
(6, 'Wireless Earbuds', 'True wireless earbuds with touch controls and a compact charging case.', 54.99, 79.99, 110, 4.4, 240, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800', 'Pulse'),
(3, 'Ankle Boots', 'Suede ankle boots with a block heel and side zip for easy wear.', 79.99, 99.99, 32, 4.3, 58, 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800', 'StrideLab'),
(2, 'Knit Cardigan', 'Soft merino-blend cardigan with ribbed cuffs and a relaxed drape.', 42.99, 58.99, 44, 4.2, 37, 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800', 'Lumen'),
(6, '4K Action Camera', 'Compact action camera with 4K recording, image stabilization, and waterproof housing.', 199.99, 249.99, 18, 4.7, 91, 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800', 'Pulse'),
(1, 'Merino Wool Sweater', 'Fine-gauge merino sweater that layers easily through cooler months.', 69.99, 89.99, 36, 4.6, 64, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800', 'NovaWear');

INSERT INTO product_images (product_id, image_url)
SELECT product_id, image_url FROM products;

INSERT INTO product_images (product_id, image_url) VALUES
(1, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800'),
(2, 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800'),
(5, 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800'),
(6, 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800'),
(8, 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800'),
(10, 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800');

INSERT INTO product_variants (product_id, size, color, stock) VALUES
(1, 'S', 'White', 20), (1, 'M', 'White', 25), (1, 'L', 'Navy', 20), (1, 'XL', 'Navy', 15),
(2, '8', 'Black', 15), (2, '9', 'Black', 20), (2, '10', 'White', 15), (2, '11', 'White', 10),
(3, 'One Size', 'Tan', 20), (3, 'One Size', 'Black', 20),
(4, 'One Size', 'Silver', 18), (4, 'One Size', 'Gold', 17),
(5, 'S', 'Blue', 15), (5, 'M', 'Blue', 20), (5, 'L', 'Coral', 15),
(6, 'One Size', 'Black', 40), (6, 'One Size', 'White', 30),
(7, 'M', 'Blue', 15), (7, 'L', 'Blue', 15), (7, 'XL', 'Black', 15),
(8, '8', 'White', 15), (8, '9', 'White', 20), (8, '10', 'Black', 20),
(9, 'One Size', 'Brown', 60), (9, 'One Size', 'Black', 60),
(10, 'One Size', 'Black', 20), (10, 'One Size', 'Silver', 20),
(11, '30', 'Khaki', 30), (11, '32', 'Navy', 30), (11, '34', 'Khaki', 30),
(12, 'S', 'Pink', 12), (12, 'M', 'Pink', 14), (12, 'L', 'Ivory', 12),
(13, 'One Size', 'Black', 35), (13, 'One Size', 'Cream', 30),
(14, 'One Size', 'Black', 12), (14, 'One Size', 'Blue', 10),
(15, 'One Size', 'Blue', 45), (15, 'One Size', 'Black', 40),
(16, '8', 'Brown', 8), (16, '9', 'Brown', 10), (16, '10', 'Black', 10),
(17, 'M', 'Beige', 24), (17, 'L', 'White', 24), (17, 'XL', 'Beige', 24),
(18, '26', 'Indigo', 18), (18, '28', 'Indigo', 20), (18, '30', 'Black', 20),
(19, 'One Size', 'Grey', 25), (19, 'One Size', 'Navy', 22),
(20, 'One Size', 'White', 55), (20, 'One Size', 'Black', 55),
(21, '7', 'Tan', 10), (21, '8', 'Tan', 12), (21, '9', 'Black', 10),
(22, 'S', 'Cream', 14), (22, 'M', 'Grey', 16), (22, 'L', 'Cream', 14),
(23, 'One Size', 'Black', 18),
(24, 'M', 'Charcoal', 12), (24, 'L', 'Navy', 12), (24, 'XL', 'Charcoal', 12);

INSERT INTO addresses (user_id, full_name, phone, address_line, apartment, city, state, postal_code, is_default) VALUES
(1, 'Alex Rivera', '9876543210', '221B Market Street', 'Apt 4B', 'San Francisco', 'CA', '94103', 1);

INSERT INTO reviews (user_id, product_id, rating, comment) VALUES
(1, 1, 5, 'Excellent fabric and a clean fit. Washed well after several wears.'),
(2, 2, 5, 'Comfortable from day one. Great for morning runs.'),
(1, 6, 4, 'Solid ANC and battery. Slightly tight on long flights.'),
(2, 8, 5, 'Premium look and very comfortable all day.'),
(1, 10, 5, 'Accurate tracking and a bright display outdoors.');
