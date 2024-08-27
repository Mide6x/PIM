const express = require("express");
const productController = require("../controllers/productController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: API endpoints for managing products
 */

/**
 * @swagger
 * /api/v1/products/{id}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get a product
 *     description: Retrieve a specific product by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Product not found
 *   put:
 *     tags:
 *       - Products
 *     summary: Update a product
 *     description: Update a specific product by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Product data to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *   delete:
 *     tags:
 *       - Products
 *     summary: Delete a product
 *     description: Delete a specific product by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to delete.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.route("/:id")
  .get(productController.getProductById)
  .put(productController.updateProduct)
  .delete(productController.deleteProduct);

/**
 * @swagger
 * /api/v1/products/bulk:
 *   post:
 *     tags:
 *       - Products
 *     summary: Bulk create products
 *     description: Create multiple products at once.
 *     requestBody:
 *       description: Array of products to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 price:
 *                   type: number
 *     responses:
 *       201:
 *         description: Products created successfully
 */
router.post("/bulk", productController.bulkCreateProducts);

/**
 * @swagger
 * /api/v1/products/check-duplicates:
 *   post:
 *     tags:
 *       - Products
 *     summary: Check for duplicate products
 *     description: Check for duplicate products in the database.
 *     requestBody:
 *       description: Product data to check for duplicates
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Duplicates check performed successfully
 */
router.post("/check-duplicates", productController.checkForDuplicates);

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get all products
 *     description: Retrieve a list of all products.
 *     responses:
 *       200:
 *         description: A list of products
 *   post:
 *     tags:
 *       - Products
 *     summary: Create a product
 *     description: Create a new product.
 *     requestBody:
 *       description: Product data to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router
  .route("/")
  .get(productController.getAllProducts)
  .post(productController.createProduct);

module.exports = router;
