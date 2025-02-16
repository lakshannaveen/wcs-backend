const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'wastecollectionsystem.lk@gmail.com',
    pass: 'mopgmudksatwogyp', // App password 
  },
});

router.post('/sendOrderConfirmation', (req, res) => {
  const orderData = req.body;
  const { checkoutId, senderDetails, recipientDetails, mapPageData, paymentDetails, wasteCollectionTime } = orderData;

  const isSameSenderRecipient =
    senderDetails.firstName === recipientDetails.firstName &&
    senderDetails.lastName === recipientDetails.lastName &&
    senderDetails.phone === recipientDetails.phone &&
    senderDetails.zipCode === recipientDetails.zipCode;

  // Updated email content to include checkoutId
  const emailContent = `
    <h2>Order Confirmation</h2>
    
    <h3>Checkout ID: ${checkoutId}</h3>  <!-- Correct reference to checkoutId -->
  
    <h3>Sender Details</h3>
    <p><strong>Name:</strong> ${senderDetails.firstName} ${senderDetails.lastName}</p>
    <p><strong>Phone:</strong> ${senderDetails.phone}</p>
    <p><strong>Zip Code:</strong> ${senderDetails.zipCode}</p>
  
    ${!isSameSenderRecipient ? `
      <h3>Recipient Details</h3>
      <p><strong>Name:</strong> ${recipientDetails.firstName} ${recipientDetails.lastName}</p>
      <p><strong>Phone:</strong> ${recipientDetails.phone}</p>
      <p><strong>Zip Code:</strong> ${recipientDetails.zipCode}</p>
    ` : ''}
  
    <h3>Map and Subscription Details</h3>
    <p><strong>Location:</strong> Lat: ${mapPageData.latitude}, Long: ${mapPageData.longitude}</p>
    <p><strong>Subscription Plan:</strong> ${mapPageData.subscriptionPlan}</p>
    <p><strong>Subscription Price:</strong> ${mapPageData.subscriptionPrice}</p>
    
    ${mapPageData.selectedDates ? `<p><strong>Selected Dates:</strong> ${mapPageData.selectedDates}</p>` : ''}
    ${mapPageData.selectedDays ? `<p><strong>Selected Days:</strong> ${mapPageData.selectedDays}</p>` : ''}
  
    <h3>Waste Collection Time</h3>
    <p><strong>Collection Time:</strong> ${wasteCollectionTime}</p>
  
    <h3>Payment Details</h3>
    <p><strong>Payment Method:</strong> ${paymentDetails.paymentMethod}</p>
    <p><strong>Total Price:</strong> ${mapPageData.subscriptionPrice}</p>
  `;
  

  const mailOptions = {
    from: 'wastecollectionsystem.lk@gmail.com',
    to: senderDetails.email,
    subject: 'Order Confirmation and Bill',
    html: emailContent,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
      return res.status(500).json({ message: 'Error sending email', error: error.message });
    }
    console.log('Email sent:', info.response);
    res.status(200).json({ message: 'Email sent successfully' });
  });
});

module.exports = router;
