const jwt = require('jsonwebtoken');
const { getAdminByEmail } = require('../models/adminModel');

const checkAuth = async (req, res, next) => {
  // Get the token from the Authorization header or cookie
  const token = req.headers['authorization']?.split(' ')[1] || req.cookies['adminauth'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if admin exists using decoded email from the token
    const admin = await getAdminByEmail(decoded.email);

    if (!admin) {
      return res.status(403).json({ message: 'Admin not found' });
    }

    // Attach admin details to request object for future use
    req.admin = admin;
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { checkAuth };
