import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tabs, Table, message, Input, Button, Form, Modal } from "antd";
import axios from "axios";
import Sidebar from "./sidebar/Sidebar";
import Topbar from "./sidebar/Topbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const ManufacturerDetails = () => {
  const { id } = useParams();
  const [manufacturer, setManufacturer] = useState(null);
  const [editingBrand, setEditingBrand] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [isArchived, setIsArchived] = useState(false);

  useEffect(() => {
    const fetchManufacturerDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/manufacturer/${id}`
        );
        setManufacturer(response.data);
        setIsArchived(response.data.isArchived);
      } catch (error) {
        message.error("Failed to fetch manufacturer details 😔");
      }
    };

    fetchManufacturerDetails();
  }, [id]);

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const values = form.getFieldsValue();
      const updatedBrands = manufacturer.brands.map((brand) =>
        brand === editingBrand ? values.brandName : brand
      );
      await axios.put(`http://localhost:3000/api/manufacturer/${id}`, {
        ...manufacturer,
        brands: updatedBrands,
      });
      setManufacturer((prev) => ({ ...prev, brands: updatedBrands }));
      setIsModalVisible(false);
      message.success("Brand updated successfully! 🎉");
    } catch (error) {
      message.error("Failed to update brand 😔");
    }
  };

  const handleArchive = async () => {
    try {
      await axios.patch(`http://localhost:3000/api/manufacturer/${id}/archive`);
      setIsArchived(true);
      message.success("Manufacturer archived successfully 🎉");
    } catch (error) {
      message.error("Failed to archive manufacturer 😔");
    }
  };

  const handleUnarchive = async () => {
    try {
      await axios.patch(
        `http://localhost:3000/api/manufacturer/${id}/unarchive`
      );
      setIsArchived(false);
      message.success("Manufacturer unarchived successfully 🎉");
    } catch (error) {
      message.error("Failed to unarchive manufacturer 😔");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/manufacturer/${id}`);
      message.success("Manufacturer deleted successfully 🎉");
    } catch (error) {
      message.error("Failed to delete manufacturer 😔");
    }
  };

  const columns = [
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button className="editBtn" onClick={() => handleEdit(record.brand)}>
          <FontAwesomeIcon icon={faPenToSquare} /> Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="container">
      <Sidebar />
      <div className="fullcontent">
        <Topbar />
        <div className="content">
          <div className="intro">
            <h2>Manufacturer Details</h2>
          </div>
          <div className="details" style={{ marginTop: "20px" }}>
            <div className="infoContainer">
              <div className="infoTitle">
                <div className="titleContent">
                  {manufacturer?.name}
                  <span className="status">
                    {isArchived ? "Archived" : "Active"}
                  </span>
                </div>

                <div className="buttonContainer">
                  <Button
                    className="editBtn"
                    onClick={() => setIsModalVisible(true)}
                  >
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
            <Tabs.TabPane tab="Brands" key="1">
              <Table
                dataSource={manufacturer?.brands.map((brand) => ({ brand }))}
                columns={columns}
                rowKey="brand"
                pagination={{ position: ["bottomCenter"] }}
              />
            </Tabs.TabPane>
          </Tabs>

          <Modal
            title="Edit Brand"
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null} // Removes the default footer buttons
          >
            <Form form={form} onFinish={handleSave}>
              <p className="formTitle">Brand Details</p>
              <Form.Item
                name="brandName"
                initialValue={editingBrand}
                rules={[
                  { required: true, message: "Please enter the brand name" },
                ]}
              >
                <Input className="userInput" placeholder="Brand Name" />
              </Form.Item>
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
        </div>
      </div>
    </div>
  );
};

export default ManufacturerDetails;
