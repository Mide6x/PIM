import { useState, useEffect } from "react";
import axios from "axios";
import "./Sidebar.css";
import PropTypes from "prop-types";

const NotificationSidebar = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState(new Set());

  useEffect(() => {
    console.log("Fetching all notifications");
    axios
      .get("http://localhost:3000/api/notifications/")
      .then((response) => {
        console.log("Fetched notifications:", response.data);
        const fetchedNotifications = response.data.data || [];
        const readSet = new Set(
          fetchedNotifications.filter((n) => n.read).map((n) => n._id)
        );
        setNotifications(fetchedNotifications);
        setReadNotifications(readSet);
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
        setNotifications([]);
      });
  }, []);

  const handleNotificationClick = (id) => {
    axios
      .patch(`http://localhost:3000/api/notifications/${id}/read`)
      .then(() => {
        setReadNotifications((prev) => new Set(prev.add(id)));
        setNotifications((prev) =>
          prev.map((notification) =>
            notification._id === id
              ? { ...notification, read: true }
              : notification
          )
        );
      });
  };

  const handleNotificationDelete = (id) => {
    axios.delete(`http://localhost:3000/api/notifications/${id}`).then(() => {
      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== id)
      );
      setReadNotifications((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
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
                readNotifications.has(notification._id) ? "read" : "unread"
              }`}
              onClick={() => handleNotificationClick(notification._id)}
            >
              {notification.message}
              {readNotifications.has(notification._id) && (
                <button
                  className="deleteButton"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNotificationDelete(notification._id);
                  }}
                >
                  🗑️
                </button>
              )}
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
