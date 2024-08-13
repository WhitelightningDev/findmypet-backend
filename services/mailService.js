const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create a transporter using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use 'gmail' if you're using Gmail
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Function to send a signup confirmation email
const sendSignupConfirmationEmail = async (user) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address
    to: user.email, // Recipient address
    subject: 'Signup Confirmation', // Subject line
    text: `Hello ${user.name},\n\nThank you for signing up! Here are your details:\n\nName: ${user.name} ${user.surname}\nEmail: ${user.email}\n\nBest Regards,\nFind My Pet Team` // Email body
  };

  try {
    await transporter.sendMail(mailOptions); // Send email
    console.log('Signup confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending signup confirmation email:', error);
    throw error; // Ensure the error is thrown to be caught in the controller
  }
};

module.exports = { sendSignupConfirmationEmail };
