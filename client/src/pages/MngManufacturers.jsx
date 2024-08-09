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
  List,
  Tabs,
} from "antd";
import axios from "axios";
import Sidebar from "./sidebar/Sidebar";
import Topbar from "./sidebar/Topbar";
import PropTypes from "prop-types";
import { debounce } from "lodash";

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

  const handleArchive = async (manufacturer) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/manufacturer/${manufacturer._id}/archive`
      );
      message.success("Manufacturer archived successfully 🎉");
      fetchManufacturers();
    } catch (error) {
      message.error("Failed to archive manufacturer 😔");
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

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Brands",
      dataIndex: "brands",
      key: "brands",
      render: (brands) => (
        <List
          dataSource={brands}
          renderItem={(brand) => <List.Item>{brand}</List.Item>}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button className="archived" onClick={() => handleArchive(record)}>
            Archive
          </Button>
        </Space>
      ),
    },
  ];

  const archivedColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Brands",
      dataIndex: "brands",
      key: "brands",
      render: (brands) => (
        <List
          dataSource={brands}
          renderItem={(brand) => <List.Item>{brand}</List.Item>}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button danger onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
          <Button
            className="unarchived"
            onClick={() => handleUnarchive(record)}
          >
            Unarchive
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="container">
      <div>
        <Sidebar />
      </div>
      <div className="fullcontent">
        <div className="cont">
          <Topbar />
        </div>
        <Flex vertical flex={1} className="content">
          <div>
            <h2>Manufacturers</h2>
            <div className="details" style={{ marginTop: "20px" }}>
              <span style={{ margin: "0 8px" }} />
              <Input
                placeholder="Search manufacturers..."
                onChange={(e) => handleSearch(e.target.value)}
                style={{ marginBottom: "20px", width: "300px" }}
              />
              <span style={{ margin: "0 8px" }} />
              <Button type="primary" className="spaced" onClick={handleCreate}>
                Add New Manufacturer
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
                  />
                </TabPane>
                <TabPane tab="Archived Manufacturers" key="archived">
                  <Table
                    columns={archivedColumns}
                    dataSource={archivedManufacturers}
                    loading={loading}
                    rowKey="_id"
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
      </div>
    </div>
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
    <Form form={form} onFinish={onFinish} initialValues={initialValues}>
      <Form.Item
        name="name"
        label="Manufacturer Name"
        rules={[
          { required: true, message: "Please enter the manufacturer name" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="brands"
        label="Brands"
        rules={[{ required: true, message: "Please enter at least one brand" }]}
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
        <span style={{ margin: "0 8px" }} />
        <Button type="default" danger onClick={onCancel}>
          Cancel
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

export default MngManufacturers;
