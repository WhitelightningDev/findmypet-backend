const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Route to add a new pet
router.post('/add', upload.single('photo'), petController.addPet);

// Route to get all pets for the logged-in user
router.get('/', petController.getPets);

// Route to update a pet's image
router.put('/:id/image', upload.single('photo'), petController.updatePetImage);

// Route to delete a pet
router.delete('/:id', petController.deletePet);

module.exports = router;
