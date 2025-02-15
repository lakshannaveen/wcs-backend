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
  } = checkoutDetails;

  const insertCheckoutQuery = `
    INSERT INTO checkout (
      user_id, sender_firstname, sender_lastname, sender_zip_code, sender_phone_number,
      sender_email, recipient_firstname, recipient_lastname, recipient_zip_code, recipient_phone_number,
      collection_time, subscription_type, selected_dates, selected_days, latitude, longitude
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
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
  ];

  try {
    const result = await pool.query(insertCheckoutQuery, values);
    return result.rows[0].id; // Returning the checkout ID
  } catch (err) {
    throw err;
  }
};

// Save payment data
const savePayment = async (checkoutId, paymentType, amount) => {
  const insertPaymentQuery = `
    INSERT INTO payment (checkout_id, payment_type, amount)
    VALUES ($1, $2, $3);
  `;
  const values = [checkoutId, paymentType, amount];

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
