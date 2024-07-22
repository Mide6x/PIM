import { useEffect, useState } from "react";
import { Button, Table, Modal, Flex, Form, Input, Select, message, Space, Tabs } from "antd";
import axios from "axios";
import PropTypes from "prop-types";
import Sidebar from "./sidebar/Sidebar";
import { debounce } from "lodash";

const { Option } = Select;
const { TabPane } = Tabs;

const Approval = () => {
  const [approvals, setApprovals] = useState([]);
  const [rejectedApprovals, setRejectedApprovals] = useState([]);
  const [approvedApprovals, setApprovedApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/approvals");
      setApprovals(response.data.filter((item) => item.status === "pending"));
      setRejectedApprovals(response.data.filter((item) => item.status === "rejected"));
      setApprovedApprovals(response.data.filter((item) => item.status === "approved"));
    } catch (error) {
      message.error("Failed 😔 to fetch approvals");
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
      message.success("Approval entry deleted successfully 🎉 🎉");
      fetchApprovals();
    } catch (error) {
      message.error("Failed 😔 to delete approval entry");
    }
  };

 

  const handleOk = async (values) => {
    try {
      if (editingItem) {
        await axios.put(`http://localhost:3000/api/approvals/${editingItem._id}`, values);
        message.success("Approval entry updated successfully 🎉 🎉");
      } else {
        await axios.post("http://localhost:3000/api/approvals", values);
        message.success("Approval entry created successfully 🎉 🎉");
      }
      fetchApprovals();
      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed 😔 to save approval entry");
    }
  };

  const checkForDuplicates = async (products) => {
    try {
      const response = await axios.post("http://localhost:3000/api/products/check-duplicates", products);
      return response.data;
    } catch (error) {
      message.error("Failed 😔 to check for duplicates");
      return [];
    }
  };

  const handleConfirm = async () => {
    try {
      const duplicateNames = await checkForDuplicates(approvedApprovals);

      if (duplicateNames.length > 0) {
        message.warning(`Some products are already in the database: ${duplicateNames.join(', ')}`);
      }

      const uniqueProducts = approvedApprovals.filter(product => !duplicateNames.includes(product.productName));
      await axios.post("http://localhost:3000/api/products/bulk", uniqueProducts);

      message.success("Approved products have been successfully 🎉 pushed to the database 🎉");
      fetchApprovals();
    } catch (error) {
      message.error("Failed 😔 to push approved products to the database");
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
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (imageUrl) => (
        <img src={imageUrl} alt="Product Image" style={{ width: 100, height: 100, objectFit: "cover" }} />
      ),
    },
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
      title: "Weight (in Kg)",
      dataIndex: "weightInKg",
      key: "weightInKg",
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
          <Button danger onClick={() => handleDelete(record._id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  const rejectedColumns = [
    ...columns,
    {
      title: "Rejection Reason",
      dataIndex: "rejectionReason",
      key: "rejectionReason",
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
            From here, you can approve and edit products before pushing to the database.
          </p>
          <Input
            placeholder="Search products..."
            onChange={(e) => handleSearch(e.target.value)}
            style={{ marginBottom: "20px", width: "300px" }}
          />
          
          <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)}>
            <TabPane tab="Pending Approvals" key="pending">
              <Table columns={columns} dataSource={approvals} loading={loading} rowKey="_id" />
            </TabPane>
            <TabPane tab="Approved Products" key="approved">
              <Table columns={columns} dataSource={approvedApprovals} loading={loading} rowKey="_id" />
              <Button
                type="primary"
                onClick={handleConfirm}
                style={{ marginBottom: "20px" }}
              >
                Confirm and Push to Database
              </Button>
            </TabPane>
            <TabPane tab="Rejected Products" key="rejected">
              <Table columns={rejectedColumns} dataSource={rejectedApprovals} loading={loading} rowKey="_id" />
            </TabPane>
          </Tabs>
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
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [status, setStatus] = useState(initialValues?.status || "pending");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      setSelectedCategory(initialValues.productCategory);
      fetchSubcategories(initialValues.productCategory);
    }
  }, [initialValues, form]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/categories");
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        setCategories([]);
        message.error("Invalid data format received from server");
      }
    } catch (error) {
      message.error("Failed 😔 to fetch categories");
    }
  };

  const fetchSubcategories = async (categoryName) => {
    try {
      if (!categoryName) return;
      const response = await axios.get(`http://localhost:3000/api/categories/${categoryName}/subcategories`);
      if (Array.isArray(response.data)) {
        setSubcategories(response.data);
      } else {
        setSubcategories([]);
        message.error("Invalid data format received from server");
      }
    } catch (error) {
      message.error("Failed 😔 to fetch subcategories");
    }
  };

  const onCategoryChange = (value) => {
    setSelectedCategory(value);
    fetchSubcategories(value);
  };

  const onFinish = (values) => {
    onOk(values);
  };

  return (
    <Form form={form} onFinish={onFinish} initialValues={initialValues}>
      <Form.Item
        name="productName"
        label="Product Name"
        rules={[{ required: true, message: "Please enter the product name" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="manufacturerName"
        label="Manufacturer Name"
        rules={[{ required: true, message: "Please select the manufacturer name" }]}
      >
        <Select>
          {/* Manufacturer options */}
        </Select>
      </Form.Item>
      <Form.Item
        name="brand"
        label="Brand"
        rules={[{ required: true, message: "Please enter the brand" }]}
      >
        <Select>
          {/* Brand options */}
        </Select>
      </Form.Item>
      <Form.Item
        name="productCategory"
        label="Product Category"
        rules={[{ required: true, message: "Please select the product category" }]}
      >
        <Select onChange={onCategoryChange}>
          {categories.map((category) => (
            <Option key={category._id} value={category.name}>
              {category.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="productSubcategory"
        label="Subcategory"
        rules={[{ required: true, message: "Please select the subcategory" }]}
      >
        <Select disabled={!selectedCategory}>
          {subcategories.map((subcategory) => (
            <Option key={subcategory} value={subcategory}>
              {subcategory}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="variant"
        label="Variant"
        rules={[{ required: true, message: "Please enter the variant" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="weightInKg"
        label="Weight (in Kg)"
        rules={[{ required: true, message: "Please enter the weight (in Kg)" }]}
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
        <Select onChange={(value) => setStatus(value)}>
          <Option value="pending">Pending</Option>
          <Option value="approved">Approve</Option>
          <Option value="rejected">Reject</Option>
        </Select>
      </Form.Item>
      {status === "rejected" && (
        <Form.Item
          name="rejectionReason"
          label="Rejection Reason"
          rules={[
            {
              required: true,
              message: "Please provide a reason for rejection",
            },
          ]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
      )}
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
