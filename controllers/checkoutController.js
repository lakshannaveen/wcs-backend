const Checkout = require('../models/checkoutModel');  // Importing the Checkout model
const pool = require('../config/db');  // Adjust the path as needed

// Handle the submission of the order and save data across all tables
const placeOrder = async (req, res) => {
  try {
    const { orderDetails, checkoutDetails } = req.body;

    if (!checkoutDetails) {
      return res.status(400).json({ message: "Checkout details are missing." });
    }

    console.log("Received Checkout Details:", checkoutDetails);

    const userId = checkoutDetails.user_id || checkoutDetails.mapPageData?.userId;

    if (!userId) {
      console.error("User ID is missing in checkoutDetails:", checkoutDetails);
      return res.status(400).json({ message: "User ID is required." });
    }

    const {
      senderDetails,
      recipientDetails,
      wasteCollectionTime,
      paymentDetails,
      mapPageData,
    } = checkoutDetails;

    console.log("Extracted User ID:", userId);

    const price = mapPageData?.subscriptionPrice;

    if (!price) {
      console.error("Price is missing in checkoutDetails:", mapPageData);
      return res.status(400).json({ message: "Price is required." });
    }

    const checkoutData = {
      user_id: userId,
      sender_firstname: senderDetails.firstName,
      sender_lastname: senderDetails.lastName,
      sender_zip_code: senderDetails.zipCode,
      sender_phone_number: senderDetails.phone,
      sender_email: senderDetails.email || null,
      recipient_firstname: recipientDetails.firstName,
      recipient_lastname: recipientDetails.lastName,
      recipient_zip_code: recipientDetails.zipCode,
      recipient_phone_number: recipientDetails.phone,
      collection_time: wasteCollectionTime,
      subscription_type: mapPageData?.subscriptionType || null,
      selected_dates: mapPageData?.selectedDates || null,
      selected_days: mapPageData?.selectedDays || null,
      latitude: mapPageData.latitude,
      longitude: mapPageData.longitude,
      house_number: mapPageData.houseNo,
      street_name: mapPageData.streetName,
      price,
    };

    console.log("Checkout Data being saved:", checkoutData);

    const checkoutId = await Checkout.saveCheckout(checkoutData);

    if (paymentDetails?.paymentMethod) {
      await Checkout.savePayment(checkoutId, paymentDetails.paymentMethod, price);
    }

    // Only call saveSubscription once with checkoutId
    if (checkoutData.subscription_type) {
      await Checkout.saveSubscription(userId, checkoutData.subscription_type, new Date(), checkoutId);
    }

    // Respond with the checkoutId to the frontend
    return res.status(200).json({
      message: "Order placed successfully",
      checkoutId,
    });
  } catch (err) {
    console.error("Error placing order:", err);
    return res.status(500).json({ message: "Failed to place order. Please try again." });
  }
};


// Get all checkout records
const getAllCheckouts = async (req, res) => {
  try {
    const query = `
      SELECT 
        c.id AS checkout_id, 
        c.user_id, 
        c.sender_firstname, 
        c.sender_lastname, 
        c.recipient_firstname, 
        c.recipient_lastname, 
        c.collection_time, 
        c.selected_dates, 
        c.selected_days,
        s.expire_date,
        c.subscription_type,
        c.latitude,
        c.longitude,
        c.house_number,  
        c.street_name    
      FROM checkout c
      LEFT JOIN (
        SELECT user_id, MAX(expire_date) AS expire_date 
        FROM subscriptions 
        GROUP BY user_id
      ) s ON c.user_id = s.user_id
      GROUP BY c.id, c.user_id, c.sender_firstname, c.sender_lastname, c.recipient_firstname, c.recipient_lastname, 
        c.collection_time, c.selected_dates, c.selected_days, s.expire_date, c.subscription_type, c.latitude, c.longitude, 
        c.house_number, c.street_name
    `;
    const result = await pool.query(query);

    return res.status(200).json(result.rows); // Send back the rows of checkout records with the expiration date, house number, and street name
  } catch (err) {
    console.error('Error fetching checkouts:', err);
    return res.status(500).json({ message: 'Failed to fetch checkouts. Please try again.' });
  }
};



// Handle cancellation of the order
const cancelOrder = async (req, res) => {
  const { id } = req.params;  // Get the order ID from the URL params

  try {
    // Delete the order with the matching ID
    const query = 'DELETE FROM checkout WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    return res.status(200).json({ message: 'Order canceled successfully.' });
  } catch (err) {
    console.error('Error canceling order:', err);
    return res.status(500).json({ message: 'Failed to cancel order. Please try again.' });
  }
};

module.exports = {
  placeOrder,
  getAllCheckouts,
  cancelOrder,
};