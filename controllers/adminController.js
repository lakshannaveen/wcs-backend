const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { getAdminByEmail } = require('../models/adminModel');

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the admin exists in the database
    const admin = await getAdminByEmail(email);

    // If admin doesn't exist, send error
    if (!admin) {
      return res.status(401).json({ message: 'Invalid admin credentials!' });
    }

    // Compare the provided password with the stored hashed password
    const match = await bcrypt.compare(password, admin.password);

    // If password doesn't match, send error
    if (!match) {
      return res.status(401).json({ message: 'Invalid admin credentials!' });
    }

    // Create a JWT token containing admin's details
    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Set the token in the cookie (HTTP-only and secure for production environments)
    res.cookie('adminauth', token, {
      httpOnly: true, // Prevents JavaScript from accessing the token
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      maxAge: 3600000, // Set the cookie to expire in 1 hour
    });

    // Respond with success message
    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

module.exports = { adminLogin };
