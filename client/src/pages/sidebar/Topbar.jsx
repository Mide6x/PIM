import { useState, useEffect } from "react";
import useAuth from "../../contexts/useAuth";
import axios from "axios";
import "./Sidebar.css";
import NotificationSidebar from "./Notifications";
import userImage from "../../assets/user.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

const Topbar = () => {
  const { userData } = useAuth();
  const [showSidebar, setShowSidebar] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(false);

  useEffect(() => {
    if (userData && userData._id) {
      axios.get(`http://localhost:3000/api/v1/notifications/`)
        .then((response) => {
          const unreadNotifications = response.data.data.some(notification => !notification.read);
          setHasNotifications(unreadNotifications);
        })
        .catch((error) => {
          console.error("Error fetching notifications:", error);
        });
    }
  }, [userData]);

  const getGreeting = () => {
    const now = new Date();
    const hour = now.getHours();

    if (hour < 12) {
      return "Good Morning";
    } else if (hour < 17) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  const handleBellClick = () => {
    setShowSidebar(true);
    setHasNotifications(false);
  };

  const handleSidebarClose = () => {
    setShowSidebar(false);
  };

  return (
    <>
      {userData && (
        <div className="topbarContent">
          <div className="topbarContent0">
            <h3>
              {getGreeting()}, <span>{userData.name} 👋 </span>
            </h3>
          </div>
          <div className="topbarContent1">
            <div className="flex1">
              <div className="bellIconWrapper">
                <FontAwesomeIcon
                  icon={faBell}
                  size="xl"
                  className="iconContent3"
                  onClick={handleBellClick}
                />
                {hasNotifications && <div className="notificationDot"></div>}
              </div>
            </div>
            <div className="flex2">
              <img src={userImage} className="logo-img2" alt="User" />
            </div>
            <div className="flex3">
              <h3>
                <span>{userData.name}.</span>
              </h3>
              <p style={{ fontSize: "12px", color: "#878787" }}>
                {userData.email}
              </p>
            </div>
          </div>
        </div>
      )}
      {showSidebar && <NotificationSidebar userId={userData._id} onClose={handleSidebarClose} />}
    </>
  );
};

export default Topbar;
