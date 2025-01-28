const pool = require('../config/db');
const bcrypt = require('bcrypt');

const getAdminByEmail = async (email) => {
  const query = 'SELECT * FROM admins WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

const createAdmin = async (email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = 'INSERT INTO admins (email, password) VALUES ($1, $2) RETURNING id, email';
  const result = await pool.query(query, [email, hashedPassword]);
  return result.rows[0];
};

module.exports = {
  getAdminByEmail,
  createAdmin,
};
