const express = require('express');
const { saveContact } = require('../controllers/contactController');

const router = express.Router();

// POST Route to Save Contact
router.post('/contact', saveContact);

module.exports = router;
