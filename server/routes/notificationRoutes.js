const express = require('express');
const {
  createNotification,
  getNotifications,
  markAsRead,
  deleteNotification
} = require('../controllers/notificationController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Notifications
 *     description: API endpoints for managing notifications
 */

/**
 * @swagger
 * /api/v1/notifications:
 *   post:
 *     tags:
 *       - Notifications
 *     summary: Create a notification
 *     description: Create a new notification.
 *     requestBody:
 *       description: Notification data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: The content of the notification
 *               read:
 *                 type: boolean
 *                 description: Read status of the notification
 *     responses:
 *       201:
 *         description: Notification created successfully
 */
router.post('/', createNotification);

/**
 * @swagger
 * /api/v1/notifications:
 *   get:
 *     tags:
 *       - Notifications
 *     summary: Get all notifications
 *     description: Retrieve a list of all notifications.
 *     responses:
 *       200:
 *         description: A list of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Notification ID
 *                   message:
 *                     type: string
 *                     description: The content of the notification
 *                   read:
 *                     type: boolean
 *                     description: Read status of the notification
 */
router.get('/', getNotifications);

/**
 * @swagger
 * /api/v1/notifications/{id}/read:
 *   patch:
 *     tags:
 *       - Notifications
 *     summary: Mark notification as read
 *     description: Mark a specific notification as read.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the notification to mark as read
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification marked as read successfully
 *       404:
 *         description: Notification not found
 */
router.patch('/:id/read', markAsRead);

/**
 * @swagger
 * /api/v1/notifications/{id}:
 *   delete:
 *     tags:
 *       - Notifications
 *     summary: Delete a notification
 *     description: Delete a specific notification by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the notification to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Notification deleted successfully
 *       404:
 *         description: Notification not found
 */
router.delete('/:id', deleteNotification);

module.exports = router;
