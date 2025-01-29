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

// Controller method for updating reply status
const updateReplyStatus = async (req, res) => {
  const { id, reply_sent } = req.body;
  
  try {
    const updatedContact = await contactModel.updateReplyStatus(id, reply_sent);
    if (updatedContact) {
      res.status(200).json(updatedContact); // Return the updated contact with reply_sent field
    } else {
      res.status(404).json({ error: 'Contact not found' });
    }
  } catch (error) {
    console.error('Error updating reply status:', error);
    res.status(500).json({ error: 'An error occurred while updating reply status.' });
  }
};




module.exports = {
  saveContact,
  getAllContacts,
  updateReplyStatus, // Export the new method
};

