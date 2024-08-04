const express = require('express');
const { addPet, getPets, updatePet, deletePet } = require('../controllers/petController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Middleware to protect routes
router.use(authMiddleware);

// Routes
router.post('/add', addPet);         // Add a new pet
router.get('/', getPets);            // Get all pets for the logged-in user
router.put('/:petId', updatePet);    // Update a specific pet by ID
router.delete('/:petId', deletePet); // Delete a specific pet by ID

module.exports = router;
