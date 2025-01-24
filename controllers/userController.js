const bcrypt = require('bcrypt');
const { createUser } = require('../models/userModel');

const registerUser = async (req, res) => {
  const { firstname, lastname, username, email, createpassword } = req.body;

  // Validate input fields
  if (!firstname || !lastname || !username || !email || !createpassword) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Check if password is a string (already done, but re-validate here for logging purposes)
  if (typeof createpassword !== 'string') {
    return res.status(400).json({ error: 'Password must be a string' });
  }

  try {
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createpassword, saltRounds);
    console.log('Hashed password:', hashedPassword); // Debugging log

    // Create user in the database
    const newUser = await createUser(firstname, lastname, username, email, hashedPassword);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error('Error during registration:', error);

    if (error.code === '23505') { // Handle unique constraint violation (duplicate email/username)
      res.status(400).json({ error: 'Email or username already exists' });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = { registerUser };
