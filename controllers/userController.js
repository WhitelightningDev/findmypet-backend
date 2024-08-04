const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Create a new user
exports.createUser = async (req, res) => {
  const { name, surname, street, number, suburb, country, province, email, password } = req.body;
  
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      surname,
      address: { street, number, suburb, country, province },
      email,
      password: hashedPassword
    });

    // Save user to the database
    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  const { name, surname, street, number, suburb, country, province, email, password } = req.body;
  
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (name) user.name = name;
    if (surname) user.surname = surname;
    if (street || number || suburb || country || province) {
      user.address = { street, number, suburb, country, province };
    }
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10); // Hash the password

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
