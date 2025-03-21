const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const pool = require('../config/db'); 
const { getAdminByEmail } = require('../models/adminModel');

// Admin Login Function
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await getAdminByEmail(email);

    if (!admin) {
      return res.status(401).json({ message: 'Invalid admin credentials!' });
    }

    // Compare passwords using bcrypt
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid admin credentials!' });
    }

    // Create a JWT token
    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Set token in HTTP-only cookie
    res.cookie('adminauth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // Log admin login details to a file
    const loginTime = new Date().toLocaleString();
    const logData = `Admin: ${email} logged in at ${loginTime}\n`;
    const logFilePath = path.join(__dirname, "../admin_logins.txt");

    fs.appendFile(logFilePath, logData, (err) => {
      if (err) {
        console.error("Error logging admin login:", err);
      }
    });

    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

// Admin Register Function
const adminRegister = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the admin already exists
    const existingAdmin = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
    if (existingAdmin.rows.length > 0) {
      return res.status(400).json({ message: 'Admin already exists!' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert admin into database
    await pool.query(
      'INSERT INTO admins (email, password, created_at, updated_at) VALUES ($1, $2, NOW(), NOW())',
      [email, hashedPassword]
    );

    res.status(201).json({ message: 'Admin registered successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};
// API to get admin login details from log file
const getAdminLogins = (req, res) => {
  const logFilePath = path.join(__dirname, "../admin_logins.txt");

  fs.readFile(logFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading admin log file:", err);
      return res.status(500).json({ message: "Error fetching admin logins" });
    }

    const logEntries = data
      .trim()
      .split("\n")
      .map((entry) => {
        const parts = entry.split(" logged in at ");
        return { email: parts[0].replace("Admin: ", ""), time: parts[1] };
      });

    res.json(logEntries);
  });
};



// Function to get all admins
const getAllAdmins = async (req, res) => {
  try {
    // Query to get all admin details (email, id, etc.)
    const result = await pool.query('SELECT id, email FROM admins');
    
    // Send the list of admins as a response
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch admin details.' });
  }
};

// Function to delete an admin by ID
const deleteAdmin = async (req, res) => {
  const { adminId } = req.params; // Get the admin ID from the route parameter

  try {
    // Query to delete the admin by ID
    const result = await pool.query('DELETE FROM admins WHERE id = $1', [adminId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete admin.' });
  }
};

module.exports = { adminLogin, adminRegister, getAdminLogins, getAllAdmins, deleteAdmin };
