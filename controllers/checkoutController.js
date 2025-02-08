const Checkout = require("../models/checkoutModel");

exports.placeOrder = async (req, res) => {
  try {
    const orderData = req.body;

    // Ensure required fields are provided
    if (!orderData.user_id || !orderData.subscription_id || !orderData.payment_method) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Ensure location details are provided
    if (!orderData.latitude || !orderData.longitude) {
      return res.status(400).json({ error: "Location details are required" });
    }

    const newOrder = await Checkout.createOrder(orderData);
    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
