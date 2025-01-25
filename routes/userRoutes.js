const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Register route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

// Example of a protected route that requires authentication (JWT verification)
router.get('/profile', verifyToken, (req, res) => {
    res.status(200).json({ message: 'Protected content', user: req.user });
  });
  

module.exports = router;
