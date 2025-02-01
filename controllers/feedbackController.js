const { createFeedback } = require('../models/feedbackModel'); // Correctly import createFeedback

// Create new feedback
const createFeedbackController = async (req, res) => {
    try {
        const { firstName, lastName, email, rating, feedback } = req.body;

        // Basic validation
        if (!firstName || !lastName || !email || !rating || !feedback) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        const newFeedback = await createFeedback({ 
            firstName, 
            lastName, 
            email, 
            rating, 
            feedback 
        });

        return res.status(201).json({
            message: "Feedback submitted successfully",
            feedback: newFeedback,
        });
    } catch (error) {
        console.error("Error creating feedback:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    createFeedbackController
};
