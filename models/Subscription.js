const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  planId: String,
  startDate: Date,
  status: { type: String, enum: ['active', 'canceled'], default: 'active' },
  initialPayment: Number,
  monthlyPayment: Number,
  nextBillingDate: Date,
  paypalSubscriptionId: String, // PayPal subscription ID
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
