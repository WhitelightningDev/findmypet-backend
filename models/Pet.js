const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  breed: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  tag: {
    type: String,
    required: true
  },
  photo: {
    type: String, // Stores the filename or path to the photo
    required: false
  },
  tagImage: {
    type: String, // Stores the filename or path to the tag image
    required: false
  }
});

const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;
