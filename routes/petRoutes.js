const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Handle file uploads

router.use(authMiddleware);

router.post('/add', upload.single('photo'), petController.addPet);
router.get('/', petController.getPets);
router.put('/:id/image', upload.single('photo'), petController.updatePetImage); // Route for updating pet image

module.exports = router;
