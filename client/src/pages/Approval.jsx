import { useEffect, useState, useCallback } from "react";
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  Select,
  message,
  Space,
  Tabs,
} from "antd";
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
  const [duplicateApprovals, setDuplicateApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async (search = "") => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/approvals", {
        params: { search },
      });

      const data = response.data;
      setApprovals(data.filter((item) => item.status === "pending"));
      setRejectedApprovals(data.filter((item) => item.status === "rejected"));
      setApprovedApprovals(data.filter((item) => item.status === "approved"));
    } catch (error) {
      console.error("Error fetching approvals:", error); 
      message.error("Failed to fetch approvals 😔");
    } finally {
      setLoading(false);
    }
  };
  const handleBulkApprove = async () => {
    setLoading(true);
    try {
      const approvedItems = selectedRows.map(item => ({
        ...item,
        status: 'approved',
      }));
      await Promise.all(
        approvedItems.map(item =>
          axios.put(`http://localhost:3000/api/approvals/${item._id}`, item)
        )
      );
      message.success('Selected items approved successfully 🎉');
      fetchApprovals();
    } catch (error) {
      message.error('Failed to approve selected items 😔');
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
      message.error("Failed to delete approval entry 😔");
    }
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
      message.error("Failed to save approval entry 😔");
    }
  };

  const checkForDuplicates = async (products) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/products/check-duplicates",
        products
      );
      return response.data;
    } catch (error) {
      message.error("Failed to check for duplicates 😔");
      return [];
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const duplicateNames = await checkForDuplicates(approvedApprovals);
  
      if (duplicateNames.length > 0) {
        // Handle Duplicates
        const duplicateProducts = approvedApprovals.filter((product) =>
          duplicateNames.includes(product.productName)
        );
        const uniqueProducts = approvedApprovals.filter(
          (product) => !duplicateNames.includes(product.productName)
        );
  
        setDuplicateApprovals(duplicateProducts);
  
        if (uniqueProducts.length > 0) {
          await axios.post(
            "http://localhost:3000/api/products/bulk",
            uniqueProducts
          );
          message.success(
            "Unique products have been successfully pushed to the database"
          );
        }
  
        message.warning(
          "Some products are already in the database. Duplicates have been moved to the 'Duplicate Products' tab."
        );
  
        await axios.delete("http://localhost:3000/api/approvals/delete-approved");
        
      } else {
        await axios.post(
          "http://localhost:3000/api/products/bulk",
          approvedApprovals
        );
        message.success(
          "Approved products have been successfully pushed to the database 🎉"
        );
      }
  
      setApprovedApprovals([]);
      fetchApprovals();
    } catch (error) {
      message.error("Failed to process approved products");
    } finally {
      setLoading(false);
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

  const handleDeleteDuplicates = async () => {
    setLoading(true);
    try {
      const ids = duplicateApprovals.map((product) => product._id);
      await axios.post("http://localhost:3000/api/products/delete", { ids });
      message.success("Duplicate products have been deleted 🎉");
      fetchApprovals();
    } catch (error) {
      message.error("Failed to delete duplicate products 😔");
    } finally {
      setLoading(false);
    }
  };

  

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.status === "", // Example condition
    }),
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (imageUrl) => (
        <img
          src={imageUrl}
          alt="Product Image"
          style={{ width: 100, height: 100, objectFit: "cover" }}
        />
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
      title: "Weight (Kg)",
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
          <Button danger onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
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

  const duplicateColumns = [
    ...columns,
    {
      title: "Duplicate Status",
      dataIndex: "status",
      key: "status",
      render: () => "Duplicate",
    },
  ];

  return (
    <div className="container">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="content" style={{ padding: "20px" }}>
        <h2>Product Approval ✅</h2>
        <p className="spaced">
          From here, you can approve and edit products before pushing to the
          database.
        </p>
        <Input
          placeholder="Search products..."
          onChange={(e) => handleSearch(e.target.value)}
          style={{ marginBottom: "20px", width: "300px" }}
        />

        <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)}>
          <TabPane tab="Pending Approvals" key="pending">
            <Table
              columns={columns}
              dataSource={approvals}
              loading={loading}
              rowKey="_id"
              rowSelection={rowSelection}
            />
             <span style={{ margin: "0 8px" }} />
             <Button
  type="primary"
  className="archived"
  onClick={handleBulkApprove}
  style={{ marginBottom: "20px" }}
  disabled={selectedRows.length === 0}
>
  Approve Selected
