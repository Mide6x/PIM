import { useState, useEffect } from "react";
import { Button, Flex, Table, Modal, Form, Input, message, Space } from "antd";
import Sidebar from "./sidebar/Sidebar";
import axios from "axios";
import PropTypes from "prop-types";
import { debounce } from "lodash";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

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
      message.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/categories/${id}`);
      message.success("Category deleted successfully 🎉");
      fetchCategories();
    } catch (error) {
      message.error("Failed to delete category 😔");
    }
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setIsModalVisible(true);
  };

  const handleOk = async (values) => {
    try {
      if (editingCategory) {
        await axios.put(
          `http://localhost:3000/api/categories/${editingCategory._id}`,
          values
        );
        message.success("Category updated successfully 🎉");
      } else {
        await axios.post("http://localhost:3000/api/categories", values);
        message.success("Category created successfully 🎉");
      }
      fetchCategories();
      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to save category");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSearch = debounce((value) => {
    if (value.length >= 3) {
      fetchCategories(value);
    } else {
      fetchCategories();
    }
  }, 300);

  const columns = [
    {
      title: "Category Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Subcategories",
      dataIndex: "subcategories",
      key: "subcategories",
      render: (subcategories) =>
        subcategories.map((sub) => <div key={sub}>{sub}</div>),
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
              <h2>Categories 🛍️</h2>
              <p className="spaced">
                From here, you can manually create and edit categories.
              </p>
              <Input
                placeholder="Search categories..."
                onChange={(e) => handleSearch(e.target.value)}
                style={{ marginBottom: "20px", width: "300px" }}
              />{" "}
              <span style={{ margin: "0 8px" }} />
              <Button className="spaced" type="primary" onClick={handleCreate}>
                Add New Category
              </Button>
              <Table
                columns={columns}
                dataSource={categories}
                loading={loading}
                rowKey="_id"
              />
            </div>
       
          {categories.length === 0 && !loading && <p>No categories found.</p>}
        </Flex>
   
      <Modal
        title={editingCategory ? "Edit Category" : "Create Category"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <CategoryForm
          initialValues={editingCategory}
          onCancel={handleCancel}
          onOk={handleOk}
        />
      </Modal>
    </div>
  );
};

const CategoryForm = ({ initialValues, onCancel, onOk }) => {
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
        label="Category Name"
        rules={[
          { required: true, message: "Please enter the category name 😤" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="subcategories"
        label="Subcategories"
        rules={[
          { required: true, message: "Please enter the subcategories 🫣" },
        ]}
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

CategoryForm.propTypes = {
  initialValues: PropTypes.object,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
};

export default Categories;
