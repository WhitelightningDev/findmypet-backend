// models/Subscription.js
const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  planId: String, // Reference to your subscription plans
  startDate: Date,
  status: { type: String, enum: ['active', 'canceled'], default: 'active' },
  initialPayment: { type: Number, default: 350 }, // Initial signup fee
  monthlyPayment: { type: Number, default: 75 },   // Monthly recurring fee
  nextBillingDate: Date, // To track the next billing date
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
