const Checkout = require('../models/checkoutModel');  // Importing the Checkout model
const pool = require('../config/db');

// Handle the submission of the order and save data across all tables
const placeOrder = async (req, res) => {
  const { orderDetails, checkoutDetails } = req.body;
  const { paymentMethod, amount } = orderDetails;

  try {
    // Save checkout data and get checkout ID
    const checkoutId = await Checkout.saveCheckout(checkoutDetails);

    // Save payment data if payment method exists
    if (paymentMethod) {
      await Checkout.savePayment(checkoutId, paymentMethod, amount);
    }

    // Save subscription data if the user has a subscription
    if (checkoutDetails.subscriptionType) {
      await Checkout.saveSubscription(orderDetails.user_id, checkoutDetails.subscriptionType, new Date()); // Assuming today's date as the start date
    }

    // Respond with a success message
    return res.status(200).json({
      message: 'Order placed successfully',
      checkoutId,
    });
  } catch (err) {
    console.error('Error placing order:', err);
    return res.status(500).json({ message: 'Failed to place order. Please try again.' });
  }
};

module.exports = {
  placeOrder,
};
