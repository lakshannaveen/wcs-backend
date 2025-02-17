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

// Route to get all orders for a specific user (Order History)
router.get('/order-history', checkoutController.getOrderHistory);

// Route to update collection time for a specific checkout ID
router.put('/update-collection-time/:checkoutId', checkoutController.updateCollectionTime);

module.exports = router;
