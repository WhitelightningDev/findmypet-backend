const Pet = require('../models/Pet');
const path = require('path');
const fs = require('fs');

// Add a new pet
exports.addPet = async (req, res) => {
  try {
    const { name, breed, age, type, tagType } = req.body;
    const photo = req.file ? req.file.filename : ''; // Handle photo upload

    const newPet = new Pet({
      name,
      breed,
      age,
      type,
      tagType, // Save tagType
      photo, // Save photo
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

// Update pet image
exports.updatePetImage = async (req, res) => {
  try {
    const petId = req.params.id; // Get the pet ID from the URL
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    if (req.file) {
      // Remove old image if it exists
      if (pet.photo) {
        const oldImagePath = path.join(__dirname, '../uploads', pet.photo);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Save new image path
      pet.photo = req.file.filename; // Adjust path based on your upload setup
    }

    await pet.save();
    res.status(200).json({ message: 'Pet image updated successfully', pet });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update pet image', error: err.message });
  }
};

// Delete a pet
exports.deletePet = async (req, res) => {
  try {
    const petId = req.params.id; // Get the pet ID from the URL
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Remove images if they exist
    if (pet.photo) {
      const imagePath = path.join(__dirname, '../uploads', pet.photo);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Pet.findByIdAndDelete(petId);
    res.status(200).json({ message: 'Pet deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete pet', error: err.message });
  }
};
