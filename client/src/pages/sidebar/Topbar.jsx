import useAuth from "../../contexts/useAuth";
import "./Sidebar.css";
import userImage from "../../assets/user.png";

const Topbar = () => {
  const { userData } = useAuth();

  return (
    <>
      {userData && (
        <div className="topbarContent">
          <div className="userImage">
            <img src={userImage} className="logo-img2" alt="User" />
          </div>
          <div>
            <h3 style={{ fontSize: "20px" }}>
              Hi, <span>{userData.name}</span> <span>.</span>
            </h3>
            <p style={{ fontSize: "13px", color: "#878787" }}>
              {userData.email}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Topbar;
