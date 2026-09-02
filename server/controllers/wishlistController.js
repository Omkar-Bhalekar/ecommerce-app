const { pool } = require('../config/db');
const { success, fail } = require('../utils/response');

exports.getWishlist = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT w.wishlist_id, w.product_id, p.product_name, p.price, p.old_price, p.image_url, p.rating, c.category_name
       FROM wishlist w
       JOIN products p ON p.product_id = w.product_id
       JOIN categories c ON c.category_id = p.category_id
       WHERE w.user_id = ?
       ORDER BY w.wishlist_id DESC`,
      [req.user.user_id]
    );
    return success(res, 'Wishlist loaded', rows);
  } catch (err) {
    console.error(err);
    return fail(res, 'Unable to load wishlist', 500);
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { product_id } = req.body;
    if (!product_id) return fail(res, 'product_id is required');
    await pool.query(
      'INSERT IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)',
      [req.user.user_id, product_id]
    );
    return exports.getWishlist(req, res);
  } catch (err) {
    console.error(err);
    return fail(res, 'Unable to update wishlist', 500);
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    await pool.query('DELETE FROM wishlist WHERE user_id = ? AND product_id = ?', [
      req.user.user_id,
      req.params.productId,
    ]);
    return exports.getWishlist(req, res);
  } catch (err) {
    console.error(err);
    return fail(res, 'Unable to remove from wishlist', 500);
  }
};
