const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const { success, fail } = require('../utils/response');

function signToken(user) {
  return jwt.sign(
    { user_id: user.user_id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

function publicUser(row) {
  return {
    user_id: row.user_id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    created_at: row.created_at,
  };
}

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
      return fail(res, 'Name, email and password are required');
    }
    if (password.length < 6) {
      return fail(res, 'Password must be at least 6 characters');
    }
    if (confirmPassword && password !== confirmPassword) {
      return fail(res, 'Passwords do not match');
    }

    const [existing] = await pool.query('SELECT user_id FROM users WHERE email = ?', [email]);
    if (existing.length) {
      return fail(res, 'Email is already registered', 409);
    }

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)',
      [name.trim(), email.trim().toLowerCase(), phone || null, hashed]
    );

    const [rows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [result.insertId]);
    const user = publicUser(rows[0]);
    const token = signToken(user);
    return success(res, 'Registration successful', { user, token }, 201);
  } catch (err) {
    console.error(err);
    return fail(res, 'Unable to register user', 500);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return fail(res, 'Email and password are required');
    }

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email.trim().toLowerCase()]);
    if (!rows.length) {
      return fail(res, 'Invalid email or password', 401);
    }

    const userRow = rows[0];
    const match = await bcrypt.compare(password, userRow.password);
    if (!match) {
      return fail(res, 'Invalid email or password', 401);
    }

    const user = publicUser(userRow);
    const token = signToken(user);
    return success(res, 'Login successful', { user, token });
  } catch (err) {
    console.error(err);
    return fail(res, 'Unable to login', 500);
  }
};

exports.me = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT user_id, name, email, phone, created_at FROM users WHERE user_id = ?',
      [req.user.user_id]
    );
    if (!rows.length) return fail(res, 'User not found', 404);
    return success(res, 'Profile loaded', rows[0]);
  } catch (err) {
    console.error(err);
    return fail(res, 'Unable to load profile', 500);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    await pool.query('UPDATE users SET name = ?, phone = ? WHERE user_id = ?', [
      name,
      phone,
      req.user.user_id,
    ]);
    const [rows] = await pool.query(
      'SELECT user_id, name, email, phone, created_at FROM users WHERE user_id = ?',
      [req.user.user_id]
    );
    return success(res, 'Profile updated', rows[0]);
  } catch (err) {
    console.error(err);
    return fail(res, 'Unable to update profile', 500);
  }
};

exports.stats = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const [[orders]] = await pool.query('SELECT COUNT(*) AS total FROM orders WHERE user_id = ?', [userId]);
    const [[wish]] = await pool.query('SELECT COUNT(*) AS total FROM wishlist WHERE user_id = ?', [userId]);
    const [[addr]] = await pool.query('SELECT COUNT(*) AS total FROM addresses WHERE user_id = ?', [userId]);
    return success(res, 'Stats loaded', {
      totalOrders: orders.total,
      wishlistItems: wish.total,
      savedAddresses: addr.total,
    });
  } catch (err) {
    console.error(err);
    return fail(res, 'Unable to load stats', 500);
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return fail(res, 'Email is required');
    const [rows] = await pool.query('SELECT user_id FROM users WHERE email = ?', [email.trim().toLowerCase()]);
    if (!rows.length) {
      return success(res, 'If an account exists, a reset link has been sent');
    }
    return success(res, 'Password reset instructions sent to your email (demo)');
  } catch (err) {
    console.error(err);
    return fail(res, 'Unable to process request', 500);
  }
};
