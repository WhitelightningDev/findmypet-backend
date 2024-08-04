const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  planId: String,
  startDate: Date,
  status: { type: String, enum: ['active', 'canceled'], default: 'active' },
  initialPayment: { type: Number, default: 350 },
  monthlyPayment: { type: Number, default: 75 },
  nextBillingDate: Date,
  paypalSubscriptionId: String, // PayPal subscription ID
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
