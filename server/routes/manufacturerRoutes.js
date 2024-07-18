const express = require("express");
const router = express.Router();
const manufacturerController = require("../controllers/manufacturerController");

// Get all manufacturers
router.get("/", manufacturerController.getManufacturers);

// Create a new manufacturer
router.post("/", manufacturerController.createManufacturer);

// Update a manufacturer
router.put("/:id", manufacturerController.updateManufacturer);

// Delete a manufacturer
router.delete("/:id", manufacturerController.deleteManufacturer);

module.exports = router;
