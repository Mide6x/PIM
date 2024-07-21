const express = require("express");
const productController = require("../controllers/productController");

const router = express.Router();

// Bulk create products
router.post('/bulk', productController.bulkCreateProducts);

// Check for duplicate products
router.post('/check-duplicates', productController.checkForDuplicates);

// Get all products and create a new product
router
  .route("/")
  .get(productController.getAllProducts)
  .post(productController.createProduct);

// Get, update, and delete a product by ID
router
  .route("/:id")
  .get(productController.getProductById)
  .put(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
