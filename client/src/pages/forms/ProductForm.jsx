import { useEffect, useState, useCallback } from "react";
import {
  faCircleExclamation,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Form, Input, Select, message } from "antd";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { getProductDetailsFromOpenAI } from "../../hooks/productAddWithOpenAI";
import useAutoPopulateDescription from "../../hooks/useAutoPopulateDescription";
import useAuth from "../../contexts/useAuth";

const { Option } = Select;

const ProductForm = ({ initialValues, onCancel, onOk }) => {
  const { userData } = useAuth();
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [manufacturerSuggestions, setManufacturerSuggestions] = useState([]);
  const productName = Form.useWatch("productName", form);
  const manufacturerName = Form.useWatch("manufacturerName", form);

  const { description, loading, error } = useAutoPopulateDescription(
    productName,
    manufacturerName
  );

  useEffect(() => {
    if (userData && userData._id) {
      fetchCategories();
      fetchManufacturers();
    }
  }, [userData]);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  useEffect(() => {
    if (description) {
      form.setFieldsValue({ description });
    }
  }, [description, form]);

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
      createdBy: userData.email ? userData.email.toString() : userData._id,
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
    <>
      {userData && (
        <Form form={form} onFinish={onFinish} initialValues={initialValues}>
          <p className="formTitle">Product Name</p>
          <Form.Item
            name="productName"
            rules={[
              { required: true, message: "Please enter the product name" },
            ]}
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
                {manufacturerSuggestions
                  .slice(0, 4)
                  .map((suggestion, index) => (
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
              {
                required: true,
                message: "Please input the product's category",
              },
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
                {
                  required: true,
                  message: "Please enter the product category",
                },
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
              {
                required: true,
                message: "Please enter the product subcategory",
              },
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
            rules={[
              { required: true, message: "Please enter the variant type" },
            ]}
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
          <p className="formTitle">Product Description</p>
          <Form.Item
            name="description"
            rules={[{ required: false, message: "Enter the product details." }]}
          >
            <Input.TextArea
              className="userInputDesc"
              placeholder="Product Description"
              autoSize={{ minRows: 3, maxRows: 6 }}
            />
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
              loading={loading}
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
          {error && <p style={{ color: "red" }}>Error: {error}</p>}
        </Form>
      )}
    </>
  );
};

ProductForm.propTypes = {
  initialValues: PropTypes.object,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
};

export default ProductForm;
