const Pet = require('../models/Pet');

// Add a new pet
exports.addPet = async (req, res) => {
  try {
    const { name, breed, age } = req.body;
    const photo = req.file ? req.file.path : ''; // Handle photo upload

    const newPet = new Pet({
      name,
      breed,
      age,
      photo,
      user: req.user.id // Associate pet with the logged-in user
    });
    await newPet.save();
    res.status(201).json(newPet);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add pet', error: err.message });
  }
};

// Get all pets for the logged-in user
exports.getPets = async (req, res) => {
  try {
    const pets = await Pet.find({ user: req.user.id });
    res.status(200).json(pets);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch pets', error: err.message });
  }
};
