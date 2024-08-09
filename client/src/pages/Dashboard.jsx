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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLayerGroup,
  faIndustry,
  faBoxArchive,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import { debounce } from "lodash";
import { getProductDetailsFromOpenAI } from "../hooks/productAddWithOpenAI";

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
      <div>
        <Sidebar />
      </div>

      <div className="fullcontent">
        <div className="cont">
          <Topbar />
        </div>
        <Flex vertical flex={1} className="content">
          <div>
            <div className="intro">
              <h2>Dashboard </h2>

              <span style={{ fontSize: "15px", color: "#878787" }}>
                {formattedDate}
              </span>
            </div>
            <div className="stats-container">
              <Card className="stats-item0">
                <div className="stats-item-content">
                  <div>
                    <FontAwesomeIcon
                      icon={faBoxArchive}
                      size="2xl"
                      style={{ color: "#023bbd" }}
                      className="iconContent"
                    />
                  </div>
                  <div className="text-content">
                    <p className="stats-item-header">Total InProducts</p>
                    <p className="stats-item-body">{productCount}</p>
                  </div>
                </div>
              </Card>

              <Card className="stats-item1">
                <div className="stats-item-content">
                  <div>
                    <FontAwesomeIcon
                      icon={faLayerGroup}
                      size="2xl"
                      className="iconContent2"
                      style={{ color: "#ffffff" }}
                    />
                  </div>
                  <div className="text-content">
                    <p className="stats-item-header">Total Categories</p>
                    <p className="stats-item-body">{categoryCount}</p>
                  </div>
                </div>
              </Card>
              <Card className="stats-item2">
                <div className="stats-item-content">
                  <div>
                    <FontAwesomeIcon
                      icon={faIndustry}
                      className="iconContent"
                      size="2xl"
                      style={{ color: "#023bbd" }}
                    />
                  </div>
                  <div className="text-content">
                    <p className="stats-item-header">Total Manufacturers</p>
                    <p className="stats-item-body">{manufacturerCount}</p>
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
                className="table"
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
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [manufacturerSuggestions, setManufacturerSuggestions] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchManufacturers();
  }, []);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/categories");
      setCategories(response.data);
    } catch (error) {
      message.error("Failed to fetch categories 😔");
    }
  };

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

  const onManufacturerChange = (value) => {
    const selectedManu = manufacturers.find(
      (manufacturer) => manufacturer.name === value
    );
    setSelectedManufacturer(selectedManu);
    setBrands(selectedManu ? selectedManu.brands : []);
    form.setFieldsValue({ brand: null });
    form.setFieldsValue({ manufacturerName: value });
  };

  const handleSuggestionClick = (suggestion) => {
    console.log("Suggestion clicked:", suggestion); // Debugging line
    const selectedManu = manufacturers.find(
      (manufacturer) => manufacturer.name === suggestion
    );
    setSelectedManufacturer(selectedManu);
    setBrands(selectedManu ? selectedManu.brands : []);
    form.setFieldsValue({ brand: null });

    // Directly set the value of the manufacturerName field
    form.setFields([
      {
        name: "manufacturerName",
        value: suggestion,
      },
    ]);

    console.log("Updated form values:", form.getFieldsValue()); // Debugging line
    setManufacturerSuggestions([]);
  };

  const onFinish = (values) => {
    onOk({
      ...values,
      weight: parseFloat(values.weight),
    });
  };

  const handleAIButtonClick = async () => {
    const productName = form.getFieldValue("productName");
    if (!productName) {
      message.warning("Please enter the product name first.");
      return;
    }

    try {
      const { productCategory, productSubcategory, manufacturers } =
        await getProductDetailsFromOpenAI(productName);

      form.setFieldsValue({
        productCategory,
        productSubcategory,
      });
      setManufacturerSuggestions(manufacturers);
      message.success("Product details populated using AI 🎉");
    } catch (error) {
      message.error("Failed to fetch product details using AI 😔");
    }
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
        rules={[
          { required: true, message: "Please enter the manufacturer name" },
        ]}
      >
        <Select
          value={form.getFieldValue("manufacturerName")}
          onChange={onManufacturerChange}
        >
          {manufacturers.map((manufacturer) => (
            <Option key={manufacturer._id} value={manufacturer.name}>
              {manufacturer.name}
            </Option>
          ))}
        </Select>
        <div style={{ paddingTop: 8, marginBottom: "25px" }}>
          {manufacturerSuggestions.length > 0 && (
            <div style={{ display: "flex" }} className="productForm">
              {manufacturerSuggestions.slice(0, 4).map((suggestion, index) => (
                <Button
                  key={index}
                  type="link"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          )}
        </div>
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
        name="productSubcategory"
        label="Product Subcategory"
        rules={[
          { required: true, message: "Please enter the product subcategory" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="variantType"
        label="Variant Type"
        rules={[{ required: true, message: "Please enter the variant type" }]}
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
        label="Weight (Kg)"
        rules={[{ required: true, message: "Please enter the weight" }]}
      >
        <Input type="number" step="0.01" />
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
          {initialValues ? "Update Product" : "Create Product"}
        </Button>
        <span style={{ margin: "0 8px" }} />
        <Button type="default" danger onClick={onCancel}>
          Cancel
        </Button>
        <span style={{ margin: "0 8px" }} />
        <Button type="default" onClick={handleAIButtonClick}>
          <FontAwesomeIcon
            icon={faWandMagicSparkles}
            style={{ color: "#002270" }}
          />{" "}
          AI Assist
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
