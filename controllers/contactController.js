const contactModel = require('../models/contactModel');

const saveContact = async (req, res) => {
  try {
    const contact = await contactModel.createContact(req.body);
    res.status(201).json({
      message: 'Contact saved successfully!',
      data: contact,
    });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ error: 'An error occurred while saving the contact.' });
  }
};

module.exports = {
  saveContact,
};
