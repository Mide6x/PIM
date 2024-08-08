import PropTypes from "prop-types";
import { Menu, Button } from "antd";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDatabase,
  faChartLine,
  faImage,
  faFileCircleCheck,
  faIndustry,
  faCartShopping,
} from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../contexts/useAuth";
import { useState, useEffect } from "react";
import "./Sidebar.module.css";
import logoImage from "../../assets/logo.png";

const items = [
  {
    key: "1",
    icon: (
      <FontAwesomeIcon
        icon={faChartLine}
        size="lg"
        style={{ color: "#ffffff" }}
      />
    ),
    label: "Dashboard",
    to: "/dashboard",
  },
  {
    key: "2",
    label: "Image Conversion",
    icon: (
      <FontAwesomeIcon icon={faImage} size="lg" style={{ color: "#ffffff" }} />
    ),
    to: "/images",
  },
  {
    key: "3",
    icon: (
      <FontAwesomeIcon
        icon={faDatabase}
        size="lg"
        style={{ color: "#ffffff" }}
      />
    ),
    label: "Data Cleaning",
    to: "/uploadtab",
  },
  {
    key: "4",
    icon: (
      <FontAwesomeIcon
        icon={faFileCircleCheck}
        size="lg"
        style={{ color: "#ffffff" }}
      />
    ),
    label: "Approve Products",
    to: "/approval",
  },
  {
    key: "5",
    icon: (
      <FontAwesomeIcon
        icon={faCartShopping}
        size="lg"
        style={{ color: "#ffffff" }}
      />
    ),
    label: "Manage Categories",
    to: "/categories",
  },
  {
    key: "6",
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
];

const MenuItem = ({ item, isActive }) => (
  <Menu.Item
    key={item.key}
    icon={item.icon}
    style={{ padding: "5px", color: "#e8efff", fontWeight: "450" }}
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
        <div style={{ color: "#ffff", alignItems: "center" }}>
          <h3>NotBackOffice.</h3>
        </div>
      </div>

      <Menu
        mode="inline"
        selectedKeys={[currentKey]}
        style={{
          marginTop: "20px",
          fontSize: "15px",
          backgroundColor: "#002270",
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
      <Button onClick={handleLogout} danger className="logout-button">
        Logout
      </Button>
    </div>
  );
};

export default Sidebar;
