const express = require('express');
const variantController = require('../controllers/variantController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Variants
 *     description: API endpoints for managing product variants
 */

/**
 * @swagger
 * /api/v1/variants:
 *   get:
 *     tags:
 *       - Variants
 *     summary: Get all variants
 *     description: Retrieve a list of all product variants.
 *     responses:
 *       200:
 *         description: A list of variants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Variant ID
 *                   name:
 *                     type: string
 *                     description: The name of the variant
 *                   subvariants:
 *                     type: array
 *                     description: List of subvariants
 */
router.get('/', variantController.getVariants);

/**
 * @swagger
 * /api/v1/variants:
 *   post:
 *     tags:
 *       - Variants
 *     summary: Create a variant
 *     description: Create a new product variant.
 *     requestBody:
 *       description: Variant data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the variant
 *               subvariants:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Variant created successfully
 */
router.post('/', variantController.createVariant);

/**
 * @swagger
 * /api/v1/variants/{id}:
 *   put:
 *     tags:
 *       - Variants
 *     summary: Update a variant
 *     description: Update a specific variant by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the variant to update
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Variant data to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               subvariants:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Variant updated successfully
 *       404:
 *         description: Variant not found
 */
router.put('/:id', variantController.updateVariant);

/**
 * @swagger
 * /api/v1/variants/{id}:
 *   delete:
 *     tags:
 *       - Variants
 *     summary: Delete a variant
 *     description: Delete a specific variant by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the variant to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Variant deleted successfully
 *       404:
 *         description: Variant not found
 */
router.delete('/:id', variantController.deleteVariant);

/**
 * @swagger
 * /api/v1/variants/{id}/subvariants:
 *   post:
 *     tags:
 *       - Variants
 *     summary: Add a subvariant to a variant
 *     description: Add a new subvariant to a specific variant by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the variant
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Subvariant data to add
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Subvariant added successfully
 *       404:
 *         description: Variant not found
 */
router.post('/:id/subvariants', variantController.addSubVariant);

/**
 * @swagger
 * /api/v1/variants/{id}/subvariants/{subId}:
 *   delete:
 *     tags:
 *       - Variants
 *     summary: Delete a subvariant from a variant
 *     description: Delete a specific subvariant from a variant by variant ID and subvariant ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the variant
 *         schema:
 *           type: string
 *       - in: path
 *         name: subId
 *         required: true
 *         description: ID of the subvariant to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subvariant deleted successfully
 *       404:
 *         description: Variant or subvariant not found
 */
router.delete('/:id/subvariants/:subId', variantController.deleteSubVariant);

module.exports = router;
