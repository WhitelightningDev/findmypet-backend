const express = require('express');
const { subscribe, getSubscriptions, cancelSubscription } = require('../controllers/subscriptionController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/subscribe', subscribe);
router.get('/', getSubscriptions);
router.delete('/cancel/:subscriptionId', cancelSubscription);

module.exports = router;
