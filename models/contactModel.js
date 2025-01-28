const pool = require('../config/db');

const createContact = async (contactData) => {
  const { firstName, lastName, email, phone, message } = contactData;
  const query = `
    INSERT INTO contact (first_name, last_name, email, phone, message, created_at)
    VALUES ($1, $2, $3, $4, $5, NOW())
    RETURNING *;
  `;
  const values = [firstName, lastName, email, phone, message];
  const result = await pool.query(query, values);
  return result.rows[0];
};

module.exports = {
  createContact,
};

const getAllContacts = async () => {
  const query = `
    SELECT first_name AS "firstName", last_name AS "lastName", email, phone, message, created_at AS "date"
    FROM contact
    ORDER BY created_at DESC;
  `;
  const result = await pool.query(query);
  return result.rows; // Returns all rows from the query
};

module.exports = {
  createContact,
  getAllContacts, // Export the new function
};

