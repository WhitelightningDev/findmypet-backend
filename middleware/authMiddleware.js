const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User');
const Admin = require('../models/Admin'); // Add Admin model if needed

dotenv.config();

const authMiddleware = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Determine if the user is an admin or a regular user
    let user;
    if (decoded.isAdmin) {
      user = await Admin.findById(decoded.id);
    } else {
      user = await User.findById(decoded.id).select('-password'); // Exclude password
    }

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user; // Attach user to request object
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;
