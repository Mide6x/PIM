import { useState, useEffect, useCallback } from "react";
import { Button, Table, Modal, Flex, message, Space } from "antd";
import axios from "axios";
import VariantForm from "./forms/VariantsForm";
import useAuth from "../contexts/useAuth";


const useVariants = (userId, setLoading) => {
  const [variants, setVariants] = useState([]);

  const fetchVariants = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await axios.get("/api/v1/variants");
      const data = response?.data?.data;

      if (Array.isArray(data)) {
        setVariants(data);
      } else {
        throw new Error("Unexpected data format");
      }
    } catch (error) {
      message.error("Failed to fetch variants 😔");
      console.error("Error fetching variants:", error);
    } finally {
      setLoading(false);
    }
  }, [userId, setLoading]);

  useEffect(() => {
    fetchVariants();
  }, [fetchVariants]);

  return { variants, fetchVariants };
};


const handleApiRequest = async (requestType, url, payload = null) => {
  try {
    const response = requestType === "delete"
      ? await axios.delete(url)
      : await axios[requestType](url, payload);
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data : error.message);
  }
};

const ManageVariants = () => {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);
  const { variants, fetchVariants } = useVariants(userData?._id, setLoading);

  const createdBy = userData?.email || userData?._id || null;
  if (!createdBy) {
    throw new Error("User data is missing, and 'createdBy' cannot be set.");
  }

  const handleModalOpen = (variant = null) => {
    setEditingVariant(variant);
    setIsModalVisible(true);
  };

  const handleSaveVariant = async (values) => {
    const url = editingVariant
      ? `/api/v1/variants/${editingVariant._id}`
      : "/api/v1/variants";
    const requestType = editingVariant ? "put" : "post";
    const payload = { ...values, createdBy };

    try {
      await handleApiRequest(requestType, url, payload);
      message.success(editingVariant ? "Variant updated 🎉" : "Variant created 🎉");
      fetchVariants();
      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to save variant 😔");
      console.error("Error saving variant:", error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await handleApiRequest("delete", `/api/v1/variants/${id}`);
      message.success("Variant deleted successfully 🎉");
      fetchVariants();
    } catch (error) {
      message.error("Failed to delete variant 😔");
    }
  };

  const columns = [
    {
      title: "Variant Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Sub-Variants",
      dataIndex: "subvariants",
      key: "subVariants",
      render: (subVariants) =>
        Array.isArray(subVariants)
          ? subVariants.map((variant) => variant.name).join(", ")
          : "No sub-variants",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button className="editBtn" onClick={() => handleModalOpen(record)}>Edit</Button>
          <Button className="deleteBtn" onClick={() => handleDelete(record._id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <Flex vertical flex={1} className="content">
      <div className="intro">
        <h2>Manage Variants</h2>
        <p className="aboutPage">Create custom variants to provide more product information</p>
        <div className="searchBarContainer">
        <Button type="primary" className="addBtn" onClick={() => handleModalOpen()}>Add Variant</Button>
      </div>
      </div>
      <div className="details">
      <Table
        columns={columns}
        dataSource={variants}
        loading={loading}
        rowKey="_id"
         className="table"
        pagination={{ position: ["bottomCenter"] }}
      />
      <Modal
        title={editingVariant ? "Edit Variant" : "Create Variant"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <VariantForm
          initialValues={editingVariant}
          onCancel={() => setIsModalVisible(false)}
          onOk={handleSaveVariant}
        />
      </Modal></div>
    </Flex>
  );
};

export default ManageVariants;