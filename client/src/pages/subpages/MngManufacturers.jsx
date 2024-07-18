import { useEffect, useState } from "react";
import { Button, Table, Modal, Form, Input, message, Space } from "antd";
import axios from "axios";
import Sidebar from "../sidebar/Sidebar";
import PropTypes from "prop-types";

const MngManufacturers = () => {
  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingManufacturer, setEditingManufacturer] = useState(null);

  const fetchManufacturers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/manufacturer"
      );
      if (Array.isArray(response.data)) {
        setManufacturers(response.data);
      } else {
        setManufacturers([]);
        message.error("Invalid data format received from server");
      }
    } catch (error) {
      message.error("Failed to fetch manufacturers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManufacturers();
  }, []);

  const handleEdit = (manufacturer) => {
    setEditingManufacturer(manufacturer);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/manufacturers/${id}`);
      message.success("Manufacturer deleted successfully 🎉");
      fetchManufacturers();
    } catch (error) {
      message.error("Failed to delete manufacturer");
    }
  };

  const handleCreate = () => {
    setEditingManufacturer(null);
    setIsModalVisible(true);
  };

  const handleOk = async (values) => {
    try {
      if (editingManufacturer) {
        await axios.put(
          `http://localhost:3000/api/manufacturer/${editingManufacturer._id}`,
          values
        );
        message.success("Manufacturer updated successfully 🎉");
      } else {
        await axios.post("http://localhost:3000/api/manufacturer", values);
        message.success("Manufacturer created successfully 🎉");
      }
      fetchManufacturers();
      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to save manufacturer");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
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
        <h2>Manufacturer 🏭</h2>
        <p className="spaced">
          From here, you can manually create and edit Manufacturers.
        </p>
        <Button type="primary" className="spaced" onClick={handleCreate}>
          Add New Manufacturer
        </Button>
        <Table
          columns={columns}
          dataSource={manufacturers}
          loading={loading}
          rowKey="_id"
        />
        <Modal
          title={
            editingManufacturer ? "Edit Manufacturer" : "Create Manufacturer"
          }
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <ManufacturerForm
            initialValues={editingManufacturer}
            onCancel={handleCancel}
            onOk={handleOk}
          />
        </Modal>
      </div>
    </div>
  );
};

const ManufacturerForm = ({ initialValues, onCancel, onOk }) => {
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
        label="Manufacturer Name"
        rules={[
          { required: true, message: "Please enter the manufacturer name" },
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

ManufacturerForm.propTypes = {
  initialValues: PropTypes.object,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
};

export default MngManufacturers;
