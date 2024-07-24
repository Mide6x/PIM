const express = require("express");
const { getProcessedImages } = require('../controllers/imageController');

const router = express.Router();

router.get('/', getProcessedImages);

module.exports = router;
