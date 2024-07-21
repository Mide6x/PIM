const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// Get all categories
router.get("/", categoryController.getCategories);

// Create a new category
router.post("/", categoryController.createCategory);

// Update a category
router.put("/:id", categoryController.updateCategory);

// Delete a category
router.delete("/:id", categoryController.deleteCategory);

// Get subcategories by category name
router.get("/:categoryName/subcategories", categoryController.getSubcategories);

module.exports = router;
