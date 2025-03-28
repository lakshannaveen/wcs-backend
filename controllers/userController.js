const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, getUserByUsername } = require('../models/userModel'); // Ensure getUserByUsername is imported
const { verifyToken } = require('../middlewares/authMiddleware'); // Import the verifyToken middleware


// Helper function to generate JWT
const generateToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
};

// Register function
// Register function
const registerUser = async (req, res) => {
  const { firstname, lastname, username, email, createpassword } = req.body;

  // Validate input fields
  if (!firstname || !lastname || !username || !email || !createpassword) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Check if password is a string
  if (typeof createpassword !== 'string') {
    return res.status(400).json({ error: 'Password must be a string' });
  }

  try {
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createpassword, saltRounds);

    // Create user in the database
    const newUser = await createUser(firstname, lastname, username, email, hashedPassword);

    // Generate JWT token
    const token = generateToken(newUser);

    // Log token creation
    console.log(`Token created for user ${newUser.username}: ${token}`);

    // Set the JWT token in the cookie
    res.cookie('token', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      sameSite: 'Strict', // Prevent CSRF attacks
    });

    // Send the response with the token
    res.status(201).json({
      message: 'User registered successfully',
      token, // Include token in response
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error('Error during registration:', error);

    if (error.code === '23505') { // Handle unique constraint violation
      res.status(400).json({ error: 'Email or username already exists' });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
};


const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    // Check if the user exists by username
    const user = await getUserByUsername(username);

    if (!user) {
      return res.status(401).json({ error: 'Invalid username' }); 
    }

    // Compare password
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: 'Invalid password' }); 
    }

    // Generate JWT token
    const token = generateToken(user);

    // Log token creation
    console.log(`Token created for user ${user.username}: ${token}`);

    // Set the JWT token in the cookie
    res.cookie('token', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      sameSite: 'Strict', // Prevent CSRF attacks
    });

    // Send the response along with the token
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      // You no longer need to send the token in the response body
    });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Protected route example
const getUserProfile = async (req, res) => {
  // Access user info from the request object (after token verification)
  const user = req.user; // This comes from the verifyToken middleware

  res.status(200).json({
    message: 'Profile data fetched successfully',
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  });
};

// Use `verifyToken` middleware on a protected route
const protectedRoute = (req, res) => {
  res.status(200).json({
    message: 'You are authenticated and have access to this route.',
    user: req.user, // User info is available here
  });
};
//verify user logged to the system
const verifyUserSession = async (req, res) => {
  try {
    const user = req.user; // Extracted from the token by verifyToken middleware

    // Send user data if the token is valid
    res.status(200).json({
      message: 'Session is valid',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error verifying user session:', error);
    res.status(500).json({ error: 'Failed to verify session' });
  }
};
module.exports = { registerUser, loginUser, getUserProfile, protectedRoute,verifyUserSession };
