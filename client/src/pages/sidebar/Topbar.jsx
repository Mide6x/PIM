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
          <div className="topbarContent0">
            <div className="flex1">
              <h3 style={{ fontSize: "21px" }}>
                Good Morning, <span>{userData.name} 👋</span>
              </h3>
            </div>
            <div className="flex2">
              <p style={{ color: "#878787" }}>
                Manage your products with NotBackOffice by leveraging a
                well-tested process.
              </p>
            </div>
          </div>
          <div className="topbarContent1">
            <div className="flex1">
              <FontAwesomeIcon
                icon={faBell}
                size="2xl"
                style={{ color: "#002270" }}
              />
            </div>
            <div className="flex2">
              <img src={userImage} className="logo-img2" alt="User" />
            </div>
            <div>
              <h3 style={{ fontSize: "18px" }}>
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
