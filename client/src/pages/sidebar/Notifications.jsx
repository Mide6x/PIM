import { useState, useEffect } from "react";
import axios from "axios";
import "./Sidebar.css";
import PropTypes from "prop-types";

const NotificationSidebar = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    console.log('Fetching all notifications');
    axios
      .get('http://localhost:3000/api/notifications/')
      .then((response) => {
        console.log('Fetched notifications:', response.data);
        setNotifications(response.data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
        setNotifications([]);
      });
  }, []);

  const handleNotificationClick = (id) => {
    axios.patch(`http://localhost:3000/api/notifications/${id}/read`).then(() => {
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? { ...notification, read: true }
            : notification
        )
      );
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
