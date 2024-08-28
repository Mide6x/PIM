const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');


/**
 * @swagger
 * tags:
 *   - name: Images
 *     description: API endpoints for managing processed images
 */

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload an image to Cloudinary
 *     tags: Images
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
 */
router.post('/upload', imageController.uploadImage);

/**
 * @swagger
 * /process:
 *   post:
 *     summary: Process multiple images
 *     tags: Images
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: The images were processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.post('/process', imageController.processImages);

/**
 * @swagger
 * /processed:
 *   get:
 *     summary: Get all processed images
 *     tags: Images
 *     responses:
 *       200:
 *         description: List of processed images
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/processed', imageController.getProcessedImages);

/**
 * @swagger
 * /processed:
 *   delete:
 *     summary: Delete all processed images
 *     tags: Images
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
 *     responses:
 *       200:
 *         description: All processed images were deleted
 */
router.delete('/processed', imageController.deleteAllProcessedImages);

module.exports = router;
