const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Handle file uploads

router.use(authMiddleware);

router.post('/add', upload.single('photo'), petController.addPet);
router.get('/', petController.getPets);

module.exports = router;
