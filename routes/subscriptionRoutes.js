const express = require('express');
const { subscribe, getSubscriptions, cancelSubscription, getSubscriptionPlans } = require('../controllers/subscriptionController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Middleware for authentication
router.use(authMiddleware);

// Route to subscribe to a plan
router.post('/subscribe', subscribe);

// Route to get all subscriptions for the user
router.get('/', getSubscriptions);

// Route to cancel a specific subscription
router.delete('/cancel/:subscriptionId', cancelSubscription);

// Route to get available subscription plans
router.get('/plans', getSubscriptionPlans);

module.exports = router;