</Button>
          </TabPane>
          <TabPane tab="Approved Products" key="approved">
            <Table
              columns={columns}
              dataSource={approvedApprovals}
              loading={loading}
              rowKey="_id"
            />
            <Button
              type="primary"
              onClick={handleConfirm}
              style={{ marginBottom: "20px" }}
            >
              Confirm and Push to Database
            </Button>
           
          </TabPane>
          <TabPane tab="Rejected Products" key="rejected">
            <Table
              columns={rejectedColumns}
              dataSource={rejectedApprovals}
              loading={loading}
              rowKey="_id"
            />
          </TabPane>
          <TabPane tab="Duplicate Products" key="duplicates">
            <Table
              columns={duplicateColumns}
              dataSource={duplicateApprovals}
              loading={loading}
              rowKey="_id"
            />
            <Button
              type="primary"
              onClick={handleDeleteDuplicates}
              style={{ marginBottom: "20px" }}
              danger
            >
              Delete Duplicates
            </Button>
          </TabPane>
        </Tabs>

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
      </div>
    </div>
  );
};

const ApprovalForm = ({ initialValues, onCancel, onOk }) => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [brands, setBrands] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [status, setStatus] = useState(initialValues?.status || "pending");

  const fetchManufacturers = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/manufacturer"
      );
      if (Array.isArray(response.data)) {
        setManufacturers(response.data);
      } else {
        console.error("Unexpected response format for manufacturers");
      }
    } catch (error) {
      message.error("Failed to fetch manufacturers 😔");
    }
  }, []);

  const fetchBrands = useCallback(
    async (manufacturerName) => {
      try {
        const manufacturer = manufacturers.find(
          (m) => m.name === manufacturerName
        );
        if (manufacturer) {
          setBrands(manufacturer.brands);
        } else {
          setBrands([]);
        }
      } catch (error) {
        message.error("Failed to fetch brands 😔");
      }
    },
    [manufacturers]
  );

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/categories");
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        console.error("Unexpected response format for categories");
      }
    } catch (error) {
      message.error("Failed to fetch categories 😔");
    }
  }, []);

  const fetchSubcategories = useCallback(async (categoryName) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/categories/${categoryName}/subcategories`
      );
      if (Array.isArray(response.data.subcategories)) {
        setSubcategories(response.data.subcategories);
      } else {
        console.error("Unexpected response format for subcategories");
      }
    } catch (error) {
      message.error("Failed to fetch subcategories 😔");
    }
  }, []);

  useEffect(() => {
    fetchManufacturers();
    fetchCategories();
  }, [fetchManufacturers, fetchCategories]);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      if (initialValues.productCategory) {
        fetchSubcategories(initialValues.productCategory);
      }
      if (initialValues.manufacturerName) {
        fetchBrands(initialValues.manufacturerName);
      }
      if (initialValues.status) {
        setStatus(initialValues.status);
      }
    }
  }, [initialValues, form, fetchBrands, fetchSubcategories]);

  const handleManufacturerChange = (value) => {
    fetchBrands(value);
  };

  const handleCategoryChange = (value) => {
    fetchSubcategories(value);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) => onOk({ ...values })}
      initialValues={initialValues}
    >
      <Form.Item
        label="Product Name"
        name="productName"
        rules={[{ required: true, message: "Please input the product name" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Manufacturer (Start typing to search)"
        name="manufacturerName"
        rules={[
          {
            required: true,
            message: "Please input the product's manufacturer",
          },
        ]}
      >
        <Select
          showSearch
          onChange={handleManufacturerChange}
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
          placeholder="Select a manufacturer"
        >
          {manufacturers
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((manufacturer) => (
              <Option key={manufacturer._id} value={manufacturer.name}>
                {manufacturer.name}
              </Option>
            ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Brand"
        name="brand"
        rules={[
          { required: true, message: "Please input the product's brand" },
        ]}
      >
        <Select>
          {brands.map((brand, index) => (
            <Option key={index} value={brand}>
              {brand}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Category (Start typing to search)"
        name="productCategory"
        rules={[
          { required: true, message: "Please input the product's category" },
        ]}
      >
        <Select
          showSearch
          onChange={handleCategoryChange}
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
          placeholder="Select a category"
        >
          {categories
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((category) => (
              <Option key={category.name} value={category.name}>
                {category.name}
              </Option>
            ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Subcategory"
        name="productSubcategory"
        rules={[
          { required: true, message: "Please input the product's subcategory" },
        ]}
      >
        <Select>
          {subcategories.map((subcategory) => (
            <Option key={subcategory} value={subcategory}>
              {subcategory}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Variant"
        name="variant"
        rules={[
          { required: true, message: "Please input the product variant" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Weight (Kg)"
        name="weightInKg"
        rules={[
          { required: true, message: "Please input the product's weight" },
        ]}
      >
        <Input type="number" />
      </Form.Item>
      <Form.Item
        label="Image URL"
        name="imageUrl"
        rules={[
          {
            required: true,
            message: "Please add an image URL (Cloudinary Format)",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Status" name="status">
        <Select onChange={handleStatusChange} value={status}>
          <Option value="pending">Pending</Option>
          <Option value="approved">Approved</Option>
          <Option value="rejected">Rejected</Option>
        </Select>
      </Form.Item>
      {status === "rejected" && (
        <Form.Item
          label="Reason for Rejection"
          name="rejectionReason"
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
        <Space>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            {initialValues ? "Update" : "Create"}
          </Button>
        </Space>
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