const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../jwtHelper');
const dotenv = require('dotenv');
const { sendSignupConfirmationEmail } = require('../services/mailService'); // Import the mail service

dotenv.config();

exports.register = async (req, res) => {
  const { name, surname, street, number, suburb, country, province, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      surname,
      address: { street, number, suburb, country, province },
      email,
      password: hashedPassword
    });

    // Save the new user
    await newUser.save();

    // Generate JWT token
    const token = generateToken(newUser._id);

    // Send signup confirmation email
    try {
      await sendSignupConfirmationEmail(newUser);
      console.log('Signup confirmation email sent to:', newUser.email);
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Log email error but don't fail registration
      // You might also want to notify the user about the email issue here
    }

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};
