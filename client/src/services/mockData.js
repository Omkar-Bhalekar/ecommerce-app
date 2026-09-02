export const initialCategories = [
  { category_id: 1, category_name: 'Men', image_url: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800' },
  { category_id: 2, category_name: 'Women', image_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800' },
  { category_id: 3, category_name: 'Footwear', image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800' },
  { category_id: 4, category_name: 'Bags', image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800' },
  { category_id: 5, category_name: 'Watches', image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800' },
  { category_id: 6, category_name: 'Electronics', image_url: 'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?w=800' },
];

export const initialProducts = [
  {
    product_id: 1,
    category_id: 1,
    category_name: 'Men',
    product_name: 'Premium Casual Cotton Shirt',
    description: 'Breathable cotton shirt with a tailored fit. Ideal for everyday wear and smart-casual looks.',
    price: 29.99,
    old_price: 44.99,
    stock: 80,
    rating: 4.5,
    total_reviews: 128,
    image_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800',
    images: [
      { image_id: 1, image_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800' },
      { image_id: 101, image_url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800' }
    ],
    variants: [
      { variant_id: 1, size: 'S', color: 'White', stock: 20 },
      { variant_id: 2, size: 'M', color: 'White', stock: 25 },
      { variant_id: 3, size: 'L', color: 'Navy', stock: 20 },
      { variant_id: 4, size: 'XL', color: 'Navy', stock: 15 }
    ],
    brand: 'NovaWear',
    created_at: '2026-01-01T00:00:00.000Z'
  },
  {
    product_id: 2,
    category_id: 3,
    category_name: 'Footwear',
    product_name: 'Classic Running Shoes',
    description: 'Lightweight running shoes with responsive cushioning and a grippy outsole for daily training.',
    price: 59.99,
    old_price: 79.99,
    stock: 60,
    rating: 4.6,
    total_reviews: 210,
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
    images: [
      { image_id: 2, image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800' },
      { image_id: 102, image_url: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800' }
    ],
    variants: [
      { variant_id: 5, size: '8', color: 'Black', stock: 15 },
      { variant_id: 6, size: '9', color: 'Black', stock: 20 },
      { variant_id: 7, size: '10', color: 'White', stock: 15 },
      { variant_id: 8, size: '11', color: 'White', stock: 10 }
    ],
    brand: 'StrideLab',
    created_at: '2026-01-02T00:00:00.000Z'
  },
  {
    product_id: 3,
    category_id: 4,
    category_name: 'Bags',
    product_name: 'Leather Shoulder Bag',
    description: 'Full-grain leather shoulder bag with multiple compartments and an adjustable strap.',
    price: 49.99,
    old_price: 69.99,
    stock: 40,
    rating: 4.4,
    total_reviews: 76,
    image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800',
    images: [{ image_id: 3, image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800' }],
    variants: [
      { variant_id: 9, size: 'One Size', color: 'Tan', stock: 20 },
      { variant_id: 10, size: 'One Size', color: 'Black', stock: 20 }
    ],
    brand: 'Atelier',
    created_at: '2026-01-03T00:00:00.000Z'
  },
  {
    product_id: 4,
    category_id: 5,
    category_name: 'Watches',
    product_name: 'Minimalist Wrist Watch',
    description: 'Slim analog watch with a stainless-steel case and sapphire-coated crystal.',
    price: 89.99,
    old_price: 119.99,
    stock: 35,
    rating: 4.7,
    total_reviews: 94,
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
    images: [{ image_id: 4, image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800' }],
    variants: [
      { variant_id: 11, size: 'One Size', color: 'Silver', stock: 18 },
      { variant_id: 12, size: 'One Size', color: 'Gold', stock: 17 }
    ],
    brand: 'Aether',
    created_at: '2026-01-04T00:00:00.000Z'
  },
  {
    product_id: 5,
    category_id: 2,
    category_name: 'Women',
    product_name: "Women's Summer Dress",
    description: 'Flowing midi dress in a lightweight fabric, designed for warm-weather comfort.',
    price: 45.99,
    old_price: 59.99,
    stock: 50,
    rating: 4.5,
    total_reviews: 142,
    image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
    images: [
      { image_id: 5, image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800' },
      { image_id: 103, image_url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800' }
    ],
    variants: [
      { variant_id: 13, size: 'S', color: 'Blue', stock: 15 },
      { variant_id: 14, size: 'M', color: 'Blue', stock: 20 },
      { variant_id: 15, size: 'L', color: 'Coral', stock: 15 }
    ],
    brand: 'Lumen',
    created_at: '2026-01-05T00:00:00.000Z'
  },
  {
    product_id: 6,
    category_id: 6,
    category_name: 'Electronics',
    product_name: 'Wireless Headphones',
    description: 'Over-ear Bluetooth headphones with active noise cancellation and 30-hour battery life.',
    price: 79.99,
    old_price: 109.99,
    stock: 70,
    rating: 4.6,
    total_reviews: 301,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    images: [
      { image_id: 6, image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800' },
      { image_id: 104, image_url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800' }
    ],
    variants: [
      { variant_id: 16, size: 'One Size', color: 'Black', stock: 40 },
      { variant_id: 17, size: 'One Size', color: 'White', stock: 30 }
    ],
    brand: 'Pulse',
    created_at: '2026-01-06T00:00:00.000Z'
  },
  {
    product_id: 7,
    category_id: 1,
    category_name: 'Men',
    product_name: 'Denim Jacket',
    description: 'Classic denim jacket with a slightly oversized cut and durable stitching.',
    price: 64.99,
    old_price: 84.99,
    stock: 45,
    rating: 4.3,
    total_reviews: 88,
    image_url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800',
    images: [{ image_id: 7, image_url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800' }],
    variants: [
      { variant_id: 18, size: 'M', color: 'Blue', stock: 15 },
      { variant_id: 19, size: 'L', color: 'Blue', stock: 15 },
      { variant_id: 20, size: 'XL', color: 'Black', stock: 15 }
    ],
    brand: 'NovaWear',
    created_at: '2026-01-07T00:00:00.000Z'
  },
  {
    product_id: 8,
    category_id: 3,
    category_name: 'Footwear',
    product_name: 'Premium Sneakers',
    description: 'Everyday sneakers with a clean silhouette, cushioned insole, and rubber cupsole.',
    price: 89.99,
    old_price: 109.99,
    stock: 55,
    rating: 4.8,
    total_reviews: 190,
    image_url: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800',
    images: [
      { image_id: 8, image_url: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800' },
      { image_id: 105, image_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800' }
    ],
    variants: [
      { variant_id: 21, size: '8', color: 'White', stock: 15 },
      { variant_id: 22, size: '9', color: 'White', stock: 20 },
      { variant_id: 23, size: '10', color: 'Black', stock: 20 }
    ],
    brand: 'StrideLab',
    created_at: '2026-01-08T00:00:00.000Z'
  },
  {
    product_id: 9,
    category_id: 4,
    category_name: 'Bags',
    product_name: 'Leather Wallet',
    description: 'Compact bifold wallet in genuine leather with RFID lining.',
    price: 24.99,
    old_price: 34.99,
    stock: 120,
    rating: 4.4,
    total_reviews: 67,
    image_url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800',
    images: [{ image_id: 9, image_url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800' }],
    variants: [
      { variant_id: 24, size: 'One Size', color: 'Brown', stock: 60 },
      { variant_id: 25, size: 'One Size', color: 'Black', stock: 60 }
    ],
    brand: 'Atelier',
    created_at: '2026-01-09T00:00:00.000Z'
  },
  {
    product_id: 10,
    category_id: 5,
    category_name: 'Watches',
    product_name: 'Smart Watch Pro',
    description: 'Fitness-focused smartwatch with heart-rate tracking, GPS, and a vibrant AMOLED display.',
    price: 129.99,
    old_price: 169.99,
    stock: 40,
    rating: 4.7,
    total_reviews: 256,
    image_url: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800',
    images: [
      { image_id: 10, image_url: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800' },
      { image_id: 106, image_url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800' }
    ],
    variants: [
      { variant_id: 26, size: 'One Size', color: 'Black', stock: 20 },
      { variant_id: 27, size: 'One Size', color: 'Silver', stock: 20 }
    ],
    brand: 'Pulse',
    created_at: '2026-01-10T00:00:00.000Z'
  },
  {
    product_id: 11,
    category_id: 1,
    category_name: 'Men',
    product_name: 'Slim Fit Chinos',
    description: 'Stretch cotton chinos with a tapered leg and clean front pockets.',
    price: 39.99,
    old_price: 54.99,
    stock: 90,
    rating: 4.2,
    total_reviews: 54,
    image_url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800',
    images: [{ image_id: 11, image_url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800' }],
    variants: [
      { variant_id: 28, size: '30', color: 'Khaki', stock: 30 },
      { variant_id: 29, size: '32', color: 'Navy', stock: 30 },
      { variant_id: 30, size: '34', color: 'Khaki', stock: 30 }
    ],
    brand: 'NovaWear',
    created_at: '2026-01-11T00:00:00.000Z'
  },
  {
    product_id: 12,
    category_id: 2,
    category_name: 'Women',
    product_name: 'Floral Maxi Dress',
    description: 'Printed maxi dress with a cinched waist and breezy silhouette.',
    price: 54.99,
    old_price: 74.99,
    stock: 38,
    rating: 4.6,
    total_reviews: 101,
    image_url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800',
    images: [{ image_id: 12, image_url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800' }],
    variants: [
      { variant_id: 31, size: 'S', color: 'Pink', stock: 12 },
      { variant_id: 32, size: 'M', color: 'Pink', stock: 14 },
      { variant_id: 33, size: 'L', color: 'Ivory', stock: 12 }
    ],
    brand: 'Lumen',
    created_at: '2026-01-12T00:00:00.000Z'
  },
  {
    product_id: 13,
    category_id: 4,
    category_name: 'Bags',
    product_name: 'Crossbody Mini Bag',
    description: 'Compact crossbody with a structured shape and gold-tone hardware.',
    price: 34.99,
    old_price: 44.99,
    stock: 65,
    rating: 4.3,
    total_reviews: 49,
    image_url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800',
    images: [{ image_id: 13, image_url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800' }],
    variants: [
      { variant_id: 34, size: 'One Size', color: 'Black', stock: 35 },
      { variant_id: 35, size: 'One Size', color: 'Cream', stock: 30 }
    ],
    brand: 'Atelier',
    created_at: '2026-01-13T00:00:00.000Z'
  },
  {
    product_id: 14,
    category_id: 5,
    category_name: 'Watches',
    product_name: 'Chronograph Watch',
    description: 'Sport chronograph with a tachymeter bezel and date window.',
    price: 149.99,
    old_price: 189.99,
    stock: 22,
    rating: 4.8,
    total_reviews: 73,
    image_url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800',
    images: [{ image_id: 14, image_url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800' }],
    variants: [
      { variant_id: 36, size: 'One Size', color: 'Black', stock: 12 },
      { variant_id: 37, size: 'One Size', color: 'Blue', stock: 10 }
    ],
    brand: 'Aether',
    created_at: '2026-01-14T00:00:00.000Z'
  },
  {
    product_id: 15,
    category_id: 6,
    category_name: 'Electronics',
    product_name: 'Bluetooth Speaker',
    description: 'Portable waterproof speaker with 360° sound and 12-hour playtime.',
    price: 44.99,
    old_price: 59.99,
    stock: 85,
    rating: 4.5,
    total_reviews: 188,
    image_url: 'https://images.unsplash.com/photo-1608043152269-423dbba4d8e4?w=800',
    images: [{ image_id: 15, image_url: 'https://images.unsplash.com/photo-1608043152269-423dbba4d8e4?w=800' }],
    variants: [
      { variant_id: 38, size: 'One Size', color: 'Blue', stock: 45 },
      { variant_id: 39, size: 'One Size', color: 'Black', stock: 40 }
    ],
    brand: 'Pulse',
    created_at: '2026-01-15T00:00:00.000Z'
  },
  {
    product_id: 16,
    category_id: 3,
    category_name: 'Footwear',
    product_name: 'Oxford Dress Shoes',
    description: 'Polished leather oxfords with a stacked heel and leather lining.',
    price: 99.99,
    old_price: 129.99,
    stock: 28,
    rating: 4.4,
    total_reviews: 41,
    image_url: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800',
    images: [{ image_id: 16, image_url: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800' }],
    variants: [
      { variant_id: 40, size: '8', color: 'Brown', stock: 8 },
      { variant_id: 41, size: '9', color: 'Brown', stock: 10 },
      { variant_id: 42, size: '10', color: 'Black', stock: 10 }
    ],
    brand: 'StrideLab',
    created_at: '2026-01-16T00:00:00.000Z'
  },
  {
    product_id: 17,
    category_id: 1,
    category_name: 'Men',
    product_name: 'Linen Blend Shirt',
    description: 'Relaxed linen-blend shirt for warm days and weekend travel.',
    price: 34.99,
    old_price: 49.99,
    stock: 72,
    rating: 4.1,
    total_reviews: 33,
    image_url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800',
    images: [{ image_id: 17, image_url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800' }],
    variants: [
      { variant_id: 43, size: 'M', color: 'Beige', stock: 24 },
      { variant_id: 44, size: 'L', color: 'White', stock: 24 },
      { variant_id: 45, size: 'XL', color: 'Beige', stock: 24 }
    ],
    brand: 'NovaWear',
    created_at: '2026-01-17T00:00:00.000Z'
  },
  {
    product_id: 18,
    category_id: 2,
    category_name: 'Women',
    product_name: 'High-Waist Jeans',
    description: 'High-rise straight jeans with a comfortable stretch denim blend.',
    price: 49.99,
    old_price: 69.99,
    stock: 58,
    rating: 4.5,
    total_reviews: 119,
    image_url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800',
    images: [{ image_id: 18, image_url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800' }],
    variants: [
      { variant_id: 46, size: '26', color: 'Indigo', stock: 18 },
      { variant_id: 47, size: '28', color: 'Indigo', stock: 20 },
      { variant_id: 48, size: '30', color: 'Black', stock: 20 }
    ],
    brand: 'Lumen',
    created_at: '2026-01-18T00:00:00.000Z'
  },
  {
    product_id: 19,
    category_id: 4,
    category_name: 'Bags',
    product_name: 'Laptop Backpack',
    description: 'Padded 15-inch laptop backpack with USB charging port and water-resistant shell.',
    price: 59.99,
    old_price: 79.99,
    stock: 47,
    rating: 4.6,
    total_reviews: 162,
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
    images: [{ image_id: 19, image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800' }],
    variants: [
      { variant_id: 49, size: 'One Size', color: 'Grey', stock: 25 },
      { variant_id: 50, size: 'One Size', color: 'Navy', stock: 22 }
    ],
    brand: 'Atelier',
    created_at: '2026-01-19T00:00:00.000Z'
  },
  {
    product_id: 20,
    category_id: 6,
    category_name: 'Electronics',
    product_name: 'Wireless Earbuds',
    description: 'True wireless earbuds with touch controls and a compact charging case.',
    price: 54.99,
    old_price: 79.99,
    stock: 110,
    rating: 4.4,
    total_reviews: 240,
    image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800',
    images: [{ image_id: 20, image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800' }],
    variants: [
      { variant_id: 51, size: 'One Size', color: 'White', stock: 55 },
      { variant_id: 52, size: 'One Size', color: 'Black', stock: 55 }
    ],
    brand: 'Pulse',
    created_at: '2026-01-20T00:00:00.000Z'
  },
  {
    product_id: 21,
    category_id: 3,
    category_name: 'Footwear',
    product_name: 'Ankle Boots',
    description: 'Suede ankle boots with a block heel and side zip for easy wear.',
    price: 79.99,
    old_price: 99.99,
    stock: 32,
    rating: 4.3,
    total_reviews: 58,
    image_url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800',
    images: [{ image_id: 21, image_url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800' }],
    variants: [
      { variant_id: 53, size: '7', color: 'Tan', stock: 10 },
      { variant_id: 54, size: '8', color: 'Tan', stock: 12 },
      { variant_id: 55, size: '9', color: 'Black', stock: 10 }
    ],
    brand: 'StrideLab',
    created_at: '2026-01-21T00:00:00.000Z'
  },
  {
    product_id: 22,
    category_id: 2,
    category_name: 'Women',
    product_name: 'Knit Cardigan',
    description: 'Soft merino-blend cardigan with ribbed cuffs and a relaxed drape.',
    price: 42.99,
    old_price: 58.99,
    stock: 44,
    rating: 4.2,
    total_reviews: 37,
    image_url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800',
    images: [{ image_id: 22, image_url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800' }],
    variants: [
      { variant_id: 56, size: 'S', color: 'Cream', stock: 14 },
      { variant_id: 57, size: 'M', color: 'Grey', stock: 16 },
      { variant_id: 58, size: 'L', color: 'Cream', stock: 14 }
    ],
    brand: 'Lumen',
    created_at: '2026-01-22T00:00:00.000Z'
  },
  {
    product_id: 23,
    category_id: 6,
    category_name: 'Electronics',
    product_name: '4K Action Camera',
    description: 'Compact action camera with 4K recording, image stabilization, and waterproof housing.',
    price: 199.99,
    old_price: 249.99,
    stock: 18,
    rating: 4.7,
    total_reviews: 91,
    image_url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800',
    images: [{ image_id: 23, image_url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800' }],
    variants: [{ variant_id: 59, size: 'One Size', color: 'Black', stock: 18 }],
    brand: 'Pulse',
    created_at: '2026-01-23T00:00:00.000Z'
  },
  {
    product_id: 24,
    category_id: 1,
    category_name: 'Men',
    product_name: 'Merino Wool Sweater',
    description: 'Fine-gauge merino sweater that layers easily through cooler months.',
    price: 69.99,
    old_price: 89.99,
    stock: 36,
    rating: 4.6,
    total_reviews: 64,
    image_url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800',
    images: [{ image_id: 24, image_url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800' }],
    variants: [
      { variant_id: 60, size: 'M', color: 'Charcoal', stock: 12 },
      { variant_id: 61, size: 'L', color: 'Navy', stock: 12 },
      { variant_id: 62, size: 'XL', color: 'Charcoal', stock: 12 }
    ],
    brand: 'NovaWear',
    created_at: '2026-01-24T00:00:00.000Z'
  }
];

export const initialReviews = [
  { review_id: 1, user_id: 1, user_name: 'Alex Rivera', product_id: 1, rating: 5, comment: 'Excellent fabric and a clean fit. Washed well after several wears.', created_at: '2026-02-01' },
  { review_id: 2, user_id: 2, user_name: 'Priya Sharma', product_id: 2, rating: 5, comment: 'Comfortable from day one. Great for morning runs.', created_at: '2026-02-02' },
  { review_id: 3, user_id: 1, user_name: 'Alex Rivera', product_id: 6, rating: 4, comment: 'Solid ANC and battery. Slightly tight on long flights.', created_at: '2026-02-03' },
  { review_id: 4, user_id: 2, user_name: 'Priya Sharma', product_id: 8, rating: 5, comment: 'Premium look and very comfortable all day.', created_at: '2026-02-04' },
  { review_id: 5, user_id: 1, user_name: 'Alex Rivera', product_id: 10, rating: 5, comment: 'Accurate tracking and a bright display outdoors.', created_at: '2026-02-05' }
];

export const demoUser = {
  user_id: 1,
  name: 'Alex Rivera',
  email: 'alex@shopsphere.com',
  phone: '9876543210'
};
