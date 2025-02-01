const pool = require('../config/db'); // Ensure your PostgreSQL connection is correct

// Create feedback in the database
const createFeedback = async (feedbackData) => {
  const { firstName, lastName, email, rating, feedback } = feedbackData;
  
  const query = `
    INSERT INTO feedback (first_name, last_name, email, rating, feedback, created_at)
    VALUES ($1, $2, $3, $4, $5, NOW())
    RETURNING *;
  `;
  
  const values = [firstName, lastName, email, rating, feedback];
  
  try {
    const result = await pool.query(query, values);
    return result.rows[0]; // Return the inserted feedback
  } catch (error) {
    console.error('Error inserting feedback:', error); // Log any errors
    throw error; // Re-throw error for further handling
  }
};

// Fetch all feedback from the database
const getAllFeedback = async () => {
  const query = `
    SELECT * FROM feedback;
  `;
  
  try {
    const result = await pool.query(query);
    return result.rows; // Return all feedback data
  } catch (error) {
    console.error('Error fetching feedback:', error); // Log any errors
    throw error; // Re-throw error for further handling
  }
};

module.exports = {
  createFeedback, 
  getAllFeedback // Ensure this is exported
};
