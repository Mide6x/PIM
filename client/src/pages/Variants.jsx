import { useState, useEffect } from "react";
import { Button, Table, Modal, Flex, message, Space } from "antd";
import axios from "axios";
import VariantForm from "./forms/VariantsForm";
import useAuth from "../contexts/useAuth";

const ManageVariants = () => {
  const { userData } = useAuth();
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);
  const fetchVariants = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/v1/variants");
      const data = response?.data?.data; // Adjust based on actual response structure
  
      if (Array.isArray(data)) {
        setVariants(data ?? []);
      } else {
        message.error("Unexpected data format. Expected an array 😔");
        setVariants([]);
      }
    } catch (error) {
      console.error("Error fetching variants:", error);
      message.error("Failed to fetch variants 😔");
      setVariants([]);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    if (userData && userData._id) {
    fetchVariants();
  }
  }, [userData]);

  const handleCreate = () => {
    setEditingVariant(null);
    setIsModalVisible(true);
  };

  const handleEdit = (variant) => {
    setEditingVariant(variant);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/variants/${id}`);
      message.success("Variant deleted successfully 🎉");
      fetchVariants();
    } catch (error) {
      message.error("Failed to delete variant 😔");
    }
  };

  const createdBy =
  userData && userData.email
    ? String(userData.email)
    : userData && userData._id
    ? String(userData._id)
    : null;

if (!createdBy) {
  throw new Error(
    "User data is missing, and 'createdBy' cannot be set."
  );
}

const handleOk = async (values) => {
  try {
    console.log("Submitting values:", values);
    if (editingVariant) {
      await axios.put(
        `http://localhost:3000/api/v1/variants/${editingVariant._id}`,
        { ...values, createdBy: createdBy }
      );
      message.success("Variant updated successfully 🎉");
    } else {
      await axios.post("http://localhost:3000/api/v1/variants", { ...values, createdBy: createdBy });
      message.success("Variant created successfully 🎉");
    }
    fetchVariants();
    setIsModalVisible(false);
  } catch (error) {
    console.error("Error saving variant:", error.response ? error.response.data : error.message);
    message.error("Failed to save variant 😔");
  }
};


  const handleCancel = () => {
    setIsModalVisible(false);
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
      render: (subVariants) => {
        if (Array.isArray(subVariants)) {
          return subVariants.map((variant) => variant.name).join(", ");
        }
        return "No sub-variants"; 
      },
    } ,
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button className="editBtn" onClick={() => handleEdit(record)}>Edit</Button>
          <Button className="deleteBtn" onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      {userData && (
    <Flex vertical flex={1} className="content">
    <div>
      <div className="intro">
      <h2>Manage Variants</h2>
      <p className="aboutPage" style={{ marginBottom: "10px" }}>
            Create custome variants to provide your customers more information abount the products in your catalogue  
          </p>
      <div className="searchBarContainer">
      <Button className="addBtn"  type="primary" onClick={handleCreate}>
        Add Variant
      </Button>
      </div>
      </div>

      <div className="details">
          <span style={{ margin: "0 8px", marginTop: "60px" }} />
      <Table
        columns={columns}
        dataSource={variants}
        loading={loading}
        rowKey="_id"
        pagination={{ position: ["bottomCenter"] }}
         className="table"
      />
      <Modal
        title={editingVariant ? "Edit Variant" : "Create Variant"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <VariantForm
          initialValues={editingVariant}
          onCancel={handleCancel}
          onOk={handleOk}
        />
      </Modal>
      </div>
    </div>
    </Flex>
      )}
    </>
  );
};

export default ManageVariants;
