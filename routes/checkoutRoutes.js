const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');

// Route for placing order
router.post('/order', checkoutController.placeOrder);

// Route to get all checkouts
router.get('/checkouts', checkoutController.getAllCheckouts);

module.exports = router;
