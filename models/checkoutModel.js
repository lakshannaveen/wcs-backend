const pool = require('../config/db');

// Save checkout data
const saveCheckout = async (checkoutDetails) => {
  const {
    user_id,
    sender_firstname,
    sender_lastname,
    sender_zip_code,
    sender_phone_number,
    sender_email,
    recipient_firstname,
    recipient_lastname,
    recipient_zip_code,
    recipient_phone_number,
    collection_time,
    subscription_type,
    selected_dates,
    selected_days,
    latitude,
    longitude,
    house_number,
    street_name, // Added fields
  } = checkoutDetails;

  if (!user_id) {
    throw new Error("User ID is missing when saving checkout.");
  }

  const insertCheckoutQuery = `
    INSERT INTO checkout (
      user_id, sender_firstname, sender_lastname, sender_zip_code, sender_phone_number,
      sender_email, recipient_firstname, recipient_lastname, recipient_zip_code, recipient_phone_number,
      collection_time, subscription_type, selected_dates, selected_days, latitude, longitude,
      house_number, street_name  -- Added fields in query
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
    ) RETURNING id;
  `;

  const values = [
    user_id,
    sender_firstname,
    sender_lastname,
    sender_zip_code,
    sender_phone_number,
    sender_email,
    recipient_firstname,
    recipient_lastname,
    recipient_zip_code,
    recipient_phone_number,
    collection_time,
    subscription_type,
    selected_dates,
    selected_days,
    latitude,
    longitude,
    house_number,
    street_name,
  ];

  try {
    const result = await pool.query(insertCheckoutQuery, values);
    return result.rows[0].id;
  } catch (err) {
    console.error("Database Error:", err);
    throw err;
  }
};

// Save payment data
const savePayment = async (checkoutId, paymentType, price) => {
  // Normalize payment type to lowercase to match the database constraint
  const normalizedPaymentType = paymentType.toLowerCase();

  // Validate paymentType to ensure it is one of the allowed values
  const validPaymentTypes = ['cash', 'online'];
  if (!validPaymentTypes.includes(normalizedPaymentType)) {
    throw new Error(`Invalid payment type: ${paymentType}`);
  }

  const insertPaymentQuery = `
    INSERT INTO payment (checkout_id, payment_type, price)
    VALUES ($1, $2, $3);
  `;
  const values = [checkoutId, normalizedPaymentType, price];

  try {
    await pool.query(insertPaymentQuery, values);
  } catch (err) {
    throw err;
  }
};

// Save subscription data
const saveSubscription = async (userId, subscriptionType, startDate) => {
  const insertSubscriptionQuery = `
    INSERT INTO subscriptions (user_id, subscription_type, start_date)
    VALUES ($1, $2, $3) RETURNING id;
  `;
  const values = [userId, subscriptionType, startDate];

  try {
    const result = await pool.query(insertSubscriptionQuery, values);
    return result.rows[0].id; // Returning the subscription ID
  } catch (err) {
    throw err;
  }
};

module.exports = {
  saveCheckout,
  savePayment,
  saveSubscription,
};
