import PropTypes from "prop-types";
import { Menu, Button, message } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  ContainerOutlined,
  DatabaseOutlined,
  PieChartOutlined,
  MacCommandOutlined,
  CheckSquareOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import axios from "axios";
import useAuth from "../../contexts/useAuth";
import { useState, useEffect } from "react";
import "./Sidebar.css";
import logoImage from "../../assets/logo.png";

const items = [
  {
    key: "1",
    icon: <DatabaseOutlined />,
    label: "Dashboard",
    to: "/dashboard",
  },
  {
    key: "2",
    label: "Image Transformation",
    icon: <FileImageOutlined />,
    to: "/images",
  },
  {
    key: "3",
    icon: <PieChartOutlined />,
    label: "Data Cleaning",
    to: "/uploadtab",
  },
  {
    key: "4",
    icon: <CheckSquareOutlined />,
    label: "Approve Products",
    to: "/approval",
  },
  {
    key: "5",
    icon: <ContainerOutlined />,
    label: "Manage Categories",
    to: "/categories",
  },
  {
    key: "6",
    label: "Manage Manufacturers",
    icon: <MacCommandOutlined />,
    to: "/mngmanufacturers",
  },
];

const MenuItem = ({ item, isActive }) => (
  <Menu.Item
    key={item.key}
    icon={item.icon}
    style={{padding:'5px'}}
    className={isActive ? "active-menu-item" : ""}
  >
    {item.to ? <Link to={item.to}>{item.label}</Link> : item.label}
  </Menu.Item>
);

MenuItem.propTypes = {
  item: PropTypes.shape({
    key: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
    label: PropTypes.string.isRequired,
    to: PropTypes.string,
  }).isRequired,
  isActive: PropTypes.bool.isRequired,
};

const Sidebar = () => {
  const { logout, userData } = useAuth();
  const location = useLocation();
  const [currentKey, setCurrentKey] = useState("");
  const [userCount, setUserCount] = useState(0);

  const fetchCounts = async () => {
    try {
      const userRep = await axios.get("http://localhost:3000/api/users");
      setUserCount(userRep.data.length);
    } catch (error) {
      message.error("Failed to fetch Users 😔");
    }
  };

  useEffect(() => {
    const currentItem = items.find((item) => item.to === location.pathname);
    setCurrentKey(currentItem ? currentItem.key : "");
    fetchCounts();
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="barbody">
      <div className="header">
        <div className="image">
          <img src={logoImage} className="logo-img" alt="Logo" />
        </div>
        <div>
          <h3>NotBackOffice.</h3>
        </div>
      </div>
      <div className="teamDetails">Team - {userCount} Members</div>
      <Menu
        mode="inline"
        selectedKeys={[currentKey]}
        style={{ marginTop: "20px", fontSize: "15px" }}
      >
        {items.map((item) => (
          <MenuItem
            key={item.key}
            item={item}
            isActive={item.key === currentKey}
          />
        ))}
      </Menu>
      <div className="logout-tab">
        {userData && (
          <div>
            <h3 style={{ fontSize: "20px" }}>
              Hi, <span>{userData.name}</span>{" "}
              <span>.</span>
            </h3>
            <p style={{ fontSize: "13px" }}>{userData.email}</p>
          </div>
        )}
        <Button onClick={handleLogout} danger className="logout-button">
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
