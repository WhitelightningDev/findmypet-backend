const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// Admin routes (authentication middleware can be added as needed)
router.post('/login', adminController.login);
router.get('/users', authMiddleware, adminController.getAllUsers);
router.get('/users/:userId/pets', authMiddleware, adminController.getUserPets);

module.exports = router;
