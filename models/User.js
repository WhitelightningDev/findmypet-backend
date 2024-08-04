const mongoose = require('mongoose');

// Define the address schema
const addressSchema = new mongoose.Schema({
  street: String,
  number: String,
  suburb: String,
  country: String,
  province: String
});

// Define the user schema
const userSchema = new mongoose.Schema({
  name: String,
  surname: String,
  address: addressSchema,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});

// Create and export the User model
module.exports = mongoose.model('User', userSchema);
