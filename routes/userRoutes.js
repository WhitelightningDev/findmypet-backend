const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, deleteUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Middleware to protect routes
router.use(authMiddleware);

// Routes
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.delete('/profile', deleteUser);

module.exports = router;
