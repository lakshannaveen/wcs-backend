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

  // Ensure subscription plan is set correctly
  if (!mapPageData.subscriptionPlan) {
    const subscriptionPrice = mapPageData.subscriptionPrice;
    switch (subscriptionPrice) {
      case 200:
        mapPageData.subscriptionPlan = "One-Time";
        break;
      case 2000:
        mapPageData.subscriptionPlan = "Weekly";
        break;
      case 5000:
        mapPageData.subscriptionPlan = "Daily";
        break;
      case 1000:
        mapPageData.subscriptionPlan = "Monthly";
        break;
      default:
        mapPageData.subscriptionPlan = "Unknown Plan";
    }
  }

  const emailContent = `
    <h2>Order Confirmation</h2>
    <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse;">
      <tr style="background-color: #e6f7e6;">
        <th colspan="2">Checkout ID: ${checkoutId}</th>
      </tr>
      <tr style="background-color: #d9f7d9;">
        <td colspan="2"><strong>Sender Details</strong></td>
      </tr>
      <tr>
        <td><strong>Name:</strong></td>
        <td>${senderDetails.firstName} ${senderDetails.lastName}</td>
      </tr>
      <tr>
        <td><strong>Phone:</strong></td>
        <td>${senderDetails.phone}</td>
      </tr>
      <tr>
        <td><strong>Zip Code:</strong></td>
        <td>${senderDetails.zipCode}</td>
      </tr>
      ${!isSameSenderRecipient ? `
        <tr style="background-color: #d9f7d9;">
          <td colspan="2"><strong>Recipient Details</strong></td>
        </tr>
        <tr>
          <td><strong>Name:</strong></td>
          <td>${recipientDetails.firstName} ${recipientDetails.lastName}</td>
        </tr>
        <tr>
          <td><strong>Phone:</strong></td>
          <td>${recipientDetails.phone}</td>
        </tr>
        <tr>
          <td><strong>Zip Code:</strong></td>
          <td>${recipientDetails.zipCode}</td>
        </tr>
      ` : ''}
      <tr style="background-color: #d9f7d9;">
        <td colspan="2"><strong>Map and Subscription Details</strong></td>
      </tr>
      <tr>
        <td><strong>Location:</strong></td>
        <td>Lat: ${mapPageData.latitude}, Long: ${mapPageData.longitude}</td>
      </tr>
      <tr>
        <td><strong>Subscription Plan:</strong></td>
        <td>${mapPageData.subscriptionPlan}</td>
      </tr>
      <tr style="background-color: #d9f7d9;">
        <td><strong>Subscription Price:</strong></td>
        <td style="color: #28a745;">${mapPageData.subscriptionPrice}</td>
      </tr>
      ${mapPageData.selectedDates ? `
        <tr>
          <td><strong>Selected Dates:</strong></td>
          <td>${mapPageData.selectedDates}</td>
        </tr>
      ` : ''}
      ${mapPageData.selectedDays ? `
        <tr>
          <td><strong>Selected Days:</strong></td>
          <td>${mapPageData.selectedDays}</td>
        </tr>
      ` : ''}
      <tr style="background-color: #d9f7d9;">
        <td colspan="2"><strong>Waste Collection Time</strong></td>
      </tr>
      <tr>
        <td><strong>Collection Time:</strong></td>
        <td>${wasteCollectionTime}</td>
      </tr>
      <tr style="background-color: #d9f7d9;">
        <td colspan="2"><strong>Payment Details</strong></td>
      </tr>
      <tr>
        <td><strong>Payment Method:</strong></td>
        <td>${paymentDetails.paymentMethod}</td>
      </tr>
      <tr style="background-color: #d9f7d9;">
        <td><strong>Total Price:</strong></td>
        <td style="color: #28a745;">${mapPageData.subscriptionPrice}</td>
      </tr>
    </table>
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
