import { useState, useEffect } from "react";
import {
  Button,
  Flex,
  Table,
  Modal,
  Form,
  Input,
  message,
  Space,
  Tabs,
} from "antd";
import axios from "axios";
import PropTypes from "prop-types";
import { debounce } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowUp } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const { TabPane } = Tabs;

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [archivedCategories, setArchivedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [activeTab, setActiveTab] = useState("live");

  const fetchCategories = async (search = "") => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/categories", {
        params: { search },
      });
      if (Array.isArray(response.data)) {
        setCategories(response.data.filter((c) => !c.isArchived));
        setArchivedCategories(response.data.filter((c) => c.isArchived));
      } else {
        setCategories([]);
        setArchivedCategories([]);
        message.error("Invalid data format received from server 🤔");
      }
    } catch (error) {
      message.error("Failed to fetch categories 😔");
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

  const handleUnarchive = async (category) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/categories/${category._id}/unarchive`
      );
      message.success("Category unarchived successfully 🎉");
      fetchCategories();
    } catch (error) {
      message.error("Failed to unarchive category 😔");
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
      message.error("Failed to save category 😔");
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
      render: (text, record) => (
        <Link className="nameListing" to={`/categories/${record._id}`}>
          {text}
        </Link>
      ),
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
          <Button className="editBtn" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Link to={`/categories/${record._id}`}>
            <Button className="archiveBtn">View Details</Button>
          </Link>
        </Space>
      ),
    },
  ];

  const archivedColumns = [
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
          <h2>Categories</h2>
        </div>
        <div className="details">
          <span style={{ margin: "0 8px", marginTop: "60px" }} />
          <div className="searchBarContainer">
            <Input
              className="searchBar"
              placeholder="Search Categories by name"
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: "100%" }}
            />
            <Button
              type="primary"
              className="archiveBtn"
              onClick={handleCreate}
            >
              <FontAwesomeIcon
                icon={faFileArrowUp}
                size="lg"
                style={{ color: "#008162" }}
              />
              Bulk Upload Categories
            </Button>
            <Button className="addBtn" type="primary" onClick={handleCreate}>
              Add New Category
            </Button>
          </div>
          <Tabs
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key)}
            className="table"
          >
            <TabPane tab="Live Categories" key="live">
              <Table
                columns={columns}
                dataSource={categories}
                loading={loading}
                rowKey="_id"
                className="table"
                pagination={{ position: ["bottomCenter"] }}
              />
            </TabPane>
            <TabPane tab="Archived Categories" key="archived">
              <Table
                columns={archivedColumns}
                dataSource={archivedCategories}
                loading={loading}
                rowKey="_id"
                pagination={{ position: ["bottomCenter"] }}
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
      {categories.length === 0 && !loading && <p>No categories found.</p>}

      <Modal
        title={editingCategory ? "Edit Category" : "Create Category"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <CategoryForm
          initialValues={editingCategory}
          onCancel={handleCancel}
          onOk={handleOk}
        />
      </Modal>
    </Flex>
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
      <p className="formTitle">Category Name</p>
      <Form.Item
        name="name"
        rules={[{ required: true, message: "Please enter the category name" }]}
      >
        <Input className="userInput" placeholder=" Category Name" />
      </Form.Item>
      <p className="formTitle">Subcategories</p>
      <Form.Item
        name="subcategories"
        rules={[{ required: true, message: "Please enter the subcategories" }]}
      >
        <Input className="userInput" placeholder="Subcategories" />
      </Form.Item>
      <Form.Item>
        <Button className="deleteBtn" type="default" onClick={onCancel}>
          Cancel
        </Button>
        <span style={{ margin: "0 8px" }} />
        <Button className="addBtn" type="primary" htmlType="submit">
          Submit
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
