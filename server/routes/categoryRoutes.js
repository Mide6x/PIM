const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

router.get("/", categoryController.getCategories);
router.post("/", categoryController.createCategory);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);
router.get("/:id/subcategories", categoryController.getSubcategories);
router.patch("/:id/archive", categoryController.archiveCategory);
router.patch("/:id/unarchive", categoryController.unarchiveCategory);

module.exports = router;
