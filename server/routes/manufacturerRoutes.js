const express = require("express");
const router = express.Router();
const manufacturerController = require("../controllers/manufacturerController");

router.get("/", manufacturerController.getManufacturers);
router.get("/:id", manufacturerController.getManufacturerById);
router.post("/", manufacturerController.createManufacturer);
router.post('/bulk-upload', manufacturerController.bulkUploadAndArchive);
router.put("/:id", manufacturerController.updateManufacturer);
router.post("/:id/brands", manufacturerController.addBrandsToManufacturer);
router.delete("/:id", manufacturerController.deleteManufacturer);
router.patch("/:id/archive", manufacturerController.archiveManufacturer);
router.patch("/:id/unarchive", manufacturerController.unarchiveManufacturer);

module.exports = router;
