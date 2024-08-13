const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create a transporter using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Function to send a signup confirmation email
const sendSignupConfirmationEmail = async (user) => {
  const mailOptions = {
    from: `"Find My Pet Team" <${process.env.EMAIL_USER}>`, // Professional sender address
    to: user.email,
    subject: 'Welcome to Found Your Pet!',
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Hello ${user.name},</h2>
        <p>Thank you for signing up! We’re thrilled to have you on board.</p>
        <p><strong>Your Details:</strong></p>
        <ul>
          <li><strong>Name:</strong> ${user.name} ${user.surname}</li>
          <li><strong>Email:</strong> ${user.email}</li>
        </ul>
        <p>If you have any questions, feel free to reply to this email. We're here to help!</p>
        <p>Best Regards,<br>The Found Your Pet Team</p>
        <hr />
        <p style="font-size: 12px; color: #777;">This is an automated message, please do not reply.</p>
        <p style="font-size: 10px; color: #999; margin-top: 20px;">
          Legal Disclaimer: The information contained in this email is confidential and intended for the recipient specified in the message only. It is strictly forbidden to share any part of this message with any third party, without a written consent of the sender. If you received this message by mistake, please reply to this message and follow with its deletion, so that we can ensure such a mistake does not occur in the future.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Signup confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending signup confirmation email:', error);
    throw error;
  }
};

module.exports = { sendSignupConfirmationEmail };
