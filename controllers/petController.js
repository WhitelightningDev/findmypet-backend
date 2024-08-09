const Pet = require('../models/Pet');
const path = require('path');
const fs = require('fs');

// Add a new pet
exports.addPet = async (req, res) => {
  try {
    const { name, breed, age, type, tagType } = req.body;
    const photo = req.files['photo'] ? req.files['photo'][0].filename : ''; // Handle photo upload
    const tagImage = req.files['tagImage'] ? req.files['tagImage'][0].filename : ''; // Handle tag image upload

    const newPet = new Pet({
      name,
      breed,
      age,
      type,
      tagType,
      photo,
      tagImage, // Save tag image
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

// Update pet image and tag image
exports.updatePetImage = async (req, res) => {
  try {
    const petId = req.params.id; // Get the pet ID from the URL
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    if (req.files['photo']) {
      // Remove old image if it exists
      if (pet.photo) {
        const oldImagePath = path.join(__dirname, '../uploads', pet.photo);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Save new image path
      pet.photo = req.files['photo'][0].filename; // Adjust path based on your upload setup
    }

    if (req.files['tagImage']) {
      // Remove old tag image if it exists
      if (pet.tagImage) {
        const oldTagImagePath = path.join(__dirname, '../uploads', pet.tagImage);
        if (fs.existsSync(oldTagImagePath)) {
          fs.unlinkSync(oldTagImagePath);
        }
      }

      // Save new tag image path
      pet.tagImage = req.files['tagImage'][0].filename; // Adjust path based on your upload setup
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

    if (pet.tagImage) {
      const tagImagePath = path.join(__dirname, '../uploads', pet.tagImage);
      if (fs.existsSync(tagImagePath)) {
        fs.unlinkSync(tagImagePath);
      }
    }

    await Pet.findByIdAndDelete(petId);
    res.status(200).json({ message: 'Pet deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete pet', error: err.message });
  }
};
