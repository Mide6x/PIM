const express = require("express");
const router = express.Router();
const manufacturerController = require("../controllers/manufacturerController");

router.get("/", manufacturerController.getManufacturers);
router.post("/", manufacturerController.createManufacturer);
router.put("/:id", manufacturerController.updateManufacturer);
router.delete("/:id", manufacturerController.deleteManufacturer);
router.patch("/:id/archive", manufacturerController.archiveManufacturer);

module.exports = router;
