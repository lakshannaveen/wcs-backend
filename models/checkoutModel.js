const pool = require('../config/db');


class Checkout {
  static async createOrder(orderData) {
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
      street_name
    } = orderData;

    const query = `
      INSERT INTO checkout (
        User_ID, Subscription_ID, Waste_Collection_Time,
        Sender_First_Name, Sender_Last_Name, Sender_Zip_Code, Sender_Phone, Sender_Email,
        Recipient_First_Name, Recipient_Last_Name, Recipient_Phone, Recipient_Zip_Code,
        Payment_Method, Latitude, Longitude, House_Number, Street_Name
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *;
    `;

    const values = [
      user_id, subscription_id, waste_collection_time,
      sender_first_name, sender_last_name, sender_zip_code, sender_phone, sender_email,
      recipient_first_name, recipient_last_name, recipient_phone, recipient_zip_code,
      payment_method, latitude, longitude, house_number, street_name
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }
}

module.exports = Checkout;
