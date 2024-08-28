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
  Upload,
} from "antd";
import axios from "axios";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowUp } from "@fortawesome/free-solid-svg-icons";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
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
        "https://prod-nnal.onrender.com/api/v1/manufacturer",
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

  const handleUpload = (info) => {
    const file = info.file;
    if (!file) {
      message.error("No file selected");
      return;
    }
    if (
      !file.type.includes("spreadsheetml.sheet") &&
      !file.type.includes("excel")
    ) {
      message.error("Invalid file type. Please upload an Excel file. 🤔");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer = e.target.result;
      try {
        const wb = XLSX.read(arrayBuffer, { type: "array" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const parsedData = XLSX.utils.sheet_to_json(ws);

        const hasEmptyVariants = parsedData.some(
          (item) => !item["Manufacturer"]
        );
        if (hasEmptyVariants) {
          message.error(
            "Some rows have empty Manufacturer values. Please check your file. 🤔"
          );
          return;
        }
        console.log("Parsed data:", parsedData);
      } catch (error) {
        message.error(
          "Failed to read the file. Ensure it is a valid Excel (XLSX) file. 😔"
        );
        console.error("Error reading file:", error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch("/BulkUploadManufacturers.xlsx");
      if (!response.ok) throw new Error("File not found");

      const blob = await response.blob();
      saveAs(blob, "BulkUploadManufacturers.xlsx");
    } catch (error) {
      message.error(`Failed to download template: ${error.message} 😔`);
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
      await axios.delete(`https://prod-nnal.onrender.com/api/v1/manufacturer/${id}`);
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
          `https://prod-nnal.onrender.com/api/v1/manufacturer/${editingManufacturer._id}`,
          values
        );
        message.success("Manufacturer updated successfully 🎉");
      } else {
        await axios.post("https://prod-nnal.onrender.com/api/v1/manufacturer", values);
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
        `https://prod-nnal.onrender.com/api/v1/manufacturer/${manufacturer._id}/unarchive`
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
      render: (text, record) => (
        <Link className="nameListing" to={`/manufacturers/${record._id}`}>
          {text}
        </Link>
      ),
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
            <Button className="archiveBtn">View Details</Button>
          </Link>
        </Space>
      ),
    },
  ];

  const archivedColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",

      render: (text, record) => (
        <Link className="nameListing" to={`/manufacturers/${record._id}`}>
          {text}
        </Link>
      ),
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
                <p className="stats-item-body">{inactiveManufacturerCount}</p>
              </div>
            </div>
          </Card>
        </div>
        <div className="details">
          <span style={{ margin: "0 8px", marginTop: "60px" }} />
          <div className="searchBarContainer">
            <Input
              placeholder="Search Manufacturer by name"
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: "100%" }}
              className="searchBar"
            />
            <Button type="primary" className="addBtn" onClick={handleDownload}>
              Download Excel Template
            </Button>
            <Upload
              name="file"
              accept=".xlsx, .xls"
              beforeUpload={() => false}
              onChange={handleUpload}
              showUploadList={false}
            >
              <Button type="primary" className="archiveBtn">
                <FontAwesomeIcon
                  icon={faFileArrowUp}
                  size="lg"
                  style={{ color: "#008162" }}
                />
                Bulk Upload Manufacturers
              </Button>
            </Upload>

            <Button type="primary" className="addBtn" onClick={handleCreate}>
              Add Manufacturer
            </Button>
          </div>
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
            editingManufacturer ? "Edit Manufacturer" : "Create Manufacturer"
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
