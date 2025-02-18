// cronJob.js

const cron = require('node-cron');
const pool = require('../../config/db'); // Adjust the relative path as needed

// Cron job to run every day at midnight (use '* * * * *' for testing)
cron.schedule('0 0 * * *', async () => {
  console.log('Cron job triggered at', new Date());
  
  try {
    // Select pending updates where scheduled_at is less than or equal to CURRENT_TIMESTAMP
    const selectQuery = `
      SELECT * 
      FROM pending_updates 
      WHERE scheduled_at <= CURRENT_TIMESTAMP 
      AND status = $1
    `;
    const result = await pool.query(selectQuery, ['pending']);
    console.log('Number of pending updates found:', result.rows.length);

    if (result.rows.length > 0) {
      for (const update of result.rows) {
        const { checkout_id, collection_time } = update;
        console.log(`Processing update for checkout_id ${checkout_id} with collection_time "${collection_time}"`);

        // Update the checkout table with the new collection time
        const updateCheckoutQuery = `
          UPDATE checkout
          SET collection_time = $1
          WHERE id = $2
        `;
        const checkoutResult = await pool.query(updateCheckoutQuery, [collection_time, checkout_id]);

        // Log how many rows were updated in checkout
        console.log(`Checkout table updated rows count: ${checkoutResult.rowCount}`);

        // Mark the pending update as completed
        const markCompletedQuery = `
          UPDATE pending_updates
          SET status = $1
          WHERE id = $2
        `;
        await pool.query(markCompletedQuery, ['completed', update.id]);
        console.log(`Marked pending update with id ${update.id} as completed.`);
      }
    } else {
      console.log('No pending updates to process.');
    }
  } catch (err) {
    console.error('Error processing pending updates:', err);
  }
});
