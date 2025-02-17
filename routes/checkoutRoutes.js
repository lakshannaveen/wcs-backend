const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');

// Route for placing order
router.post('/order', checkoutController.placeOrder);

// Route to get all checkouts
router.get('/checkouts', checkoutController.getAllCheckouts);

// Route to cancel an order
router.delete('/cancel/:id', checkoutController.cancelOrder);

// Route to update collected status
router.put('/:checkoutId/collected', checkoutController.updateCollectedStatus);

module.exports = router;
