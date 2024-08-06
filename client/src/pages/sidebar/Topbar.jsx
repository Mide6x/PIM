import useAuth from "../../contexts/useAuth";
import "./Sidebar.css";
import userImage from "../../assets/user.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

const Topbar = () => {
  const { userData } = useAuth();

  return (
    <>
      {userData && (
        <div className="topbarContent">
          <div className="icon">
          <FontAwesomeIcon icon={faBell} size="2xl" style={{color: "#1c60ff"}} />
          </div>
          <div className="userImage">
            <img src={userImage} className="logo-img2" alt="User" />
          </div>
          <div>
            <h3 style={{ fontSize: "18px" }}>
              Hi, <span>{userData.name}</span> <span>.</span>
            </h3>
            <p style={{ fontSize: "12px", color: "#878787" }}>
              {userData.email}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Topbar;
