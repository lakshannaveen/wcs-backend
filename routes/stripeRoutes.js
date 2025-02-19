const express = require('express');
const Stripe = require('stripe');
const router = express.Router();
require('dotenv').config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create Payment Intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency } = req.body;

    if (!amount || !currency) {
      return res.status(400).json({ message: 'Amount and currency are required.' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents (e.g., 5000 for $50)
      currency,
      payment_method_types: ['card'],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Stripe Error:', error);
    res.status(500).json({ message: 'Payment failed', error: error.message });
  }
});

module.exports = router;
