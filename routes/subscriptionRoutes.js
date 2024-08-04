// routes/subscriptionRoutes.js
const express = require('express');
const { subscribe, getSubscriptions, cancelSubscription } = require('../controllers/subscriptionController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Middleware to protect routes
router.use(authMiddleware);

// Routes
router.post('/subscribe', subscribe);           // Subscribe to a plan
router.get('/', getSubscriptions);              // Get current subscriptions
router.delete('/cancel/:subscriptionId', cancelSubscription); // Cancel a subscription

module.exports = router;
