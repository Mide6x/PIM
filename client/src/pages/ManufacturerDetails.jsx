import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, Table, message, Input, Button, Form, Modal } from "antd";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileArrowUp,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { ArrowLeftOutlined } from "@ant-design/icons";

const ManufacturerDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [manufacturer, setManufacturer] = useState(null);
  const [editingBrand, setEditingBrand] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [isArchived, setIsArchived] = useState(false);
  const [isEditingManufacturer, setIsEditingManufacturer] = useState(false);
  const [brandsList, setBrandsList] = useState([]);

  useEffect(() => {
    const fetchManufacturerDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/manufacturer/${id}`
        );
        setManufacturer(response.data);
        setIsArchived(response.data.isArchived);
        setBrandsList(response.data.brands);
      } catch (error) {
        message.error("Failed to fetch manufacturer details 😔");
      }
    };

    fetchManufacturerDetails();
  }, [id]);

  const handleEdit = (brand, isManufacturer = false) => {
    if (isManufacturer) {
      setIsEditingManufacturer(true);
      form.setFieldsValue({ manufacturerName: manufacturer?.name });
    } else {
      setIsEditingManufacturer(false);
      setEditingBrand(brand);
      form.setFieldsValue({ brandName: brand });
    }
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const values = form.getFieldsValue();

      if (isEditingManufacturer) {
        await axios.put(`http://localhost:3000/api/manufacturer/${id}`, {
          ...manufacturer,
          name: values.manufacturerName,
        });
        setManufacturer((prev) => ({ ...prev, name: values.manufacturerName }));
        message.success("Manufacturer details updated successfully! 🎉");
      } else {
        const updatedBrands = manufacturer.brands.map((brand) =>
          brand === editingBrand ? values.brandName : brand
        );
        await axios.put(`http://localhost:3000/api/manufacturer/${id}`, {
          ...manufacturer,
          brands: updatedBrands,
        });
        setManufacturer((prev) => ({ ...prev, brands: updatedBrands }));
        setBrandsList(updatedBrands);
        message.success("Brand updated successfully! 🎉");
      }

      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to update details 😔");
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

  const handleSearch = (value) => {
    if (value.length >= 3) {
      const filteredBrands = manufacturer.brands.filter((brand) =>
        brand.toLowerCase().includes(value.toLowerCase())
      );
      setBrandsList(filteredBrands);
    } else {
      setBrandsList(manufacturer.brands);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/manufacturer/${id}`);
      message.success("Manufacturer deleted successfully 🎉");
      navigate("/manufacturers");
    } catch (error) {
      message.error("Failed to delete manufacturer 😔");
    }
  };

  const handleCreate = () => {
    // Placeholder for the function to create a new brand
  };

  const columns = [
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      className: "nameListing",
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
    <div
      style={{ display: "flex", flexDirection: "column", flex: 1 }}
      className="content"
    >
      <div className="intro">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          className="backButton"
        >
          Manufacturers
        </Button>
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
                onClick={() => handleEdit(manufacturer, true)}
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

      <div className="detailsTable">
        <Tabs defaultActiveKey="1" className="table">
          <Tabs.TabPane tab="Brands" key="1">
            <div className="searchBarContainer">
              <Input
                placeholder="Search Brands by name"
                onChange={(e) => handleSearch(e.target.value)}
                style={{ width: "100%" }}
                className="searchBar"
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
                Bulk Upload Brand
              </Button>
              <Button
                type="primary"
                className="addBtn"
                onClick={handleCreate}
              >
                Add New Brand
              </Button>
            </div>

            <Table
              dataSource={brandsList.map((brand) => ({ brand }))}
              columns={columns}
              rowKey="brand"
              pagination={{ position: ["bottomCenter"] }}
            />
          </Tabs.TabPane>
        </Tabs>
      </div>
      <Modal
        title={isEditingManufacturer ? "Edit Manufacturer" : "Edit Brand"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSave}>
          <p className="formTitle">
            {isEditingManufacturer ? "Manufacturer Details" : "Brand Details"}
          </p>
          <Form.Item
            name={isEditingManufacturer ? "manufacturerName" : "brandName"}
            rules={[
              {
                required: true,
                message: isEditingManufacturer
                  ? "Please enter the manufacturer name"
                  : "Please enter the brand name",
              },
            ]}
          >
            <Input
              className="userInput"
              placeholder={
                isEditingManufacturer ? "Manufacturer Name" : "Brand Name"
              }
            />
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
              htmlType="submit"
              style={{ marginLeft: "10px" }}
            >
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManufacturerDetails;
