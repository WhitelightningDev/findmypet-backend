// controllers/petController.js
const Pet = require('../models/Pet');
const User = require('../models/User');

exports.addPet = async (req, res) => {
  const { name, breed, age, photo } = req.body;
  try {
    const pet = new Pet({
      name,
      breed,
      age,
      photo,
      owner: req.user.id, // Associate pet with the logged-in user
    });
    await pet.save();
    res.status(201).json({ message: 'Pet added successfully', pet });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getPets = async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.user.id });
    res.status(200).json(pets);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updatePet = async (req, res) => {
  const { petId } = req.params;
  const { name, breed, age, photo } = req.body;
  try {
    const pet = await Pet.findById(petId);
    if (!pet || pet.owner.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Pet not found or not authorized' });
    }

    if (name) pet.name = name;
    if (breed) pet.breed = breed;
    if (age) pet.age = age;
    if (photo) pet.photo = photo;

    await pet.save();
    res.status(200).json({ message: 'Pet updated successfully', pet });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deletePet = async (req, res) => {
  const { petId } = req.params;
  try {
    const pet = await Pet.findById(petId);
    if (!pet || pet.owner.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Pet not found or not authorized' });
    }

    await pet.remove();
    res.status(200).json({ message: 'Pet deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
