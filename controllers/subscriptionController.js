const Subscription = require('../models/Subscription');
const paypalClient = require('../paypalConfig');
const paypal = require('@paypal/checkout-server-sdk');
const moment = require('moment');

exports.subscribe = async (req, res) => {
  const { planId, paymentMethod } = req.body;
  try {
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

    const response = await paypalClient.execute(request);

    const subscription = new Subscription({
      user: req.user.id,
      planId,
      startDate: new Date(),
      initialPayment: 350,
      monthlyPayment: 50,
      nextBillingDate: moment().add(1, 'month').toDate(),
      paypalSubscriptionId: response.result.id,
    });
    await subscription.save();

    res.status(201).json({ message: 'Subscription successful', subscription });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user.id });
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.cancelSubscription = async (req, res) => {
  const { subscriptionId } = req.params;
  try {
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription || subscription.user.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Subscription not found or not authorized' });
    }

    const request = new paypal.subscriptions.SubscriptionCancelRequest(subscription.paypalSubscriptionId);
    request.requestBody({});
    await paypalClient.execute(request);

    subscription.status = 'canceled';
    await subscription.save();

    res.status(200).json({ message: 'Subscription canceled successfully', subscription });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
