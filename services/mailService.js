const nodemailer = require('nodemailer');

// Create a transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail', // or another email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Function to send a signup confirmation email
const sendSignupConfirmationEmail = async (user) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Signup Confirmation',
    text: `Hello ${user.name},\n\nThank you for signing up! Here are your details:\n\nName: ${user.name} ${user.surname}\nEmail: ${user.email}\n\nBest Regards,\nFind My Pet Team`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Signup confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending signup confirmation email:', error);
    throw error; // Ensure the error is thrown to be caught in the controller
  }
};

module.exports = { sendSignupConfirmationEmail };
