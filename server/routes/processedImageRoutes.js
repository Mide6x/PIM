const express = require("express");
const { getProcessedImages, deleteAllProcessedImages } = require("../controllers/imageController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Images
 *     description: API endpoints for managing processed images
 */

/**
 * @swagger
 * /api/v1/images:
 *   get:
 *     tags:
 *       - Images
 *     summary: Get processed images
 *     description: Retrieve a list of all processed images.
 *     responses:
 *       200:
 *         description: A list of processed images
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Image ID
 *                   url:
 *                     type: string
 *                     description: URL of the processed image
 */
router.get("/", getProcessedImages);

/**
 * @swagger
 * /api/v1/images/deleteProcessedImages:
 *   delete:
 *     tags:
 *       - Images
 *     summary: Delete all processed images
 *     description: Delete all processed images from the database.
 *     responses:
 *       204:
 *         description: All processed images deleted successfully
 */
router.delete("/deleteProcessedImages", deleteAllProcessedImages);

module.exports = router;
