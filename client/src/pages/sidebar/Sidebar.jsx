import PropTypes from "prop-types";
import { Menu, Button } from "antd";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDatabase,
  faImage,
  faFileCircleCheck,
  faIndustry,
  faCartShopping,
  faChartSimple,
  faScaleBalanced,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import useAuth from "../../contexts/useAuth";
import "./Sidebar.module.css";
import logoImage from "../../assets/logo.png";

const items = [
  {
    key: "1",
    label: "Dashboard",
    icon: (
      <FontAwesomeIcon
        icon={faChartSimple}
        size="lg"
        style={{ color: "#ffffff" }}
      />
    ),
    to: "/dashboard",
  },
  {
    key: "2",
    label: "Manage Manufacturers",
    icon: (
      <FontAwesomeIcon
        icon={faIndustry}
        size="lg"
        style={{ color: "#ffffff" }}
      />
    ),
    to: "/mngmanufacturers",
  },
  {
    key: "3",
    label: "Manage Categories",
    icon: (
      <FontAwesomeIcon
        icon={faCartShopping}
        size="lg"
        style={{ color: "#ffffff" }}
      />
    ),
    to: "/categories",
  },
  {
    key: "4",
    label: "Image Conversion",
    icon: (
      <FontAwesomeIcon icon={faImage} size="lg" style={{ color: "#ffffff" }} />
    ),
    to: "/images",
  },
  {
    key: "5",
    label: "Data Cleaning",
    icon: (
      <FontAwesomeIcon
        icon={faDatabase}
        size="lg"
        style={{ color: "#ffffff" }}
      />
    ),
    to: "/uploadtab",
  },
  {
    key: "6",
    label: "Approve Products",
    icon: (
      <FontAwesomeIcon
        icon={faFileCircleCheck}
        size="lg"
        style={{ color: "#ffffff" }}
      />
    ),
    to: "/approval",
  },
  {
    key: "7",
    label: "Variant Types",
    icon: (
      <FontAwesomeIcon
        icon={faScaleBalanced}
        size="lg"
        style={{ color: "#ffffff" }}
      />
    ),
    to: "/variants",
  },
];

const MenuItem = ({ item, isActive }) => (
  <Menu.Item
    key={item.key}
    icon={item.icon}
    style={{ padding: "5px", color: "#ffffff", fontWeight: "450" }}
    className={isActive ? "active-menu-item" : "menuItem"}
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
  const { logout } = useAuth();
  const location = useLocation();
  const [currentKey, setCurrentKey] = useState("");

  useEffect(() => {
    const currentItem = items.find((item) => item.to === location.pathname);
    setCurrentKey(currentItem ? currentItem.key : "");
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
      </div>

      <Menu
        mode="inline"
        selectedKeys={[currentKey]}
        style={{
          marginTop: "20px",
          fontSize: "15px",
          backgroundColor: "#212B36",
        }}
      >
        {items.map((item) => (
          <MenuItem
            key={item.key}
            item={item}
            isActive={item.key === currentKey}
          />
        ))}
      </Menu>

      <div className="logout-container">
        <div className="logoutContainer0">
          <span>Sabi</span>
        </div>
        <div className="logoutContainer1">
          <Button onClick={handleLogout} danger className="logout-button">
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
