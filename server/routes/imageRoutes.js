const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');

router.post('/upload', imageController.uploadImage);
router.post('/process', imageController.processImages);
router.get('/processed', imageController.getProcessedImages);
router.delete('/processed', imageController.deleteAllProcessedImages);

module.exports = router;
