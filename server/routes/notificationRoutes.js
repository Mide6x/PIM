const express = require('express');
const {
  createNotification,
  getNotifications,
  markAsRead,
} = require('../controllers/notificationController');

const router = express.Router();

router.post('/', createNotification);
router.get('/', getNotifications);
router.patch('/:id/read', markAsRead);

module.exports = router;
