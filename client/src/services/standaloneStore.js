import { initialCategories, initialProducts, initialReviews, demoUser } from './mockData';

const STORAGE_KEYS = {
  PRODUCTS: 'ss_standalone_products',
  CATEGORIES: 'ss_standalone_categories',
  REVIEWS: 'ss_standalone_reviews',
  CART: 'ss_standalone_cart',
  WISHLIST: 'ss_standalone_wishlist',
  ORDERS: 'ss_standalone_orders',
  ADDRESSES: 'ss_standalone_addresses',
  BOOKINGS: 'ss_standalone_bookings',
  MESSAGES: 'ss_standalone_messages',
  USERS: 'ss_standalone_users',
};

function getItem(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('LocalStorage write error:', err);
  }
}

export function getProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) return initialProducts;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialProducts;
  } catch {
    return initialProducts;
  }
}

export function getCategories() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!raw) return initialCategories;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialCategories;
  } catch {
    return initialCategories;
  }
}

// Initial hydration - always overwrite if empty
try {
  const p = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (!p || !JSON.parse(p).length) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
  }
  const c = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  if (!c || !JSON.parse(c).length) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(initialCategories));
  }
} catch (e) {
  // ignore
}
if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
  setItem(STORAGE_KEYS.REVIEWS, initialReviews);
}
if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
  setItem(STORAGE_KEYS.USERS, [
    { ...demoUser, password: 'Password123!' },
    { user_id: 2, name: 'Priya Sharma', email: 'priya@shopsphere.com', phone: '9123456780', password: 'Password123!' }
  ]);
}
if (!localStorage.getItem(STORAGE_KEYS.ADDRESSES)) {
  setItem(STORAGE_KEYS.ADDRESSES, [
    {
      address_id: 1,
      user_id: 1,
      full_name: 'Alex Rivera',
      phone: '9876543210',
      address_line: '221B Market Street',
      apartment: 'Apt 4B',
      city: 'San Francisco',
      state: 'CA',
      postal_code: '94103',
      is_default: 1
    }
  ]);
}

function computeCartSummary(items) {
  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 9.99;
  const tax = Number((subtotal * 0.08).toFixed(2));
  const total = Number((subtotal + shipping + tax).toFixed(2));
  return { subtotal: Number(subtotal.toFixed(2)), shipping, tax, total };
}

