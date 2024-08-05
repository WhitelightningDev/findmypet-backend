const Subscription = require('../models/Subscription');
const paypalClient = require('../paypalConfig');
const paypal = require('@paypal/checkout-server-sdk');
const moment = require('moment');

// Example subscription plans with unique ids
const subscriptionPlans = {
  'basic': {
    id: 'basic',  // Unique id for the plan
    name: 'Basic Plan',
    initialPayment: 350,
    monthlyPayment: 75,
  },
  // Add more plans as needed with unique ids
};

// Subscribe to a plan
exports.subscribe = async (req, res) => {
  const { planId } = req.body;

  // Validate the planId
  if (!subscriptionPlans[planId]) {
    return res.status(400).json({ error: 'Invalid subscription plan' });
  }

  const plan = subscriptionPlans[planId];

  try {
    // Create a new PayPal subscription request
    const request = new paypal.subscriptions.SubscriptionCreateRequest();
    request.requestBody({
      plan_id: planId,
      start_time: moment().add(1, 'month').toDate().toISOString(),
      application_context: {
        return_url: 'https://yourwebsite.com/success',
        cancel_url: 'https://yourwebsite.com/cancel',
      },
      subscriber: {
        email_address: req.user.email,
      },
      shipping_amount: {
        currency_code: 'ZAR',
        value: '0.00',
      },
    });

    // Execute the PayPal subscription request
    const response = await paypalClient.execute(request);

    // Save the subscription to the database
    const subscription = new Subscription({
      user: req.user.id,
      planId,
      startDate: new Date(),
      initialPayment: plan.initialPayment,
      monthlyPayment: plan.monthlyPayment,
      nextBillingDate: moment().add(1, 'month').toDate(),
      paypalSubscriptionId: response.result.id,
    });
    await subscription.save();

    res.status(201).json({ message: 'Subscription successful', subscription });
  } catch (error) {
    console.error('Error subscribing:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all subscriptions for the user
exports.getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user.id });
    res.status(200).json(subscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Cancel a subscription
exports.cancelSubscription = async (req, res) => {
  const { subscriptionId } = req.params;
  try {
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription || subscription.user.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Subscription not found or not authorized' });
    }

    // Create a cancel request for PayPal
    const request = new paypal.subscriptions.SubscriptionCancelRequest(subscription.paypalSubscriptionId);
    request.requestBody({});
    await paypalClient.execute(request);

    // Update the subscription status in the database
    subscription.status = 'canceled';
    await subscription.save();

    res.status(200).json({ message: 'Subscription canceled successfully', subscription });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get available subscription plans
exports.getSubscriptionPlans = (req, res) => {
  try {
    // Return subscription plans as an array
    res.status(200).json(Object.values(subscriptionPlans));
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
