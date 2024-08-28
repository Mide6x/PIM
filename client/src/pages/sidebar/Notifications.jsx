import { useState, useEffect } from "react";
import axios from "axios";
import "./Sidebar.css";
import PropTypes from "prop-types";

const NotificationSidebar = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    console.log("Fetching all notifications");
    axios
      .get("https://prod-nnal.onrender.com/api/v1/notifications/")
      .then((response) => {
        setNotifications(response.data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
        setNotifications([]);
      });
  }, []);

  const handleNotificationClick = (id) => {
    axios
      .patch(`https://prod-nnal.onrender.com/api/v1/notifications/${id}/read`)
      .then(() => {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification._id === id
              ? { ...notification, read: true }
              : notification
          )
        );
      })
      .catch((error) => {
        console.error("Error marking notification as read:", error);
      });
  };

  const handleNotificationDelete = (id) => {
    axios
      .delete(`https://prod-nnal.onrender.com/api/v1/notifications/${id}`)
      .then(() => {
        setNotifications((prev) =>
          prev.filter((notification) => notification._id !== id)
        );
      })
      .catch((error) => {
        console.error("Error deleting notification:", error);
      });
  };

  return (
    <div className="notificationSidebar">
      <button className="closeButton" onClick={onClose}>
        ✖
      </button>
      <div className="notificationContent">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`notificationItem ${
                notification.read ? "read" : "unread"
              }`}
              onClick={() => handleNotificationClick(notification._id)}
            >
              {notification.message}
              <button
                className="deleteButton"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNotificationDelete(notification._id);
                }}
              >
                🗑️
              </button>
            </div>
          ))
        ) : (
          <p>No notifications</p>
        )}
      </div>
    </div>
  );
};

NotificationSidebar.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default NotificationSidebar;