export async function handleMockRequest(method, url, data, params = {}) {
  // Simulate standard network latency (50-80ms)
  await new Promise((res) => setTimeout(res, 60));

  let queryParams = { ...params };
  let cleanUrl = url.replace(/^\/api/, '');
  if (cleanUrl.includes('?')) {
    const [pathPart, qs] = cleanUrl.split('?');
    cleanUrl = pathPart;
    const sp = new URLSearchParams(qs);
    for (const [k, v] of sp.entries()) {
      queryParams[k] = v;
    }
  }

  // Auth endpoints
  if (cleanUrl === '/auth/login') {
    const users = getItem(STORAGE_KEYS.USERS, []);
    const found = users.find((u) => u.email === data?.email);
    if (!found || found.password !== data?.password) {
      const err = new Error('Invalid credentials');
      err.response = { status: 401, data: { success: false, message: 'Invalid email or password' } };
      throw err;
    }
    const token = 'mock_jwt_token_' + Date.now();
    return { data: { success: true, data: { user: { user_id: found.user_id, name: found.name, email: found.email, phone: found.phone }, token } } };
  }

  if (cleanUrl === '/auth/register') {
    const users = getItem(STORAGE_KEYS.USERS, []);
    const exists = users.some((u) => u.email === data?.email);
    if (exists) {
      const err = new Error('Email already registered');
      err.response = { status: 400, data: { success: false, message: 'Email already registered' } };
      throw err;
    }
    const newUser = {
      user_id: Date.now(),
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      password: data.password
    };
    users.push(newUser);
    setItem(STORAGE_KEYS.USERS, users);
    const token = 'mock_jwt_token_' + Date.now();
    return { data: { success: true, data: { user: { user_id: newUser.user_id, name: newUser.name, email: newUser.email, phone: newUser.phone }, token } } };
  }

  if (cleanUrl === '/auth/me') {
    const rawUser = localStorage.getItem('ss_user');
    const user = rawUser ? JSON.parse(rawUser) : demoUser;
    return { data: { success: true, data: user } };
  }

  // Categories
  if (cleanUrl === '/categories' && method === 'get') {
    const categories = getCategories();
    return { data: { success: true, data: categories } };
  }

  // Products
  if (cleanUrl === '/products/filters' && method === 'get') {
    const products = getProducts();
    const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))];
    const sizes = [...new Set(products.flatMap((p) => (p.variants || []).map((v) => v.size)).filter(Boolean))];
    const colors = [...new Set(products.flatMap((p) => (p.variants || []).map((v) => v.color)).filter(Boolean))];
    return { data: { success: true, data: { brands, sizes, colors } } };
  }

  if (cleanUrl === '/products/search' && method === 'get') {
    const query = (queryParams?.query || queryParams?.search || '').toLowerCase();
    const products = getProducts();
    const results = products.filter(
      (p) =>
        p.product_name.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query)) ||
        (p.brand && p.brand.toLowerCase().includes(query))
    );
    return {
      data: {
        success: true,
        data: {
          items: results,
          pagination: { page: 1, limit: results.length, total: results.length, pages: 1 },
        },
      },
    };
  }

  if (cleanUrl.startsWith('/products/category/') && method === 'get') {
    const categoryId = Number(cleanUrl.split('/')[3]);
    const products = getProducts();
    const results = products.filter((p) => p.category_id === categoryId);
    return {
      data: {
        success: true,
        data: {
          items: results,
          pagination: { page: 1, limit: results.length, total: results.length, pages: 1 },
        },
      },
    };
  }

  if (cleanUrl === '/products' && method === 'get') {
    let products = [...getProducts()];

    if (queryParams?.category) {
      products = products.filter((p) => String(p.category_id) === String(queryParams.category));
    }
    if (queryParams?.brand) {
      products = products.filter((p) => p.brand === queryParams.brand);
    }
    if (queryParams?.minPrice) {
      products = products.filter((p) => p.price >= Number(queryParams.minPrice));
    }
    if (queryParams?.maxPrice) {
      products = products.filter((p) => p.price <= Number(queryParams.maxPrice));
    }
    if (queryParams?.rating) {
      products = products.filter((p) => p.rating >= Number(queryParams.rating));
    }
    if (queryParams?.sort === 'price_asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (queryParams?.sort === 'price_desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (queryParams?.sort === 'rating' || queryParams?.sort === 'popularity') {
      products.sort((a, b) => b.rating - a.rating);
    }

    const page = Number(queryParams?.page) || 1;
    const limit = Number(queryParams?.limit) || 12;
    const start = (page - 1) * limit;
    const paged = products.slice(start, start + limit);

    return {
      data: {
        success: true,
        data: {
          items: paged,
          pagination: {
            page,
            limit,
            total: products.length,
            pages: Math.ceil(products.length / limit) || 1,
          },
        },
      },
    };
  }

  const singleProductMatch = cleanUrl.match(/^\/products\/(\d+)$/);
  if (singleProductMatch && method === 'get') {
    const id = Number(singleProductMatch[1]);
    const products = getItem(STORAGE_KEYS.PRODUCTS, initialProducts);
    const product = products.find((p) => p.product_id === id);
    if (!product) {
      const err = new Error('Product not found');
      err.response = { status: 404, data: { success: false, message: 'Product not found' } };
      throw err;
    }
    const related = products
      .filter((p) => p.category_id === product.category_id && p.product_id !== product.product_id)
      .slice(0, 4);
    return { data: { success: true, data: { ...product, related } } };
  }

  // Reviews
  const reviewsMatch = cleanUrl.match(/^\/reviews\/(\d+)$/);
  if (reviewsMatch && method === 'get') {
    const productId = Number(reviewsMatch[1]);
    const reviews = getItem(STORAGE_KEYS.REVIEWS, initialReviews);
    return { data: { success: true, data: reviews.filter((r) => r.product_id === productId) } };
  }

  if (cleanUrl === '/reviews' && method === 'post') {
    const reviews = getItem(STORAGE_KEYS.REVIEWS, initialReviews);
    const newReview = {
      review_id: Date.now(),
      user_id: 1,
      user_name: 'Alex Rivera',
      product_id: Number(data.product_id),
      rating: Number(data.rating),
      comment: data.comment,
      created_at: new Date().toISOString().split('T')[0],
    };
    reviews.unshift(newReview);
    setItem(STORAGE_KEYS.REVIEWS, reviews);
    return { data: { success: true, data: newReview } };
  }

  // Cart
  if (cleanUrl === '/cart' && method === 'get') {
    const items = getItem(STORAGE_KEYS.CART, []);
    return { data: { success: true, data: { items, summary: computeCartSummary(items) } } };
  }

  if (cleanUrl === '/cart' && method === 'post') {
    const items = getItem(STORAGE_KEYS.CART, []);
    const products = getItem(STORAGE_KEYS.PRODUCTS, initialProducts);
    const product = products.find((p) => p.product_id === Number(data.product_id));

    const existingIndex = items.findIndex(
      (item) => item.product_id === Number(data.product_id) && item.variant_id === data.variant_id
    );

    if (existingIndex > -1) {
      items[existingIndex].quantity += Number(data.quantity) || 1;
    } else {
      const variant = product?.variants?.find((v) => v.variant_id === data.variant_id);
      items.push({
        cart_item_id: Date.now(),
        product_id: product.product_id,
        variant_id: data.variant_id || null,
        product_name: product.product_name,
        price: product.price,
        image_url: product.image_url,
        size: variant?.size || null,
        color: variant?.color || null,
        quantity: Number(data.quantity) || 1,
      });
    }

    setItem(STORAGE_KEYS.CART, items);
    return { data: { success: true, data: { items, summary: computeCartSummary(items) } } };
  }

  const updateCartMatch = cleanUrl.match(/^\/cart\/(\d+)$/);
  if (updateCartMatch && method === 'put') {
    const itemId = Number(updateCartMatch[1]);
    let items = getItem(STORAGE_KEYS.CART, []);
    const item = items.find((i) => i.cart_item_id === itemId);
    if (item) {
      item.quantity = Number(data.quantity);
      if (item.quantity <= 0) {
        items = items.filter((i) => i.cart_item_id !== itemId);
      }
    }
    setItem(STORAGE_KEYS.CART, items);
    return { data: { success: true, data: { items, summary: computeCartSummary(items) } } };
  }

  if (updateCartMatch && method === 'delete') {
    const itemId = Number(updateCartMatch[1]);
    const items = getItem(STORAGE_KEYS.CART, []).filter((i) => i.cart_item_id !== itemId);
    setItem(STORAGE_KEYS.CART, items);
    return { data: { success: true, data: { items, summary: computeCartSummary(items) } } };
  }

  // Wishlist
  if (cleanUrl === '/wishlist' && method === 'get') {
    const wishlist = getItem(STORAGE_KEYS.WISHLIST, []);
    return { data: { success: true, data: wishlist } };
  }

  if (cleanUrl === '/wishlist' && method === 'post') {
    const wishlist = getItem(STORAGE_KEYS.WISHLIST, []);
    const products = getItem(STORAGE_KEYS.PRODUCTS, initialProducts);
    const product = products.find((p) => p.product_id === Number(data.product_id));
    if (product && !wishlist.some((w) => w.product_id === product.product_id)) {
      wishlist.push({
        wishlist_id: Date.now(),
        product_id: product.product_id,
        product_name: product.product_name,
        price: product.price,
        image_url: product.image_url,
        rating: product.rating,
      });
      setItem(STORAGE_KEYS.WISHLIST, wishlist);
    }
    return { data: { success: true, data: wishlist } };
  }

  const deleteWishlistMatch = cleanUrl.match(/^\/wishlist\/(\d+)$/);
  if (deleteWishlistMatch && method === 'delete') {
    const productId = Number(deleteWishlistMatch[1]);
    const wishlist = getItem(STORAGE_KEYS.WISHLIST, []).filter((w) => w.product_id !== productId);
    setItem(STORAGE_KEYS.WISHLIST, wishlist);
    return { data: { success: true, data: wishlist } };
  }

  // Addresses
  if (cleanUrl === '/addresses' && method === 'get') {
    const addresses = getItem(STORAGE_KEYS.ADDRESSES, []);
    return { data: { success: true, data: addresses } };
  }

  if (cleanUrl === '/addresses' && method === 'post') {
    const addresses = getItem(STORAGE_KEYS.ADDRESSES, []);
    const newAddress = {
      address_id: Date.now(),
      user_id: 1,
      ...data,
      is_default: addresses.length === 0 ? 1 : data.is_default ? 1 : 0,
    };
    if (newAddress.is_default) {
      addresses.forEach((a) => (a.is_default = 0));
    }
    addresses.push(newAddress);
    setItem(STORAGE_KEYS.ADDRESSES, addresses);
    return { data: { success: true, data: newAddress } };
  }

  const addressMatch = cleanUrl.match(/^\/addresses\/(\d+)$/);
  if (addressMatch && method === 'put') {
    const addressId = Number(addressMatch[1]);
    const addresses = getItem(STORAGE_KEYS.ADDRESSES, []);
    const index = addresses.findIndex((a) => a.address_id === addressId);
    if (index > -1) {
      if (data.is_default) {
        addresses.forEach((a) => (a.is_default = 0));
      }
      addresses[index] = { ...addresses[index], ...data };
      setItem(STORAGE_KEYS.ADDRESSES, addresses);
    }
    return { data: { success: true, data: addresses[index] } };
  }

  if (addressMatch && method === 'delete') {
    const addressId = Number(addressMatch[1]);
    const addresses = getItem(STORAGE_KEYS.ADDRESSES, []).filter((a) => a.address_id !== addressId);
    setItem(STORAGE_KEYS.ADDRESSES, addresses);
    return { data: { success: true, message: 'Address removed' } };
  }

  // Orders & Payments
  if (cleanUrl === '/orders' && method === 'get') {
    const orders = getItem(STORAGE_KEYS.ORDERS, []);
    return { data: { success: true, data: orders } };
  }

  const singleOrderMatch = cleanUrl.match(/^\/orders\/(\d+)$/);
  if (singleOrderMatch && method === 'get') {
    const id = Number(singleOrderMatch[1]);
    const orders = getItem(STORAGE_KEYS.ORDERS, []);
    const order = orders.find((o) => Number(o.order_id) === id);
    if (!order) {
      const fallbackOrder = orders[0] || {
        order_id: id,
        user_id: 1,
        full_name: 'Alex Rivera',
        phone: '9876543210',
        address_line: '221B Market Street',
        apartment: 'Apt 4B',
        city: 'San Francisco',
        state: 'CA',
        postal_code: '94103',
        total_amount: 59.99,
        order_status: 'CONFIRMED',
        payment: { payment_method: 'WALLET', payment_status: 'SUCCESS' },
        created_at: new Date().toISOString(),
        items: [
          {
            order_item_id: 1,
            product_name: 'Classic Running Shoes',
            price: 59.99,
            quantity: 1,
            size: '9',
            color: 'Black',
          },
        ],
      };
      return { data: { success: true, data: fallbackOrder } };
    }
    return { data: { success: true, data: order } };
  }

  if (cleanUrl === '/orders' && method === 'post') {
    const cartItems = getItem(STORAGE_KEYS.CART, []);
    const summary = computeCartSummary(cartItems);
    const orders = getItem(STORAGE_KEYS.ORDERS, []);
    const addresses = getItem(STORAGE_KEYS.ADDRESSES, []);
    const address =
      addresses.find((a) => a.address_id === Number(data.address_id)) ||
      addresses[0] || {
        full_name: 'Alex Rivera',
        phone: '9876543210',
        address_line: '221B Market Street',
        apartment: 'Apt 4B',
        city: 'San Francisco',
        state: 'CA',
        postal_code: '94103',
      };

    const newOrder = {
      order_id: Math.floor(100000 + Math.random() * 900000),
      user_id: 1,
      address_id: data.address_id,
      full_name: address.full_name,
      phone: address.phone,
      address_line: address.address_line,
      apartment: address.apartment,
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      total_amount: summary.total || 59.99,
      order_status: 'CONFIRMED',
      payment: {
        payment_method: data.payment_method || 'WALLET',
        payment_status: 'SUCCESS',
      },
      created_at: new Date().toISOString(),
      items:
        cartItems.length > 0
          ? cartItems.map((item, idx) => ({
              order_item_id: Date.now() + idx,
              product_id: item.product_id,
              product_name: item.product_name,
              image_url: item.image_url,
              price: item.price,
              quantity: item.quantity,
              size: item.size,
              color: item.color,
            }))
          : [
              {
                order_item_id: Date.now(),
                product_id: 1,
                product_name: 'Premium Casual Cotton Shirt',
                image_url:
                  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800',
                price: 29.99,
                quantity: 1,
                size: 'M',
                color: 'White',
              },
            ],
    };

    orders.unshift(newOrder);
    setItem(STORAGE_KEYS.ORDERS, orders);
    setItem(STORAGE_KEYS.CART, []); // clear cart
    return { data: { success: true, data: newOrder } };
  }

  if (cleanUrl === '/payments/simulate' && method === 'post') {
    return { data: { success: true, message: 'Payment processed successfully', data: { transaction_id: 'TXN_' + Date.now(), status: 'SUCCESS' } } };
  }

  // Bookings & Messages
  if (cleanUrl === '/bookings' && method === 'post') {
    const bookings = getItem(STORAGE_KEYS.BOOKINGS, []);
    const newBooking = { booking_id: Date.now(), ...data, booking_status: 'CONFIRMED' };
    bookings.push(newBooking);
    setItem(STORAGE_KEYS.BOOKINGS, bookings);
    return { data: { success: true, data: newBooking } };
  }

  if (cleanUrl === '/bookings' && method === 'get') {
    const bookings = getItem(STORAGE_KEYS.BOOKINGS, []);
    return { data: { success: true, data: bookings } };
  }

  if (cleanUrl === '/messages' && method === 'post') {
    const messages = getItem(STORAGE_KEYS.MESSAGES, []);
    const newMsg = { message_id: Date.now(), ...data, created_at: new Date().toISOString() };
    messages.push(newMsg);
    setItem(STORAGE_KEYS.MESSAGES, messages);
    return { data: { success: true, message: 'Message sent successfully' } };
  }

  // Default fallback
  return { data: { success: true, message: 'Mock response', data: {} } };
}
