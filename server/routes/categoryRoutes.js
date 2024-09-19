const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API endpoints for managing categories
 */

/**
 * @swagger
 * /api/v1/categories:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Get all categories
 *     description: Retrieve a list of all categories.
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter categories by name
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *   post:
 *     tags:
 *       - Categories
 *     summary: Create a new category
 *     description: Create a new category.
 *     requestBody:
 *       description: Category data to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               subcategories:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 */

router.route("/")
  .get(categoryController.getCategories)
  .post(categoryController.createCategory);

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Get a Category
 *     description: Retrieve a specific Category by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the Category to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Category not found
 *   put:
 *     tags:
 *       - Categories
 *     summary: Update a Category
 *     description: Update a specific Category by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the Category to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Category data to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               subcategories:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         description: Category not found
 *   delete:
 *     tags:
 *       - Categories
 *     summary: Delete a Category
 *     description: Delete a specific Category by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the Category to delete.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */

router.route("/:id")
  .get(categoryController.getCategoryById)
  .put(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

/**
 * @swagger
 * /api/v1/categories/{categoryName}/subcategories:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Get subcategories by category name
 *     description: Retrieve all subcategories for a specific category.
 *     parameters:
 *       - in: path
 *         name: categoryName
 *         required: true
 *         description: The name of the category to retrieve subcategories for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of subcategories
 *       404:
 *         description: Category not found
 */
router.get("/:categoryName/subcategories", categoryController.getSubcategories);

/**
 * @swagger
 * /api/v1/categories/{id}/archive:
 *   patch:
 *     tags:
 *       - Categories
 *     summary: Archive a category
 *     description: Archive a specific category by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the category to archive.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category archived successfully
 *       404:
 *         description: Category not found
 */
router.patch("/:id/archive", categoryController.archiveCategory);

/**
 * @swagger
 * /api/v1/categories/{id}/unarchive:
 *   patch:
 *     tags:
 *       - Categories
 *     summary: Unarchive a category
 *     description: Unarchive a specific category by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the category to unarchive.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category unarchived successfully
 *       404:
 *         description: Category not found
 */
router.patch("/:id/unarchive", categoryController.unarchiveCategory);

router.post('/bulk-upload', categoryController.bulkUploadAndArchive);

module.exports = router;