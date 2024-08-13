const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User');
const { sendSignupConfirmationEmail } = require('./mailService'); // Make sure to require your mail service

dotenv.config();

// Middleware to protect routes
const authMiddleware = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password'); // Exclude password
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Register a new user
const registerUser = async (req, res) => {
  const { name, surname, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create a new user
    const newUser = new User({ name, surname, email, password });
    await newUser.save();

    // Send confirmation email
    await sendSignupConfirmationEmail({ name, surname, email, password });

    // Generate a token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during registration' });
  }
};

module.exports = { authMiddleware, registerUser };
