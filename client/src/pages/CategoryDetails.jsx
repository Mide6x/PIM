import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, Table, message, Input, Button, Form, Flex, Modal } from "antd";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { ArrowLeftOutlined } from "@ant-design/icons";

const CategoryDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [editingItem, setEditingItem] = useState(null); // can be a category or subcategory
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [isArchived, setIsArchived] = useState(false);
  const [isCategoryEdit, setIsCategoryEdit] = useState(false); // Flag to track if it's category edit

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/categories/${id}`);
        setCategory(response.data);
        setIsArchived(response.data.isArchived);
      } catch (error) {
        message.error("Failed to fetch category details 😔");
      }
    };

    fetchCategoryDetails();
  }, [id]);

  const handleEdit = (item, isCategory = false) => {
    setEditingItem(item);
    setIsCategoryEdit(isCategory);
    setIsModalVisible(true);
    form.setFieldsValue(isCategory ? { categoryName: item.name } : { subcategoryName: item });
  };

  const handleSave = async () => {
    try {
      const values = form.getFieldsValue();
      if (isCategoryEdit) {
        // Update Category Name
        await axios.put(`http://localhost:3000/api/categories/${id}`, {
          ...category,
          name: values.categoryName,
        });
        setCategory((prev) => ({ ...prev, name: values.categoryName }));
        message.success("Category updated successfully! 🎉");
      } else {
        // Update Subcategory Name
        const updatedSubcategories = category.subcategories.map((sub) =>
          sub === editingItem ? values.subcategoryName : sub
        );
        await axios.put(`http://localhost:3000/api/categories/${id}`, {
          ...category,
          subcategories: updatedSubcategories,
        });
        setCategory((prev) => ({ ...prev, subcategories: updatedSubcategories }));
        message.success("Subcategory updated successfully! 🎉");
      }
      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to update item 😔");
    }
  };

  const handleArchive = async () => {
    try {
      await axios.patch(`http://localhost:3000/api/categories/${id}/archive`);
      setIsArchived(true);
      message.success("Category archived successfully 🎉");
    } catch (error) {
      message.error("Failed to archive category 😔");
    }
  };

  const handleUnarchive = async () => {
    try {
      await axios.patch(`http://localhost:3000/api/categories/${id}/unarchive`);
      setIsArchived(false);
      message.success("Category unarchived successfully 🎉");
    } catch (error) {
      message.error("Failed to unarchive category 😔");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/categories/${id}`);
      message.success("Category deleted successfully 🎉");
    } catch (error) {
      message.error("Failed to delete category 😔");
    }
  };

  const columns = [
    {
      title: "Subcategory",
      dataIndex: "subcategory",
      key: "subcategory",
      className: "nameListing",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button className="editBtn" onClick={() => handleEdit(record.subcategory)}>
          <FontAwesomeIcon icon={faPenToSquare} /> Edit
        </Button>
      ),
    },
  ];

  return (
    <Flex vertical flex={1} className="content">
      <div className="intro">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          className="backButton"
        >
          {" "}
          Categories
        </Button>
        <h2>Category Details</h2>
      </div>
      <div className="details" style={{ marginTop: "20px" }}>
        <div className="infoContainer">
          <div className="infoTitle">
            <div className="titleContent">
              {category?.name}
              <span className="status">{isArchived ? "Archived" : "Active"}</span>
            </div>

            <div className="buttonContainer">
              <Button className="editBtn" onClick={() => handleEdit(category, true)}>
                <FontAwesomeIcon icon={faPenToSquare} /> Edit Details
              </Button>
              {isArchived ? (
                <Button
                  className="unarchiveBtn"
                  onClick={handleUnarchive}
                  style={{ marginLeft: "10px" }}
                >
                  Unarchive
                </Button>
              ) : (
                <Button
                  className="archiveBtn"
                  onClick={handleArchive}
                  style={{ marginLeft: "10px" }}
                >
                  Archive
                </Button>
              )}
              <Button
                className="deleteBtn"
                onClick={handleDelete}
                style={{ marginLeft: "10px" }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultActiveKey="1" className="table">
        <Tabs.TabPane tab="Subcategories" key="1">
          <Table
            dataSource={category?.subcategories.map((subcategory) => ({ subcategory }))}
            columns={columns}
            rowKey="subcategory"
            pagination={{ position: ["bottomCenter"] }}
          />
        </Tabs.TabPane>
      </Tabs>

      <Modal
        title={isCategoryEdit ? "Edit Category" : "Edit Subcategory"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSave}>
          <p className="formTitle">{isCategoryEdit ? "Category Details" : "Subcategory Details"}</p>
          {isCategoryEdit ? (
            <Form.Item
              name="categoryName"
              rules={[
                { required: true, message: "Please enter the category name" },
              ]}
            >
              <Input className="userInput" placeholder="Category Name" />
            </Form.Item>
          ) : (
            <Form.Item
              name="subcategoryName"
              initialValue={editingItem}
              rules={[
                { required: true, message: "Please enter the subcategory name" },
              ]}
            >
              <Input className="userInput" placeholder="Subcategory Name" />
            </Form.Item>
          )}
          <Form.Item className="concludeBtns">
            <Button
              className="editBtn"
              onClick={() => setIsModalVisible(false)}
            >
              Cancel
            </Button>
            <Button
              className="addBtn"
              type="primary"
              htmlType="submit"
              style={{ marginLeft: "10px" }}
            >
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Flex>
  );
};

export default CategoryDetails;
