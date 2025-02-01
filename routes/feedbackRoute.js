const express = require('express');
const { createFeedbackController, getAllFeedbackController } = require('../controllers/feedbackController');

const router = express.Router();

// POST route for submitting feedback
router.post('/submit', createFeedbackController);

// GET route for fetching all feedback
router.get('/feedback', getAllFeedbackController);

module.exports = router;
