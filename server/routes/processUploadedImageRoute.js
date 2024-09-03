const express = require("express");
const router = express.Router();
const { uploadImage } = require("../controllers/processUploadedImageController");

// Route to handle image upload
router.post("/", uploadImage);

module.exports = router;
