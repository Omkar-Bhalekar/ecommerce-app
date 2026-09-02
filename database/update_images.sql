-- ShopSphere: better-matching product/category images
-- Run this AFTER the main ecommerce.sql has already been imported.
-- Usage: mysql -u root -p ecommerce_db < database/update_images.sql
-- (PowerShell: Get-Content database\update_images.sql | mysql -u root -p ecommerce_db)

USE ecommerce_db;

-- Categories
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1624835567150-0c530a20d8cc?w=800'
  WHERE category_name = 'Men';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1613966570650-add3cf83aa83?w=800'
  WHERE category_name = 'Women';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800'
  WHERE category_name = 'Footwear';

-- Products
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1602810316693-3667c854239a?w=800'
  WHERE product_name = 'Premium Casual Cotton Shirt';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800'
  WHERE product_name = 'Classic Running Shoes';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800'
  WHERE product_name = 'Premium Sneakers';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1613966570650-add3cf83aa83?w=800'
  WHERE product_name = 'Women''s Summer Dress';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1602303894456-398ce544d90b?w=800'
  WHERE product_name = 'Floral Maxi Dress';

-- Pexels-sourced images (different site from Unsplash, reduces overlap with other submissions)
UPDATE products SET image_url = 'https://images.pexels.com/photos/29359836/pexels-photo-29359836.jpeg?w=800'
  WHERE product_name = 'Leather Shoulder Bag';
UPDATE products SET image_url = 'https://images.pexels.com/photos/1682821/pexels-photo-1682821.jpeg?w=800'
  WHERE product_name = 'Smart Watch Pro';
UPDATE products SET image_url = 'https://images.pexels.com/photos/17060730/pexels-photo-17060730.jpeg?w=800'
  WHERE product_name = 'Chronograph Watch';
UPDATE products SET image_url = 'https://images.pexels.com/photos/3394665/pexels-photo-3394665.jpeg?w=800'
  WHERE product_name = 'Wireless Headphones';

-- Keep product_images table's primary image row in sync for the products above
UPDATE product_images pi
JOIN products p ON p.product_id = pi.product_id
SET pi.image_url = p.image_url
WHERE p.product_name IN (
  'Premium Casual Cotton Shirt', 'Classic Running Shoes', 'Premium Sneakers',
  'Women''s Summer Dress', 'Floral Maxi Dress', 'Leather Shoulder Bag',
  'Smart Watch Pro', 'Chronograph Watch', 'Wireless Headphones'
)
AND pi.image_url IN (
  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
  'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800',
  'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
  'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800',
  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800',
  'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800',
  'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'
);
