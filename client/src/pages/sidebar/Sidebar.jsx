import PropTypes from "prop-types";
import { Menu, Button } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  ContainerOutlined,
  DatabaseOutlined,
  PieChartOutlined,
  MacCommandOutlined,
  CheckSquareOutlined,
  FileImageOutlined
} from "@ant-design/icons";
import useAuth from "../../contexts/useAuth";
import "./Sidebar.css";

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
    to: "/images"
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
  }
];

const MenuItem = ({ item }) => (
  <Menu.Item key={item.key} icon={item.icon}>
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
};

const Sidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const currentKey = items.find(item => item.to === location.pathname)?.key || "1";

  return (
    <div className="barbody">
      <Menu
        defaultSelectedKeys={[currentKey]}
        mode="inline"
        selectedKeys={[currentKey]}
        className="spacedbar"
      >
        {items.map((item) => (
          <MenuItem key={item.key} item={item} />
        ))}
      </Menu>
      <Button onClick={handleLogout} danger className="logout-button">
        Logout
      </Button>
    </div>
  );
};

export default Sidebar;
