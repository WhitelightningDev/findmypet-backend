const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User');
const { sendSignupConfirmationEmail } = require('../services/mailService'); // Import mail service

dotenv.config();

const authMiddleware = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password'); // Exclude password

    // Send email notification (example: user authentication)
    try {
      await sendSignupConfirmationEmail(req.user);
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Optionally handle the email error (e.g., log it, notify the user, etc.)
    }

    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;
