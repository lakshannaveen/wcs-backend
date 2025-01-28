const pool = require('../config/db');
const bcrypt = require('bcrypt');

// Function to get admin by email
const getAdminByEmail = async (email) => {
  const query = 'SELECT * FROM admins WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0]; // Return the admin details if found
};

module.exports = {
  getAdminByEmail,
};
