import PropTypes from "prop-types";
import { Menu, Button } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import useAuth from "../../contexts/useAuth";
import "./Sidebar.css";

const items = [
  {
    key: "1",
    icon: <PieChartOutlined />,
    label: "Dashboard",
    to: "/dashboard",
  },
  {
    key: "2",
    icon: <DesktopOutlined />,
    label: "Product Upload",
    to: "/uploadtab",
  },
  {
    key: "3",
    icon: <ContainerOutlined />,
    label: "Categories",
    to: "/categories",
  },
  {
    key: "sub1",
    label: "Product Details",
    icon: <AppstoreOutlined />,
    children: [
      {
        key: "4",
        label: "Manage Manufacturers",
      },
      {
        key: "5",
        label: "Manage Categories",
      },
    ],
  },
  {
    key: "sub2",
    label: "More Details",
    icon: <AppstoreOutlined />,
    children: [
      {
        key: "6",
        label: "Image Catalogue",
      },
      {
        key: "7",
        label: "Report Error",
      },
    ],
  },
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

const SubMenu = ({ item }) => (
  <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
    {item.children.map((child) =>
      child.children ? (
        <SubMenu key={child.key} item={child} />
      ) : (
        <MenuItem key={child.key} item={child} />
      )
    )}
  </Menu.SubMenu>
);

SubMenu.propTypes = {
  item: PropTypes.shape({
    key: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
    label: PropTypes.string.isRequired,
    children: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        to: PropTypes.string,
        children: PropTypes.array,
      })
    ).isRequired,
  }).isRequired,
};

const Sidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <Menu
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        theme="light"
        selectedKeys={[location.pathname]}
      >
        {items.map((item) =>
          item.children ? (
            <SubMenu key={item.key} item={item} />
          ) : (
            <MenuItem key={item.key} item={item} />
          )
        )}
        <Button onClick={handleLogout} className="logout-button">
          Logout
        </Button>
      </Menu>
    </>
  );
};

export default Sidebar;
