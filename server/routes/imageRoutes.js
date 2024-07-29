const express = require("express");
const {
  processImages,
  getProcessedImages,
} = require("../controllers/imageController");

const router = express.Router();

router.post("/process", processImages);
router.get("/processedimages", getProcessedImages);

module.exports = router;
