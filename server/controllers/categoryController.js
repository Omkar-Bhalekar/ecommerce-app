const { pool } = require('../config/db');
const { success, fail } = require('../utils/response');

exports.listCategories = async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, COUNT(p.product_id) AS product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.category_id
      GROUP BY c.category_id
      ORDER BY c.category_id
    `);
    return success(res, 'Categories loaded', rows);
  } catch (err) {
    console.error(err);
    return fail(res, 'Unable to load categories', 500);
  }
};

exports.getCategory = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories WHERE category_id = ?', [req.params.id]);
    if (!rows.length) return fail(res, 'Category not found', 404);
    return success(res, 'Category loaded', rows[0]);
  } catch (err) {
    console.error(err);
    return fail(res, 'Unable to load category', 500);
  }
};
