import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, List, message, Input, Button, Form, Modal } from "antd";
import axios from "axios";
import Sidebar from "./sidebar/Sidebar";
import Topbar from "./sidebar/Topbar";

const ManufacturerDetails = () => {
  const { id } = useParams();
  const [manufacturer, setManufacturer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newBrand, setNewBrand] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchManufacturerDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/manufacturer/${id}`
        );
        setManufacturer(response.data);
      } catch (error) {
        message.error("Failed to fetch manufacturer details 😔");
      } finally {
        setLoading(false);
      }
    };

    fetchManufacturerDetails();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
    form.setFieldsValue({
      name: manufacturer.name,
      brands: manufacturer.brands,
    });
  };

  const handleSave = async () => {
    try {
      const values = form.getFieldsValue();
      await axios.put(`http://localhost:3000/api/manufacturer/${id}`, values);
      setManufacturer({ ...manufacturer, ...values });
      setIsEditing(false);
      message.success("Manufacturer details updated successfully! 🎉");
    } catch (error) {
      message.error("Failed to update manufacturer details 😔");
    }
  };

  const handleAddBrand = async () => {
    if (newBrand.trim()) {
      try {
        const updatedBrands = [...manufacturer.brands, newBrand];
        await axios.put(`http://localhost:3000/api/manufacturer/${id}`, {
          ...manufacturer,
          brands: updatedBrands,
        });
        setManufacturer((prev) => ({
          ...prev,
          brands: updatedBrands,
        }));
        setNewBrand("");
        message.success("Brand added successfully! 🎉");
      } catch (error) {
        message.error("Failed to add brand 😔");
      }
    } else {
      message.warning("Please enter a brand name");
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    handleAddBrand();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  if (loading) {
    return <p>Loading manufacturer details...</p>;
  }

  return (
    <div className="container">
      <Sidebar />
      <div className="fullcontent">
        <Topbar />
        <div className="content">
          <Card
            title={manufacturer?.name}
            extra={
              <Button className="editBtn" onClick={handleEdit}>
                Edit
              </Button>
            }
          >
            <Form form={form} layout="vertical" onFinish={handleSave}>
              {isEditing ? (
                <>
                  <Form.Item
                    label="Manufacturer Name"
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the manufacturer name",
                      },
                    ]}
                  >
                    <Input  className="userInput"/>
                  </Form.Item>
                  <Form.Item label="Brands">
                    <List
                      dataSource={manufacturer?.brands || []}
                      renderItem={(brand) => <List.Item>{brand}</List.Item>}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="default"
                      onClick={() => setIsEditing(false)}
                      className="deleteBtn"
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
                </>
              ) : (
                <>
                  <h3>Brands</h3>
                  {manufacturer?.brands.length > 0 ? (
                    <List
                      dataSource={manufacturer.brands}
                      renderItem={(brand) => <List.Item>{brand}</List.Item>}
                    />
                  ) : (
                    <p>No brands available.</p>
                  )}

                  <Button
                    type="primary"
                    onClick={showModal}
                    style={{ marginTop: "10px" }}
                    className="addBtn"
                  >
                    Add Brand
                  </Button>
                  <Modal
                    title="Brand Details"
                    open={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    okButtonProps={{ disabled: !newBrand.trim() }}
                  >
                    <Input
                    className="userInput"
                      value={newBrand}
                      onChange={(e) => setNewBrand(e.target.value)}
                      placeholder="Name"
                    />
                  </Modal>
                </>
              )}
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManufacturerDetails;
