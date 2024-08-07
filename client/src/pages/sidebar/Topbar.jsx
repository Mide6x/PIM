import useAuth from "../../contexts/useAuth";
import "./Sidebar.css";
import userImage from "../../assets/user.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

const Topbar = () => {
  const { userData } = useAuth();

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
              <FontAwesomeIcon
                icon={faBell}
                size="xl"
                 className="iconContent3"
              />
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
    </>
  );
};

export default Topbar;
