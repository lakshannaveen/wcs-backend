const Checkout = require("../models/checkoutModel");

exports.placeOrder = async (req, res) => {
  try {
    console.log("Received Order Data:", req.body); // Debugging incoming request

    const orderData = req.body;

    // Trim input fields to remove unnecessary spaces
    Object.keys(orderData).forEach((key) => {
      if (typeof orderData[key] === "string") {
        orderData[key] = orderData[key].trim();
      }
    });

    // Validate required fields
    if (!orderData.user_id || !orderData.subscription_id || !orderData.payment_method) {
      return res.status(400).json({ error: "Missing required fields (user_id, subscription_id, payment_method)" });
    }

    // Validate location details
    if (!orderData.latitude || !orderData.longitude) {
      return res.status(400).json({ error: "Location details (latitude, longitude) are required" });
    }

    // Ensure user_id and subscription_id are numbers
    if (isNaN(orderData.user_id) || isNaN(orderData.subscription_id)) {
      return res.status(400).json({ error: "Invalid user_id or subscription_id. Must be numbers." });
    }

    // Ensure payment_method is valid
    const validPaymentMethods = ["Online", "Cash on Delivery"];
    if (!validPaymentMethods.includes(orderData.payment_method)) {
      return res.status(400).json({ error: `Invalid payment method. Allowed: ${validPaymentMethods.join(", ")}` });
    }

    const newOrder = await Checkout.createOrder(orderData);
    res.status(201).json({ message: "Order placed successfully", order: newOrder });

  } catch (error) {
    console.error("Error placing order:", error);

    if (error.code === "23503") { // Foreign key violation (user_id or subscription_id doesn't exist)
      return res.status(400).json({ error: "Invalid user_id or subscription_id" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};
