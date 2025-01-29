const express = require('express');
const { changePassword } = require('../controllers/changePasswordController');

const router = express.Router();

// Route to change password
router.post('/change-password', changePassword);

module.exports = router;
