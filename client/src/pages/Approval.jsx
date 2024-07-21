import { useEffect, useState } from "react";
import {
  Button,
  Table,
  Modal,
  Flex,
  Form,
  Input,
  Select,
  message,
  Space,
} from "antd";
import axios from "axios";
import PropTypes from "prop-types";
import Sidebar from "./sidebar/Sidebar";
import { debounce } from "lodash";

const { Option } = Select;

const Approval = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/approvals");
      setApprovals(response.data);
    } catch (error) {
      message.error("Failed to fetch approvals");
    } finally {
      setLoading(false);
    }
  };

  

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/approvals/${id}`);
      message.success("Approval entry deleted successfully 🎉");
      fetchApprovals();
    } catch (error) {
      message.error("Failed to delete approval entry");
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setIsModalVisible(true);
  };

  const handleOk = async (values) => {
    try {
      if (editingItem) {
        await axios.put(
          `http://localhost:3000/api/approvals/${editingItem._id}`,
          values
        );
        message.success("Approval entry updated successfully 🎉");
      } else {
        await axios.post("http://localhost:3000/api/approvals", values);
        message.success("Approval entry created successfully 🎉");
      }
      fetchApprovals();
      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to save approval entry");
    }
  };
  const handleSearch = debounce((value) => {
    if (value.length >= 3) {
      fetchApprovals(value);
    } else {
      fetchApprovals();
    }
  }, 300);

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Manufacturer",
      dataIndex: "manufacturerName",
      key: "manufacturerName",
    },
    {
      title: "Category",
      dataIndex: "productCategory",
      key: "productCategory",
    },
    {
      title: "Variant",
      dataIndex: "variant",
      key: "variant",
    },
    {
      title: "Weight",
      dataIndex: "weight",
      key: "weight",
    },
    {
      title: "Image URL",
      dataIndex: "imageUrl",
      key: "imageUrl",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
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
        </Space>
      ),
    },
  ];

  return (
    <div className="container">
      <div className="sidebar">
        <Sidebar />
      </div>
      <Flex vertical flex={1} className="content">
        <div>
          <h2>Product Approval ✅</h2>
          <p className="spaced">
            From here, you can approve and edit products before pushing to the
            database.
          </p>
          <Input
              placeholder="Search products..."
              onChange={(e) => handleSearch(e.target.value)}
              style={{ marginBottom: "20px", width: "300px" }}
            />{" "}
            <span style={{ margin: "0 8px" }} />
          <Button type="primary" className="spaced" onClick={handleCreate}>
            Create New Approval
          </Button>
          <Table
            columns={columns}
            dataSource={approvals}
            loading={loading}
            rowKey="_id"
          />
        </div>

        <Modal
          title={editingItem ? "Edit Approval Entry" : "Create Approval Entry"}
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <ApprovalForm
            initialValues={editingItem}
            onCancel={handleCancel}
            onOk={handleOk}
  
          />
        </Modal>
      </Flex>
    </div>
  );
};

const ApprovalForm = ({ initialValues, onCancel, onOk }) => {
  const [form] = Form.useForm();
  const [manufacturers, setManufacturers] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues, form]);

  useEffect(() => {
    const fetchManufacturers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/manufacturer");
        setManufacturers(response.data);
      } catch (error) {
        message.error("Failed to fetch manufacturers");
      }
    };

    fetchManufacturers();
  }, []);

  const onManufacturerChange = (value) => {
    const selectedManu = manufacturers.find(
      (manufacturer) => manufacturer.name === value
    );
    setSelectedManufacturer(selectedManu);
    setBrands(selectedManu ? selectedManu.brands : []);
    form.setFieldsValue({ brand: null }); 
  };

  const onFinish = (values) => {
    onOk(values);
  };

  return (
    <Form form={form} onFinish={onFinish} initialValues={initialValues}>
      <Form.Item
        name="productName"
        label="Product Name"
        rules={[
          { required: true, message: "Please enter the product name" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="manufacturerName"
        label="Manufacturer Name"
        rules={[
          { required: true, message: "Please select the manufacturer name" },
        ]}
      >
        <Select onChange={onManufacturerChange}>
          {manufacturers.map((manufacturer) => (
            <Option key={manufacturer._id} value={manufacturer.name}>
              {manufacturer.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="brand"
        label="Brand"
        rules={[{ required: true, message: "Please enter the brand" }]}
      >
        <Select disabled={!selectedManufacturer}>
          {brands.map((brand, index) => (
            <Option key={index} value={brand}>
              {brand}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="productCategory"
        label="Product Category"
        rules={[
          { required: true, message: "Please enter the product category" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="variant"
        label="Variant"
        rules={[{ required: true, message: "Please enter the variant" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="weight"
        label="Weight"
        rules={[{ required: true, message: "Please enter the weight" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="imageUrl"
        label="Image URL"
        rules={[{ required: true, message: "Please enter the image URL" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="status"
        label="Status"
        rules={[{ required: true, message: "Please select the status" }]}
      >
        <Select>
          <Option value="pending">Pending</Option>
          <Option value="approved">Approved</Option>
          <Option value="rejected">Rejected</Option>
        </Select>
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

ApprovalForm.propTypes = {
  initialValues: PropTypes.object,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
};

export default Approval;
