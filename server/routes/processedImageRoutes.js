const express = require("express");
const { getProcessedImages } = require('../controllers/imageController');
const { deleteAllProcessedImages } = require('../controllers/imageController');

const router = express.Router();

router.get('/', getProcessedImages);
router.delete('/deleteProcessedImages', deleteAllProcessedImages);

module.exports = router;

