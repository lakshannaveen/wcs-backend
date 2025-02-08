const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkoutController");

// Place an order
router.post("/order", checkoutController.placeOrder);

module.exports = router;
