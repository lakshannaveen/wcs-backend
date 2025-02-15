const Checkout = require('../models/checkoutModel');  // Importing the Checkout model

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

    // Ensure the price is extracted from mapPageData (subscriptionPrice)
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
      price,  // Now using the subscriptionPrice from mapPageData
    };

    console.log("Checkout Data being saved:", checkoutData);

    const checkoutId = await Checkout.saveCheckout(checkoutData);

    if (paymentDetails?.paymentMethod) {
      await Checkout.savePayment(checkoutId, paymentDetails.paymentMethod, price);
    }

    if (checkoutData.subscription_type) {
      await Checkout.saveSubscription(userId, checkoutData.subscription_type, new Date());
    }

    return res.status(200).json({
      message: "Order placed successfully",
      checkoutId,
    });
  } catch (err) {
    console.error("Error placing order:", err);
    return res.status(500).json({ message: "Failed to place order. Please try again." });
  }
};



module.exports = {
  placeOrder,
};
