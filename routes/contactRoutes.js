const express = require('express');
const { saveContact ,getAllContacts} = require('../controllers/contactController');

const router = express.Router();

// POST Route to Save Contact message
router.post('/contact', saveContact);
//get data from contact table
router.get('/contact', getAllContacts); 


module.exports = router;
