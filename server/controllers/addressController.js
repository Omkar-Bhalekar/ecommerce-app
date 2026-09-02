const { pool } = require('../config/db');
const { success, fail } = require('../utils/response');

exports.listAddresses = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, address_id DESC',
      [req.user.user_id]
    );
    return success(res, 'Addresses loaded', rows);
  } catch (err) {
    console.error(err);
    return fail(res, 'Unable to load addresses', 500);
  }
};

exports.createAddress = async (req, res) => {
  try {
    const { full_name, phone, address_line, apartment, city, state, postal_code, is_default } = req.body;
    if (!full_name || !phone || !address_line || !city || !state || !postal_code) {
      return fail(res, 'Missing required address fields');
    }

    if (is_default) {
      await pool.query('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [req.user.user_id]);
    }

    const [count] = await pool.query('SELECT COUNT(*) AS n FROM addresses WHERE user_id = ?', [req.user.user_id]);
    const makeDefault = is_default || count[0].n === 0;

    const [result] = await pool.query(
      `INSERT INTO addresses (user_id, full_name, phone, address_line, apartment, city, state, postal_code, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.user_id, full_name, phone, address_line, apartment || null, city, state, postal_code, makeDefault ? 1 : 0]
    );
    return success(res, 'Address saved', { address_id: result.insertId }, 201);
  } catch (err) {
    console.error(err);
    return fail(res, 'Unable to save address', 500);
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const { full_name, phone, address_line, apartment, city, state, postal_code, is_default } = req.body;
    if (is_default) {
      await pool.query('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [req.user.user_id]);
    }
    const [result] = await pool.query(
      `UPDATE addresses SET full_name=?, phone=?, address_line=?, apartment=?, city=?, state=?, postal_code=?, is_default=?
       WHERE address_id=? AND user_id=?`,
      [
        full_name,
        phone,
        address_line,
        apartment || null,
        city,
        state,
        postal_code,
        is_default ? 1 : 0,
        req.params.id,
        req.user.user_id,
      ]
    );
    if (!result.affectedRows) return fail(res, 'Address not found', 404);
    return success(res, 'Address updated');
  } catch (err) {
    console.error(err);
    return fail(res, 'Unable to update address', 500);
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM addresses WHERE address_id = ? AND user_id = ?', [
      req.params.id,
      req.user.user_id,
    ]);
    if (!result.affectedRows) return fail(res, 'Address not found', 404);
    return success(res, 'Address deleted');
  } catch (err) {
    console.error(err);
    return fail(res, 'Unable to delete address', 500);
  }
};

exports.setDefault = async (req, res) => {
  try {
    await pool.query('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [req.user.user_id]);
    const [result] = await pool.query(
      'UPDATE addresses SET is_default = 1 WHERE address_id = ? AND user_id = ?',
      [req.params.id, req.user.user_id]
    );
    if (!result.affectedRows) return fail(res, 'Address not found', 404);
    return success(res, 'Default address updated');
  } catch (err) {
    console.error(err);
    return fail(res, 'Unable to set default address', 500);
  }
};
