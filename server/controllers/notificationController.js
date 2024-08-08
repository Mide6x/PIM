const Notification = require('../models/notificationModel');

// Create a new notification
exports.createNotification = async (req, res, next) => {
  try {
    const notification = await Notification.create({
      message: req.body.message,
    });
    res.status(201).json({
      status: 'success',
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

// Get all notifications
exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find()
      .sort('-createdAt');
    res.status(200).json({
      status: 'success',
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.status(200).json({
      status: 'success',
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

//deleting notifications
exports.deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({
        status: 'fail',
        message: 'Notification not found',
      });
    }
    res.status(200).json({
      status: 'success',
      message: 'Notification deleted',
    });
  } catch (error) {
    next(error);
  }
};
