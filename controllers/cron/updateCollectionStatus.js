const cron = require('node-cron');
const pool = require('../../config/db');

// Schedule the cron job to run every day at 12:01 AM
cron.schedule('1 0 * * *', async () => {
  console.log('Running daily cron job to reset collected status...');

  try {
    const today = new Date();
    // For weekly and monthly subscriptions, we want to reset the status
    // on the day before the scheduled collection, so we check for tomorrow.
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Format tomorrow's date as 'YYYY-MM-DD'
    const tomorrowDate = tomorrow.toISOString().split('T')[0];

    // Get tomorrow's weekday name (e.g., "Monday")
    const tomorrowWeekday = tomorrow.toLocaleString('en-US', { weekday: 'long' });

    const query = `
      UPDATE checkout 
      SET collected = FALSE
      WHERE collected = TRUE
      AND (
        (subscription_type = 'daily')
        OR (subscription_type = 'weekly' AND selected_days @> ARRAY[$1])
        OR (subscription_type = 'monthly' AND selected_dates @> ARRAY[$2]::DATE[])
      )
    `;

    const result = await pool.query(query, [tomorrowWeekday, tomorrowDate]);
    console.log(`Collected status reset for ${result.rowCount} records.`);
  } catch (err) {
    console.error('Error resetting collected status:', err);
  }
});

module.exports = cron;
