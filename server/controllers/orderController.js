const { pool } = require('../config/db');
const { success, fail } = require('../utils/response');
const { loadCart, getOrCreateCartId } = require('./cartController');

const ALLOWED_METHODS = ['CARD', 'UPI', 'NET_BANKING', 'WALLET'];

exports.placeOrder = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { address_id, payment_method } = req.body;
    if (!address_id) return fail(res, 'Shipping address is required');
    const method = (payment_method || 'CARD').toUpperCase();
    if (!ALLOWED_METHODS.includes(method)) {
      return fail(res, 'Invalid payment method');
    }

    const [addr] = await conn.query(
      'SELECT address_id FROM addresses WHERE address_id = ? AND user_id = ?',
      [address_id, req.user.user_id]
    );
    if (!addr.length) return fail(res, 'Address not found', 404);

    const cart = await loadCart(req.user.user_id);
    if (!cart.items.length) return fail(res, 'Your cart is empty');

    await conn.beginTransaction();

    for (const item of cart.items) {
      if (item.variant_id) {
        const [vrows] = await conn.query(
          'SELECT stock FROM product_variants WHERE variant_id = ? FOR UPDATE',
          [item.variant_id]
        );
        if (!vrows.length || vrows[0].stock < item.quantity) {
          await conn.rollback();
          return fail(res, `Insufficient stock for ${item.product_name}`);
        }
      }
      const [prows] = await conn.query(
        'SELECT stock FROM products WHERE product_id = ? FOR UPDATE',
        [item.product_id]
      );
      if (!prows.length || prows[0].stock < item.quantity) {
        await conn.rollback();
        return fail(res, `Insufficient stock for ${item.product_name}`);
      }
    }

    const [orderResult] = await conn.query(
      `INSERT INTO orders (user_id, address_id, total_amount, order_status)
       VALUES (?, ?, ?, 'PLACED')`,
      [req.user.user_id, address_id, cart.summary.total]
    );
    const orderId = orderResult.insertId;

    for (const item of cart.items) {
      await conn.query(
        `INSERT INTO order_items (order_id, product_id, variant_id, quantity, price)
         VALUES (?, ?, ?, ?, ?)`,
        [orderId, item.product_id, item.variant_id || null, item.quantity, item.price]
      );
      await conn.query('UPDATE products SET stock = stock - ? WHERE product_id = ?', [
        item.quantity,
        item.product_id,
      ]);
      if (item.variant_id) {
        await conn.query('UPDATE product_variants SET stock = stock - ? WHERE variant_id = ?', [
          item.quantity,
          item.variant_id,
        ]);
      }
    }

    await conn.query(
      `INSERT INTO payments (order_id, payment_method, amount, payment_status)
       VALUES (?, ?, ?, 'SUCCESS')`,
      [orderId, method, cart.summary.total]
    );

    const cartId = await getOrCreateCartId(req.user.user_id);
    await conn.query('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);

    await conn.commit();

    return success(res, 'Order placed successfully', {
      order_id: orderId,
      total_amount: cart.summary.total,
      payment_status: 'SUCCESS',
      payment_method: method,
    }, 201);
  } catch (err) {
    await conn.rollback();
    console.error(err);
    return fail(res, 'Unable to place order', 500);
  } finally {
    conn.release();
  }
};

exports.listOrders = async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT o.*, a.city, a.state
       FROM orders o
       JOIN addresses a ON a.address_id = o.address_id
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`,
      [req.user.user_id]
    );

    if (!orders.length) return success(res, 'Orders loaded', []);

    const ids = orders.map((o) => o.order_id);
    const placeholders = ids.map(() => '?').join(',');
    const [items] = await pool.query(
      `SELECT oi.*, p.product_name, p.image_url, v.size, v.color
       FROM order_items oi
       JOIN products p ON p.product_id = oi.product_id
       LEFT JOIN product_variants v ON v.variant_id = oi.variant_id
       WHERE oi.order_id IN (${placeholders})`,
      ids
    );

    const data = orders.map((o) => ({
      ...o,
      total_amount: Number(o.total_amount),
      items: items.filter((i) => i.order_id === o.order_id),
    }));
    return success(res, 'Orders loaded', data);
  } catch (err) {
    console.error(err);
    return fail(res, 'Unable to load orders', 500);
  }
};

exports.getOrder = async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT o.*, a.full_name, a.phone, a.address_line, a.apartment, a.city, a.state, a.postal_code
       FROM orders o
       JOIN addresses a ON a.address_id = o.address_id
       WHERE o.order_id = ? AND o.user_id = ?`,
      [req.params.id, req.user.user_id]
    );
    if (!orders.length) return fail(res, 'Order not found', 404);

    const [items] = await pool.query(
      `SELECT oi.*, p.product_name, p.image_url, v.size, v.color
       FROM order_items oi
       JOIN products p ON p.product_id = oi.product_id
       LEFT JOIN product_variants v ON v.variant_id = oi.variant_id
       WHERE oi.order_id = ?`,
      [req.params.id]
    );
    const [payments] = await pool.query('SELECT * FROM payments WHERE order_id = ?', [req.params.id]);

    return success(res, 'Order loaded', {
      ...orders[0],
      total_amount: Number(orders[0].total_amount),
      items,
      payment: payments[0] || null,
    });
  } catch (err) {
    console.error(err);
    return fail(res, 'Unable to load order', 500);
  }
};
