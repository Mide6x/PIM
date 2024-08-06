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
  Card,
} from "antd";
import axios from "axios";
import PropTypes from "prop-types";
import Sidebar from "./sidebar/Sidebar";
import Topbar from "./sidebar/Topbar";
import productImage from "../assets/products.png";
import categoriesImage from "../assets/categories.png";
import manufacturerImage from "../assets/manufacturers.png";
import { debounce } from "lodash";

const { Option } = Select;

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [manufacturerCount, setManufacturerCount] = useState(0);

  const today = new Date();

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(today);

  const fetchCounts = async () => {
    try {
      const productResponse = await axios.get(
        "http://localhost:3000/api/products"
      );
      setProductCount(productResponse.data.length);

      const categoryResponse = await axios.get(
        "http://localhost:3000/api/categories"
      );
      setCategoryCount(categoryResponse.data.length);

      const manufacturerResponse = await axios.get(
        "http://localhost:3000/api/manufacturer"
      );
      setManufacturerCount(manufacturerResponse.data.length);
    } catch (error) {
      message.error("Failed to fetch counts 😔");
    }
  };

  const fetchProducts = async (search = "") => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/products", {
        params: { search },
      });
      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        setProducts([]);
        message.error("Invalid data format received from server 🤔");
      }
    } catch (error) {
      message.error("Failed to fetch products 😔");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
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
      message.error("Failed to delete product 😔");
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
      fetchCounts();
      fetchProducts();
      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to save product 😔");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSearch = debounce((value) => {
    if (value.length >= 3) {
      fetchProducts(value);
    } else {
      fetchProducts();
    }
  }, 300);

  const columns = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (text, record) => (
        <img
          src={record.imageUrl}
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
      title: "Weight (Kg)",
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
      <div >
        <Sidebar />
      </div>
      
      <div className="fullcontent">
      <div className="cont">
      <Topbar/>
      </div>
        <Flex vertical flex={1} className="content">
          <div>
            <h2>
              Products Dashboard 📦 -{" "}
              <a style={{ fontWeight: "lighter", fontSize: "22px" }}>
                {formattedDate}
              </a>
            </h2>
            <div className="stats-container">
              <Card className="stats-item0">
                <div className="stats-item-content">
                  <div className="text-content">
                    <p className="stats-item-header">Total InProducts</p>
                    <p className="stats-item-body">{productCount}</p>
                  </div>
                  <div className="image-content">
                    <img
                      src={productImage}
                      className="dash-img"
                      alt="Total Products"
                    />
                  </div>
                </div>
              </Card>

              <Card className="stats-item1">
                <div className="stats-item-content">
                  <div className="text-content">
                    <p className="stats-item-header">Total Categories</p>
                    <p className="stats-item-body">{categoryCount}</p>
                  </div>
                  <div className="image-content">
                    <img
                      src={categoriesImage}
                      className="dash-img"
                      alt="Total Categories"
                    />
                  </div>
                </div>
              </Card>
              <Card className="stats-item2">
                <div className="stats-item-content">
                  <div className="text-content">
                    <p className="stats-item-header">Total Manufacturers</p>
                    <p className="stats-item-body">{manufacturerCount}</p>
                  </div>
                  <div className="image-content">
                    <img
                      src={manufacturerImage}
                      className="dash-img"
                      alt="Total Manufacturers"
                    />
                  </div>
                </div>
              </Card>
            </div>
            <div className="details">
              <span style={{ margin: "0 8px", marginTop: "60px" }} />
              <Input
                placeholder="Search products..."
                onChange={(e) => handleSearch(e.target.value)}
                style={{ marginBottom: "20px", width: "300px" }}
              />
              <span style={{ margin: "0 8px" }} />
              <Button type="primary" className="spaced" onClick={handleCreate}>
                Add New Product
              </Button>
              <Table
                columns={columns}
                dataSource={products}
                loading={loading}
                rowKey="_id"
                className="spaced"
              />
            </div>
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
        </Flex>
      </div>
    </div>
  );
};

const ProductForm = ({ initialValues, onCancel, onOk }) => {
  const [form] = Form.useForm();
  const [manufacturers, setManufacturers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

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
        message.error("Failed to fetch manufacturers 😔");
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

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/categories");
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        setCategories([]);
        message.error("Invalid data received from server");
      }
    } catch (error) {
      message.error("Failed to fetch categories 😔");
    }
  };

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
        <Select>
          {categories.map((category) => (
            <Option key={category._id} value={category.name}>
              {category.name}
            </Option>
          ))}
        </Select>
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
        name="imageUrl"
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
