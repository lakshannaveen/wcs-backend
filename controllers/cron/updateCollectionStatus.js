const cron = require('node-cron');
const pool = require('../../config/db'); 

// Schedule the cron job to run every day at 12:01 AM
cron.schedule('1 0 * * *', async () => {
  console.log('Running daily cron job to reset collected status...');

  try {
    const query = `
      UPDATE checkout 
      SET collected = FALSE
      WHERE subscription_type IN ('daily', 'weekly', 'monthly') 
      AND collected = TRUE
    `;

    const result = await pool.query(query);
    console.log(`Collected status reset for ${result.rowCount} records.`);
  } catch (err) {
    console.error('Error resetting collected status:', err);
  }
});

module.exports = cron;
