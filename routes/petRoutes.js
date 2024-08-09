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

router.use(authMiddleware);

router.post('/add', upload.single('photo'), petController.addPet);
router.get('/', petController.getPets);
router.put('/:id/image', upload.single('photo'), petController.updatePetImage); // Route for updating pet image
router.delete('/:id', petController.deletePet); // Route for deleting a pet

module.exports = router;
