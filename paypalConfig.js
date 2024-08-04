// paypalConfig.js
const paypal = require('@paypal/checkout-server-sdk');
const dotenv = require('dotenv');

dotenv.config();

// PayPal environment configuration
const environment = new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
const client = new paypal.core.PayPalHttpClient(environment);

module.exports = client;
