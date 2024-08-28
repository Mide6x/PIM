const express = require('express');
const imageController = require('../controllers/imageController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Images
 *     description: API endpoints for managing processed images
 */

/**
 * @swagger
 * /api/v1/upload:
 *   post:
 *     tags:
 *       - Images
 *     summary: Upload an image to Cloudinary
 *     description: Upload an image to Cloudinary and receive its URL.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload
 *     responses:
 *       200:
 *         description: The image was successfully uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 imageUrl:
 *                   type: string
 *                   description: The URL of the uploaded image
 *       400:
 *         description: Invalid image format
 *       500:
 *         description: Internal server error
 */
router.route('/upload')
  .post(imageController.uploadImage);

/**
 * @swagger
 * /api/v1/process:
 *   post:
 *     tags:
 *       - Images
 *     summary: Process multiple images
 *     description: Process a list of images and apply transformations.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 imageUrl:
 *                   type: string
 *                   description: The URL of the image to process
 *                 transformations:
 *                   type: array
 *                   items:
 *                     type: string
 *                     description: The transformation to apply (e.g., "resize:200x200")
 *     responses:
 *       200:
 *         description: The images were processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   processedImageUrl:
 *                     type: string
 *                     description: The URL of the processed image
 *       400:
 *         description: Invalid image URL or transformations
 *       500:
 *         description: Internal server error
 */
router.route('/process')
  .post(imageController.processImages);

/**
 * @swagger
 * /api/v1/processed:
 *   get:
 *     tags:
 *       - Images
 *     summary: Get all processed images
 *     description: Retrieve a list of all processed images.
 *   delete:
 *     tags:
 *       - Images
 *     summary: Delete all processed images
 *     description: Delete all processed images by providing their IDs.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imageIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of image IDs to delete
 *     responses:
 *       200:
 *         description: All processed images were deleted
 *       400:
 *         description: Invalid image IDs
 *       500:
 *         description: Internal server error
 */
router.route('/processed')
  .get(imageController.getProcessedImages)
  .delete(imageController.deleteAllProcessedImages);

module.exports = router;