const pool = require('../config/db');

// Create a new user in the database
const createUser = async (firstname, lastname, username, email, passwordHash) => {
  console.log('Creating user with:', { firstname, lastname, username, email, passwordHash });

  try {
    const query = `
      INSERT INTO users (firstname, lastname, username, email, password)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [firstname, lastname, username, email, passwordHash];

    console.log('Values being passed to query:', values);

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Get user by username
const getUserByUsername = async (username) => {
  try {
    const query = 'SELECT * FROM users WHERE username = $1';
    const values = [username];

    const result = await pool.query(query, values);

    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      return null; // User not found
    }
  } catch (error) {
    console.error('Error fetching user by username:', error);
    throw error;
  }
};

module.exports = {
  createUser,
  getUserByUsername, 
};
