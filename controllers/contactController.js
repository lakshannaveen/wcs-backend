const contactModel = require('../models/contactModel');

const saveContact = async (req, res) => {
  try {
    const contact = await contactModel.createContact(req.body);
    res.status(201).json({
      message: 'Your message is saved successfully!',
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
//get contact inquiries details
const getAllContacts = async (req, res) => {
  try {
    const contacts = await contactModel.getAllContacts();
    res.status(200).json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'An error occurred while fetching contacts.' });
  }
};

module.exports = {
  saveContact,
  getAllContacts, // Export the new method
};
