import PropTypes from "prop-types";
import React, { useState, useEffect, useCallback } from "react";
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
import useAuth from "../../contexts/useAuth";
import "./Sidebar.css";
import logoImage from "../../assets/logo.png";

const menuItems = [
  { key: "1", label: "Dashboard", icon: faChartSimple, to: "/dashboard" },
  { key: "2", label: "Manage Manufacturers", icon: faIndustry, to: "/mngmanufacturers" },
  { key: "3", label: "Manage Categories", icon: faCartShopping, to: "/categories" },
  { key: "4", label: "Image Conversion", icon: faImage, to: "/images" },
  { key: "5", label: "Data Cleaning", icon: faDatabase, to: "/uploadtab" },
  { key: "6", label: "Approve Products", icon: faFileCircleCheck, to: "/approval" },
  { key: "7", label: "Variant Types", icon: faScaleBalanced, to: "/variants" },
];

const getIcon = (icon) => (
  <FontAwesomeIcon icon={icon} size="lg" style={{ color: "#ffffff" }} />
);

const MenuItem = React.memo(function MenuItem({ item, isActive }) {
  const { key, label, to, icon } = item;
  return (
    <Menu.Item
      key={key}
      icon={getIcon(icon)}
      style={{ padding: "5px", color: "#ffffff", fontWeight: "450" }}
      className={isActive ? "active-menu-item" : "menuItem"}
    >
      <Link to={to}>{label}</Link>
    </Menu.Item>
  );
});
MenuItem.displayName = "MenuItem"; 

MenuItem.propTypes = {
  item: PropTypes.shape({
    key: PropTypes.string.isRequired,
    icon: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
  }).isRequired,
  isActive: PropTypes.bool.isRequired,
};

const Sidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const [currentKey, setCurrentKey] = useState("");

  useEffect(() => {
    const activeItem = menuItems.find((item) => item.to === location.pathname);
    setCurrentKey(activeItem ? activeItem.key : "");
  }, [location.pathname]);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return (
    <div className="barbody">
      <Header logoImage={logoImage} />

      <Menu
        mode="inline"
        selectedKeys={[currentKey]}
        style={{ marginTop: "20px", fontSize: "15px", backgroundColor: "#212B36" }}
      >
        {menuItems.map((item) => (
          <MenuItem key={item.key} item={item} isActive={item.key === currentKey} />
        ))}
      </Menu>

      <LogoutSection handleLogout={handleLogout} />
    </div>
  );
};


const Header = ({ logoImage }) => (
  <div className="header">
    <div className="image">
      <img src={logoImage} className="logo-img" alt="Logo" />
    </div>
  </div>
);

Header.propTypes = {
  logoImage: PropTypes.string.isRequired,
};


const LogoutSection = React.memo(({ handleLogout }) => (
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
));

LogoutSection.propTypes = {
  handleLogout: PropTypes.func.isRequired,
};

LogoutSection.displayName = "LogoutSection";  
export default Sidebar;
