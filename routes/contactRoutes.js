const express = require('express');
const { saveContact ,getAllContacts,updateReplyStatus} = require('../controllers/contactController');

const router = express.Router();

// POST Route to Save Contact message
router.post('/contact', saveContact);
//get data from contact table
router.get('/contact', getAllContacts); 

router.put('/reply', updateReplyStatus); // Add a PUT route for updating reply status



module.exports = router;
