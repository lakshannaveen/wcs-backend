const bcrypt = require('bcryptjs');
const { getUserByEmail, updatePasswordInDb } = require('../models/userModel');

// Controller for changing the password
const changePassword = async (req, res) => {
  const { email, currentPassword, newPassword, confirmPassword } = req.body;

  // Validate fields
  if (!email || !currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  // Password validation (regex for strength)
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({
      message:
        'Password must be at least 8 characters, contain 1 uppercase letter, 1 number, and 1 special character.',
    });
  }

  try {
    // Check if user exists
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password in the database
    await updatePasswordInDb(email, hashedPassword);

    // Send success response
    res.status(200).json({ message: 'Password changed successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = { changePassword };
