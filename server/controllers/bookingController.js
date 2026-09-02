const { pool } = require('../config/db');
const { success, fail } = require('../utils/response');

const SLOTS = ['10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '4:00 PM'];

exports.slots = (_req, res) => success(res, 'Slots loaded', SLOTS);

exports.createBooking = async (req, res) => {
  try {
    const { booking_date, booking_time } = req.body;
    if (!booking_date || !booking_time) {
      return fail(res, 'booking_date and booking_time are required');
    }
    if (!SLOTS.includes(booking_time)) {
      return fail(res, 'Selected time slot is not available');
    }

    const [taken] = await pool.query(
      'SELECT booking_id FROM bookings WHERE booking_date = ? AND booking_time = ? AND booking_status <> ?',
      [booking_date, booking_time, 'CANCELLED']
    );
    if (taken.length) return fail(res, 'This slot is already booked');

    const [result] = await pool.query(
      `INSERT INTO bookings (user_id, booking_date, booking_time, booking_status)
       VALUES (?, ?, ?, 'CONFIRMED')`,
      [req.user.user_id, booking_date, booking_time]
    );
    return success(res, 'Booking confirmed', { booking_id: result.insertId }, 201);
  } catch (err) {
    console.error(err);
    return fail(res, 'Unable to create booking', 500);
  }
};

exports.listBookings = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM bookings WHERE user_id = ? ORDER BY booking_date DESC, booking_id DESC',
      [req.user.user_id]
    );
    return success(res, 'Bookings loaded', rows);
  } catch (err) {
    console.error(err);
    return fail(res, 'Unable to load bookings', 500);
  }
};
