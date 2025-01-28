const express = require('express');
const { adminLogin } = require('../controllers/adminController');
const { checkAuth } = require('../middlewares/adminMiddleware');
const router = express.Router();

// Admin login route - no authentication needed for login
router.post('/adminlogin', adminLogin);

// Protected route - authentication required via JWT token in cookies
router.post('/admin/protected-route', checkAuth, (req, res) => {
  res.send('Protected route accessible');
});

// Another example of a protected route (admin dashboard, for instance)
router.get('/admin/dashboard', checkAuth, (req, res) => {
  res.send('Admin dashboard accessible');
});

module.exports = router;
