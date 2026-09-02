const { pool } = require('../config/db');
const { success, fail } = require('../utils/response');

exports.listReviews = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.*, u.name
       FROM reviews r
       JOIN users u ON u.user_id = r.user_id
       WHERE r.product_id = ?
       ORDER BY r.created_at DESC`,
      [req.params.productId]
    );
    return success(res, 'Reviews loaded', rows);
  } catch (err) {
    console.error(err);
    return fail(res, 'Unable to load reviews', 500);
  }
};

exports.createReview = async (req, res) => {
  try {
    const { product_id, rating, comment } = req.body;
    const stars = Number(rating);
    if (!product_id || !stars || stars < 1 || stars > 5) {
      return fail(res, 'Valid product_id and rating (1-5) are required');
    }

    await pool.query(
      'INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)',
      [req.user.user_id, product_id, stars, comment || '']
    );

    const [[agg]] = await pool.query(
      'SELECT AVG(rating) AS avg_rating, COUNT(*) AS total FROM reviews WHERE product_id = ?',
      [product_id]
    );
    await pool.query('UPDATE products SET rating = ?, total_reviews = ? WHERE product_id = ?', [
      Number(agg.avg_rating).toFixed(2),
      agg.total,
      product_id,
    ]);

    return success(res, 'Review submitted', null, 201);
  } catch (err) {
    console.error(err);
    return fail(res, 'Unable to submit review', 500);
  }
};
