const express = require('express');
const { createFeedbackController } = require('../controllers/feedbackController');

const router = express.Router();

// POST route for submitting feedback
router.post('/submit', createFeedbackController);

module.exports = router;
