const pool = require('../config/db');

class Checkout {
  static async createOrder(orderData) {
    const client = await pool.connect(); // Get a client for transactions
    try {
      await client.query('BEGIN'); // Start transaction

      const {
        user_id,
        subscription_id,
        waste_collection_time,
        sender_first_name,
        sender_last_name,
        sender_zip_code,
        sender_phone,
        sender_email,
        recipient_first_name,
        recipient_last_name,
        recipient_phone,
        recipient_zip_code,
        payment_method,
        latitude,
        longitude,
        house_number,
        street_name,
        type, // Subscription Type: 'One-time', 'Daily', 'Weekly', 'Monthly'
        weekly_days, // ['Monday', 'Tuesday']
        monthly_dates, // [1, 15, 20]
        start_date,
        end_date
      } = orderData;

      let finalSubscriptionId = subscription_id;

      // If subscription_id is not provided, create a new subscription
      if (!subscription_id) {
        const subQuery = `
          INSERT INTO subscriptions (User_ID, Type, Weekly_Days, Monthly_Dates, Start_Date, End_Date)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING Subscription_ID;
        `;
        const subValues = [
          user_id,
          type,
          type === 'Weekly' ? weekly_days : null,
          type === 'Monthly' ? monthly_dates : null,
          start_date,
          end_date
        ];
        const subResult = await client.query(subQuery, subValues);
        finalSubscriptionId = subResult.rows[0].subscription_id;
      }

      // Insert into checkout table
      const checkQuery = `
        INSERT INTO checkout (
          User_ID, Subscription_ID, Waste_Collection_Time,
          Sender_First_Name, Sender_Last_Name, Sender_Zip_Code, Sender_Phone, Sender_Email,
          Recipient_First_Name, Recipient_Last_Name, Recipient_Phone, Recipient_Zip_Code,
          Payment_Method, Latitude, Longitude, House_Number, Street_Name
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        RETURNING *;
      `;

      const checkValues = [
        user_id, finalSubscriptionId, waste_collection_time,
        sender_first_name, sender_last_name, sender_zip_code, sender_phone, sender_email,
        recipient_first_name, recipient_last_name, recipient_phone, recipient_zip_code,
        payment_method, latitude, longitude, house_number, street_name
      ];

      const checkResult = await client.query(checkQuery, checkValues);

      await client.query('COMMIT'); // Commit transaction

      return checkResult.rows[0]; // Return the newly created order
    } catch (error) {
      await client.query('ROLLBACK'); // Rollback on failure
      throw error;
    } finally {
      client.release(); // Release the database client
    }
  }
}

module.exports = Checkout;
