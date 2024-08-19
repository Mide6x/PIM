import { useEffect, useState, useCallback } from "react";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLayerGroup,
  faIndustry,
  faBoxArchive,
  faWandMagicSparkles,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
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
      className: "nameListing",
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
      className: "nameListing",
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
      className: "nameListing",
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
          <Button className="editBtn" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Link to={`/products/${record._id}`}>
            <Button className="archiveBtn">View Details</Button>
          </Link>
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
                  style={{ color: "#ffffff" }}
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
                  className="iconContent"
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
                  style={{ color: "#ffffff" }}
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
            placeholder="Search Products by name"
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
            Add New Product
          </Button>
          <Table
            columns={columns}
            dataSource={products}
            loading={loading}
            rowKey="_id"
            className="table"
            pagination={{ position: ["bottomCenter"] }}
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
  );
};

const ProductForm = ({ initialValues, onCancel, onOk }) => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
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
    const selectedManu = manufacturers.find(
      (manufacturer) => manufacturer.name === suggestion
    );
    setSelectedManufacturer(selectedManu);
    setBrands(selectedManu ? selectedManu.brands : []);
    form.setFieldsValue({ brand: null });

    form.setFields([
      {
        name: "manufacturerName",
        value: suggestion,
      },
    ]);

    setManufacturerSuggestions([]);
  };

  const onFinish = (values) => {
    onOk({
      ...values,
      weight: parseFloat(values.weight),
    });
  };

  const handleCategoryChange = (value) => {
    fetchSubcategories(value);
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
      <p className="formTitle">Product Name</p>
      <Form.Item
        name="productName"
        rules={[{ required: true, message: "Please enter the product name" }]}
      >
        <Input className="userInput" placeholder="Product Name" />
      </Form.Item>
      <p className="formTitle">Manufacturer Name</p>
      <Form.Item
        name="manufacturerName"
        className="userSelection"
        rules={[
          { required: true, message: "Please enter the manufacturer name" },
        ]}
      >
        <Select
          className="userSelection"
          showSearch
          placeholder="Select or type a manufacturer"
          value={form.getFieldValue("manufacturerName")}
          onChange={onManufacturerChange}
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
        >
          {manufacturers
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((manufacturer) => (
              <Option key={manufacturer._id} value={manufacturer.name}>
                {manufacturer.name}
              </Option>
            ))}
        </Select>

        {manufacturerSuggestions.length > 0 && (
          <div style={{ display: "flex" }} className="productForm">
            {manufacturerSuggestions.slice(0, 4).map((suggestion, index) => (
              <Button
                key={index}
                type="link"
                onClick={() => handleSuggestionClick(suggestion)}
                className="AIBtn"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        )}
      </Form.Item>

      <div className="aiUseNotification">
        <p>
          <FontAwesomeIcon
            icon={faCircleExclamation}
            style={{ color: "#212b36" }}
          />{" "}
          Suggestions made by artificial intelligence may sometimes be
          inaccurate. Please check again for data accuracy.
        </p>
      </div>
      <p className="formTitle">Brand</p>
      <Form.Item
        name="brand"
        rules={[{ required: true, message: "Please enter the brand" }]}
      >
        <Select
          className="userSelection"
          disabled={!selectedManufacturer}
          placeholder="Brand"
        >
          {brands.map((brand, index) => (
            <Option key={index} value={brand}>
              {brand}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <p className="formTitle">Product Category</p>
      <Form.Item
        name="productCategory"
        rules={[
          { required: true, message: "Please input the product's category" },
        ]}
      >
        <Select
          className="userSelection"
          showSearch
          placeholder="Category (Start typing to search)"
          onChange={handleCategoryChange}
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
          rules={[
            { required: true, message: "Please enter the product category" },
          ]}
        >
          {categories
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((category) => (
              <Option key={category._id} value={category.name}>
                {category.name}
              </Option>
            ))}
        </Select>
      </Form.Item>
      <p className="formTitle">Product Subcategory</p>
      <Form.Item
        name="productSubcategory"
        rules={[
          { required: true, message: "Please enter the product subcategory" },
        ]}
      >
        <Select className="userSelection" placeholder="Product Subcategory">
          {subcategories.map((subcategory) => (
            <Option key={subcategory} value={subcategory}>
              {subcategory}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <p className="formTitle">Variant Type</p>
      <Form.Item
        name="variantType"
        rules={[{ required: true, message: "Please enter the variant type" }]}
      >
        <Input className="userInput" placeholder="Variant Type" />
      </Form.Item>
      <p className="formTitle">Variant</p>
      <Form.Item
        name="variant"
        rules={[{ required: true, message: "Please enter the variant" }]}
      >
        <Input className="userInput" placeholder="Variant" />
      </Form.Item>
      <p className="formTitle">Weight (in KG)</p>
      <Form.Item
        name="weight"
        rules={[{ required: true, message: "Please enter the weight" }]}
      >
        <Input
          placeholder="Weight (Kg)"
          className="userInput"
          type="number"
          step="0.01"
        />
      </Form.Item>
      <p className="formTitle">Image Url (Cloudinary)</p>
      <Form.Item
        name="imageUrl"
        rules={[{ required: true, message: "Please enter the image URL" }]}
      >
        <Input className="userInput" placeholder="Image Url" />
      </Form.Item>
      <p className="formTitle"> Product Description</p>
      <Form.Item
        name="description"
        rules={[{ required: false, message: "enter the product details." }]}
      >
        <Input className="userInput" placeholder="Product Description" />
      </Form.Item>

      <Form.Item className="concludeBtns">
        <Button type="default" className="editBtn" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          className="addBtn"
          style={{ marginLeft: "10px" }}
        >
          {initialValues ? "Update Product" : "Create Product"}
        </Button>

        <Button
          type="default"
          onClick={handleAIButtonClick}
          style={{ marginLeft: "10px" }}
          className="AIBtn"
        >
          <FontAwesomeIcon
            icon={faWandMagicSparkles}
            style={{ color: "#b76e00" }}
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
