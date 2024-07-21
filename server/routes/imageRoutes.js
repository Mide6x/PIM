
const express = require("express");

const { processImages } = require('../controllers/imageController');

const router = express.Router();

router.post('/process', processImages);

module.exports = router;
