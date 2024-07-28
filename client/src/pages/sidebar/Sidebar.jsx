import PropTypes from "prop-types";
import { Menu, Button } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  ContainerOutlined,
  DatabaseOutlined,
  PieChartOutlined,
  MacCommandOutlined,
  CheckSquareOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import useAuth from "../../contexts/useAuth";
import { useState, useEffect } from "react";
import "./Sidebar.css";
import logoImage from "../../assets/boxes.svg";

const items = [
  {
    key: "1",
    icon: <DatabaseOutlined />,
    label: "Product Catalogue",
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
    className={isActive ? 'active-menu-item' : ''}
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

  useEffect(() => {
    const currentItem = items.find(item => item.to === location.pathname);
    setCurrentKey(currentItem ? currentItem.key : "");
  }, [location.pathname]);


  const handleLogout = () => {
    logout();
  };

  return (
    <div className="barbody">
      <div className="header" style={{ marginBottom: "40px" }}>
        <div className="image">
          <img src={logoImage} className="logo-img" alt="Logo" />
        </div>
        <div>
          <h3>
            <a style={{ color: "#20d4a7" }}>Not</a>
            <a style={{ color: "#ad83dc" }}>Back</a>
            <a style={{ color: "#5a8afb" }}>Office</a>
            <a style={{ color: "#ad83dc" }}>.</a>
          </h3>
        </div>
      </div>
      {userData && (
              <div>
                <h3>Hi, {userData.name}.</h3>
                <p style={{ fontSize: "14px" }}>
                  {userData.email}
                </p>
              </div>
            )}
      <Menu
        mode="inline"
        selectedKeys={[currentKey]}
        style={{ marginTop: "40px", fontSize:"15px" }}
      >
        {items.map((item) => (
          <MenuItem
          className="menuitem"
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
