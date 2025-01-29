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
    SELECT id, first_name AS "firstName", last_name AS "lastName", email, phone, message, created_at AS "date", reply_sent
    FROM contact
    ORDER BY created_at DESC;
  `;
  const result = await pool.query(query);
  return result.rows; // Ensure `id` is included in each inquiry
};




const updateReplyStatus = async (id, reply_sent) => {
  const query = `
    UPDATE contact
    SET reply_sent = $1
    WHERE id = $2
    RETURNING *;
  `;
  const values = [reply_sent, id]; // Ensure `id` is passed correctly
  
  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      throw new Error('No matching record found to update');
    }
    return result.rows[0]; // Return the updated contact row
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};






module.exports = {
  createContact,
  getAllContacts,
  updateReplyStatus, 
};
