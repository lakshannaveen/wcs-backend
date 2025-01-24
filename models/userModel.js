const pool = require('../config/db');

// Create a new user in the database
const createUser = async (firstname, lastname, username, email, passwordHash) => {
  console.log('Creating user with:', { firstname, lastname, username, email, passwordHash }); // Debugging log

  try {
    const query = `
      INSERT INTO users (firstname, lastname, username, email, password)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [firstname, lastname, username, email, passwordHash];
    
    // Logging the values to verify what's being passed
    console.log('Values being passed to query:', values);

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

module.exports = {
  createUser,
};
