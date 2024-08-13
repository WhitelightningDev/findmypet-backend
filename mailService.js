const nodemailer = require('nodemailer');

// Create a transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail', // or another email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendSignupConfirmationEmail = (user) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Signup Confirmation',
    text: `Hello ${user.name},\n\nThank you for signing up! Here are your details:\n\nName: ${user.name} ${user.surname}\nEmail: ${user.email}\nPassword: ${user.password}\n\nBest Regards,\nFound Your Pet Team`
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendSignupConfirmationEmail };
