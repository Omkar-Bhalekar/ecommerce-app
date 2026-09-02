const { pool } = require('../config/db');
const { success, fail } = require('../utils/response');

const TAX_RATE = 0.08;
const FREE_SHIPPING_OVER = 75;
const SHIPPING_FLAT = 6.99;

async function getOrCreateCartId(userId) {
  const [rows] = await pool.query('SELECT cart_id FROM carts WHERE user_id = ?', [userId]);
  if (rows.length) return rows[0].cart_id;
  const [result] = await pool.query('INSERT INTO carts (user_id) VALUES (?)', [userId]);
  return result.insertId;
}

function totals(items) {
  const subtotal = items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FLAT;
  const tax = Number((subtotal * TAX_RATE).toFixed(2));
  const total = Number((subtotal + shipping + tax).toFixed(2));
  return {
    subtotal: Number(subtotal.toFixed(2)),
    shipping,
    tax,
    total,
  };
}

async function loadCart(userId) {
  const cartId = await getOrCreateCartId(userId);
  const [items] = await pool.query(
    `SELECT ci.cart_item_id, ci.product_id, ci.variant_id, ci.quantity,
            p.product_name, p.image_url, p.price, p.stock AS product_stock,
            v.size, v.color, v.stock AS variant_stock
     FROM cart_items ci
     JOIN products p ON p.product_id = ci.product_id
     LEFT JOIN product_variants v ON v.variant_id = ci.variant_id
     WHERE ci.cart_id = ?`,
    [cartId]
  );
  return { cartId, items, summary: totals(items) };
}

exports.getCart = async (req, res) => {
  try {
    const cart = await loadCart(req.user.user_id);
    return success(res, 'Cart loaded', cart);
  } catch (err) {
    console.error(err);
    return fail(res, 'Unable to load cart', 500);
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { product_id, variant_id, quantity = 1 } = req.body;
    if (!product_id) return fail(res, 'product_id is required');

    const qty = Math.max(1, Number(quantity) || 1);
    const cartId = await getOrCreateCartId(req.user.user_id);

    const [existing] = await pool.query(
      `SELECT cart_item_id, quantity FROM cart_items
       WHERE cart_id = ? AND product_id = ? AND (variant_id <=> ?)`,
      [cartId, product_id, variant_id || null]
    );

    if (existing.length) {
      await pool.query('UPDATE cart_items SET quantity = quantity + ? WHERE cart_item_id = ?', [
        qty,
        existing[0].cart_item_id,
      ]);
    } else {
      await pool.query(
        'INSERT INTO cart_items (cart_id, product_id, variant_id, quantity) VALUES (?, ?, ?, ?)',
        [cartId, product_id, variant_id || null, qty]
      );
    }

    const cart = await loadCart(req.user.user_id);
    return success(res, 'Added to cart', cart);
  } catch (err) {
    console.error(err);
    return fail(res, 'Unable to add to cart', 500);
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const qty = Number(req.body.quantity);
    if (!Number.isInteger(qty) || qty < 1) {
      return fail(res, 'Quantity must be at least 1');
    }

    const cartId = await getOrCreateCartId(req.user.user_id);
    const [result] = await pool.query(
      'UPDATE cart_items SET quantity = ? WHERE cart_item_id = ? AND cart_id = ?',
      [qty, req.params.itemId, cartId]
    );
    if (!result.affectedRows) return fail(res, 'Cart item not found', 404);

    const cart = await loadCart(req.user.user_id);
    return success(res, 'Cart updated', cart);
  } catch (err) {
    console.error(err);
    return fail(res, 'Unable to update cart', 500);
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const cartId = await getOrCreateCartId(req.user.user_id);
    const [result] = await pool.query(
      'DELETE FROM cart_items WHERE cart_item_id = ? AND cart_id = ?',
      [req.params.itemId, cartId]
    );
    if (!result.affectedRows) return fail(res, 'Cart item not found', 404);
    const cart = await loadCart(req.user.user_id);
    return success(res, 'Item removed', cart);
  } catch (err) {
    console.error(err);
    return fail(res, 'Unable to remove item', 500);
  }
};

exports.loadCart = loadCart;
exports.totals = totals;
exports.getOrCreateCartId = getOrCreateCartId;
