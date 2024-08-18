import { useEffect, useState } from "react";
import {
  Button,
  Table,
  Modal,
  Form,
  Flex,
  Input,
  message,
  Space,
  Tabs,
  Card,
} from "antd";
import axios from "axios";
import PropTypes from "prop-types";
import { debounce } from "lodash";
import { Link } from "react-router-dom";

const { TabPane } = Tabs;

const MngManufacturers = () => {
  const [manufacturers, setManufacturers] = useState([]);
  const [archivedManufacturers, setArchivedManufacturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingManufacturer, setEditingManufacturer] = useState(null);
  const [activeTab, setActiveTab] = useState("live");

  const fetchManufacturers = async (search = "") => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/api/manufacturer",
        {
          params: { search },
        }
      );
      if (Array.isArray(response.data)) {
        setManufacturers(response.data.filter((m) => !m.isArchived));
        setArchivedManufacturers(response.data.filter((m) => m.isArchived));
      } else {
        setManufacturers([]);
        setArchivedManufacturers([]);
        message.error("Invalid data format received from server 🤔");
      }
    } catch (error) {
      message.error("Failed to fetch manufacturers 😔");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManufacturers();
  }, []);

  const handleEdit = (manufacturer) => {
    setEditingManufacturer(manufacturer);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/manufacturer/${id}`);
      message.success("Manufacturer deleted successfully 🎉");
      fetchManufacturers();
    } catch (error) {
      message.error("Failed to delete manufacturer 😔");
    }
  };

  const handleCreate = () => {
    setEditingManufacturer(null);
    setIsModalVisible(true);
  };

  const handleOk = async (values) => {
    try {
      if (editingManufacturer) {
        await axios.put(
          `http://localhost:3000/api/manufacturer/${editingManufacturer._id}`,
          values
        );
        message.success("Manufacturer updated successfully 🎉");
      } else {
        await axios.post("http://localhost:3000/api/manufacturer", values);
        message.success("Manufacturer created successfully 🎉");
      }
      fetchManufacturers();
      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to save manufacturer 😔");
    }
  };



  const handleUnarchive = async (manufacturer) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/manufacturer/${manufacturer._id}/unarchive`
      );
      message.success("Manufacturer unarchived successfully 🎉");
      fetchManufacturers();
    } catch (error) {
      message.error("Failed to unarchive manufacturer 😔");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSearch = debounce((value) => {
    if (value.length >= 3) {
      fetchManufacturers(value);
    } else {
      fetchManufacturers();
    }
  }, 300);

  const manufacturerCount = manufacturers.length + archivedManufacturers.length;
  const activeManufacturerCount = manufacturers.length;
  const inactiveManufacturerCount = archivedManufacturers.length;

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => <Link className="nameListing" to={`/manufacturers/${record._id}`}>{text}</Link>,
    },
    {
      title: "Date Created",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (text) => {
        if (!text) return null;
        const date = new Date(text);
        const options = {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        };
        return date.toLocaleString("en-GB", options).replace(",", " |");
      },
    },
    {
      title: "Number of Brands",
      dataIndex: "brands",
      key: "brands",
      render: (brands) => <span>{brands.length}</span>,
    },

    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button className="editBtn" onClick={() => handleEdit(record)}>
            Edit
          </Button>
         
          <Link to={`/manufacturers/${record._id}`}>
            <Button className="archiveBtn">
              View Details
            </Button>
          </Link>
        </Space>
      ),
    }
  ]

  const archivedColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",

      render: (text, record) => <Link className="nameListing" to={`/manufacturers/${record._id}`}>{text}</Link>,
    },
    {
      title: "Date Created",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (text) => {
        if (!text) return null;
        const date = new Date(text);
        const options = {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        };
        return date.toLocaleString("en-GB", options).replace(",", " ");
      },
    },
    {
      title: "Number of Brands",
      dataIndex: "brands",
      key: "brands",
      render: (brands) => <span>{brands.length}</span>,
    },

    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button className="editBtn" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button
            className="unarchiveBtn"
            onClick={() => handleUnarchive(record)}
          >
            Unarchive
          </Button>
          <Button
            className="deleteBtn"
            onClick={() => handleDelete(record._id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
        <Flex vertical flex={1} className="content">
          <div>
            <div className="intro">
              <h2>Manufacturers</h2>
            </div>
            <div className="stats-container">
              <Card className="stats-item0">
                <div className="stats-item-content">
                  <div className="text-content">
                    <p className="stats-item-header">Total Manufacturer</p>
                    <p className="stats-item-body">{manufacturerCount}</p>
                  </div>
                </div>
              </Card>

              <Card className="stats-item1">
                <div className="stats-item-content">
                  <div className="text-content">
                    <p className="stats-item-header">Active Manufacturers</p>
                    <p className="stats-item-body">{activeManufacturerCount}</p>
                  </div>
                </div>
              </Card>
              <Card className="stats-item2">
                <div className="stats-item-content">
                  <div className="text-content">
                    <p className="stats-item-header">Inactive Manufacturers</p>
                    <p className="stats-item-body">
                      {inactiveManufacturerCount}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
            <div className="details">
              <span style={{ margin: "0 8px", marginTop: "60px" }} />
              <Input
                placeholder="Search Manufacturers by Name"
                onChange={(e) => handleSearch(e.target.value)}
                style={{ marginBottom: "20px", width: "300px" }}
                className="searchBar"
              />
              <span style={{ margin: "0 8px" }} />
              <Button
                type="primary"
                className="spaced addBtn"
                onClick={handleCreate}
              >
                Add Manufacturer
              </Button>
              <Tabs
                activeKey={activeTab}
                onChange={(key) => setActiveTab(key)}
                className="table"
              >
                <TabPane tab="Live Manufacturers" key="live">
                  <Table
                    columns={columns}
                    dataSource={manufacturers}
                    loading={loading}
                    rowKey="_id"
                    pagination={{ position: ["bottomCenter"] }}
                  />
                </TabPane>
                <TabPane tab="Archived Manufacturers" key="archived">
                  <Table
                    columns={archivedColumns}
                    dataSource={archivedManufacturers}
                    loading={loading}
                    rowKey="_id"
                    pagination={{ position: ["bottomCenter"] }}
                  />
                </TabPane>
              </Tabs>
            </div>
            <Modal
              title={
                editingManufacturer
                  ? "Edit Manufacturer"
                  : "Create Manufacturer"
              }
              open={isModalVisible}
              onCancel={handleCancel}
              footer={null}
            >
              <ManufacturerForm
                initialValues={editingManufacturer}
                onCancel={handleCancel}
                onOk={handleOk}
              />
            </Modal>
          </div>
        </Flex>
  );
};

const ManufacturerForm = ({ initialValues, onCancel, onOk }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues, form]);

  const onFinish = (values) => {
    onOk(values);
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <p className="formTitle">Manufacturer Details</p>
      <Form.Item
        name="name"
        rules={[{ required: true, message: "Please input the name!" }]}
      >
        <Input className="userInput" placeholder="Name" />
      </Form.Item>
      <Form.Item
        name="brands"
        rules={[
          {
            required: true,
            message: "Please input the brands!",
          },
        ]}
      >
        <Input className="userInput" placeholder="Brands" />
      </Form.Item>
      <Form.Item className="concludeBtns">
        <Button className="editBtn" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          className="addBtn"
          type="primary"
          htmlType="submit"
          style={{ marginLeft: "10px" }}
        >
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

ManufacturerForm.propTypes = {
  initialValues: PropTypes.object,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
};

MngManufacturers.propTypes = {
  manufacturers: PropTypes.array,
  archivedManufacturers: PropTypes.array,
  loading: PropTypes.bool,
  isModalVisible: PropTypes.bool,
  editingManufacturer: PropTypes.object,
  activeTab: PropTypes.string,
};

export default MngManufacturers;
