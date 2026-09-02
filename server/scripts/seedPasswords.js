require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

async function run() {
  const hash = await bcrypt.hash('Password123!', 10);
  await pool.query(
    'UPDATE users SET password = ? WHERE email IN (?, ?)',
    [hash, 'alex@shopsphere.com', 'priya@shopsphere.com']
  );
  console.log('Demo user passwords set to Password123!');
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
