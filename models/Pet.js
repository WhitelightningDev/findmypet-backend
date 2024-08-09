const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  breed: { type: String, required: true },
  age: { type: Number, required: true },
  type: { type: String, required: true },  // New field for pet type
  tagType: { type: String, required: true }, // New field for tag type
  photo: { type: String, default: '' }, // Optional field for pet photo
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Pet', petSchema);
