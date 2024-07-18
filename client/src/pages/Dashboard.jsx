import { useEffect, useState } from "react";
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  Select,
  message,
  Space,
} from "antd";
import axios from "axios";
import PropTypes from "prop-types";
import Sidebar from "./sidebar/Sidebar";

const { Option } = Select;

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/products");
      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        setProducts([]);
        message.error("Invalid data format received from server");
      }
    } catch (error) {
      message.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/products/${id}`);
      message.success("Product deleted successfully 🎉");
      fetchProducts();
    } catch (error) {
      message.error("Failed to delete product");
    }
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setIsModalVisible(true);
  };

  const handleOk = async (values) => {
    try {
      if (editingProduct) {
        await axios.put(
          `http://localhost:3000/api/products/${editingProduct._id}`,
          values
        );
        message.success("Product updated successfully 🎉");
      } else {
        await axios.post("http://localhost:3000/api/products", values);
        message.success("Product created successfully 🎉");
      }
      fetchProducts();
      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to save product");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "imageUrl1",
      key: "imageUrl1",
      render: (text, record) => (
        <img
          src={record.imageUrl1}
          alt={record.productName}
          style={{ maxWidth: "200px", maxHeight: "200px" }}
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
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
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
      <div className="content">
        {products.length > 0 && (
          <div>
            <h2>Products Dashboard 📦</h2>
            <p className="spaced">
              From here, you can manually create and edit products.
            </p>

            <Button type="primary" className="spaced" onClick={handleCreate}>
              Add New Product
            </Button>
            <Table
              columns={columns}
              dataSource={products}
              loading={loading}
              rowKey="_id"
            />
          </div>
        )}
        {products.length === 0 && !loading && <p>No products found.</p>}
      </div>
      <Modal
        title={editingProduct ? "Edit Product" : "Create Product"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <ProductForm
          initialValues={editingProduct}
          onCancel={handleCancel}
          onOk={handleOk}
        />
      </Modal>
    </div>
  );
};

const ProductForm = ({ initialValues, onCancel, onOk }) => {
  const [form] = Form.useForm();
  const [manufacturers, setManufacturers] = useState([]);

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues, form]);

  useEffect(() => {
    const fetchManufacturers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/manufacturer"
        );
        setManufacturers(response.data);
      } catch (error) {
        message.error("Failed to fetch manufacturers");
      }
    };

    fetchManufacturers();
  }, []);

  const onFinish = (values) => {
    onOk(values);
  };

  return (
    <Form form={form} onFinish={onFinish} initialValues={initialValues}>
      <Form.Item
        name="manufacturerName"
        label="Manufacturer Name"
        rules={[
          { required: true, message: "Please enter the manufacturer name" },
        ]}
      >
        <Select>
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
        <Input />
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
        name="productName"
        label="Product Name"
        rules={[{ required: true, message: "Please enter the product name" }]}
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
        name="imageUrl1"
        label="Image URL"
        rules={[{ required: true, message: "Please enter the image URL" }]}
      >
        <Input />
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

ProductForm.propTypes = {
  initialValues: PropTypes.object,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
};

export default Dashboard;
