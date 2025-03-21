const express = require('express');
const { adminLogin,getAdminLogins,getAllAdmins,deleteAdmin } = require('../controllers/adminController');
const { checkAuth } = require('../middlewares/adminMiddleware');
const { adminRegister } = require('../controllers/adminController');
const router = express.Router();

// Admin login route - no authentication needed for login
router.post('/adminlogin', adminLogin);

// Protected route - authentication required via JWT token in cookies
router.get('/protected-route', checkAuth, (req, res) => {
  res.json({ message: 'Protected route accessible', admin: req.admin }); // Return JSON instead of plain text
});


// Another example of a protected route (admin dashboard, for instance)
router.get('/admin/dashboard', checkAuth, (req, res) => {
  res.send('Admin dashboard accessible');
});
// Admin registration route
router.post('/register', adminRegister);
router.get("/logins", getAdminLogins);
// Route to get all admins
router.get('/admins', getAllAdmins);

// Route to delete an admin by ID
router.delete('/admin/:adminId', deleteAdmin);
module.exports = router;
