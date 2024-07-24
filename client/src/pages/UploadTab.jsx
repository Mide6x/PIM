import { useState, useEffect } from "react";
import { Flex, Button, message, Table, Modal } from "antd";
import Sidebar from "./sidebar/Sidebar";
import axios from "axios";
import { categorizeProductWithOpenAI } from "../hooks/openaiCategorizer";

const UploadTab = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/processedimages"
        );
        setData(response.data);
      } catch (error) {
        message.error("Failed to fetch data 😔");
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const extractSize = (weightStr) => {
    try {
      const pattern = /(\d+\.?\d*)(KG|G|ML|L|CL)/i;
      const match = weightStr.match(pattern);
      if (match) {
        const value = parseFloat(match[1]);
        const unit = match[2].toUpperCase();
        if (unit === "KG") return value * 1000;
        if (unit === "G") return value;
        if (unit === "ML") return value * 1;
        if (unit === "L") return value * 1000;
        if (unit === "CL") return value * 10;
      }
      return null;
    } catch {
      return null;
    }
  };

  const convertVariantFormat = (variant) => {
    variant = String(variant);
    variant = variant.replace(/\s*[xX×]\s*/g, "x").replace("ltr", "L");

    const pattern1 = /(\d+)\s*([a-zA-Z]+)\s*x\s*(\d+)/i;
    const pattern2 = /(\d+)\s*x\s*(\d+)\s*([a-zA-Z]+)/i;
    const pattern3 = /(\d+)x(\d+)([a-zA-Z]+)/i;

    const match1 = variant.match(pattern1);
    if (match1) {
      const [, size, unit, count] = match1;
      return `${size.toUpperCase()}${unit.toUpperCase()} x ${count}`;
    }

    const match2 = variant.match(pattern2);
    if (match2) {
      const [, count, size, unit] = match2;
      return `${size.toUpperCase()}${unit.toUpperCase()} x ${count}`;
    }

    const match3 = variant.match(pattern3);
    if (match3) {
      const [, count, size, unit] = match3;
      return `${size.toUpperCase()}${unit.toUpperCase()} x ${count}`;
    }

    return variant;
  };

  const extractAmount = (weightStr) => {
    try {
      let amount_start = weightStr.indexOf("x");
      if (amount_start === -1) amount_start = weightStr.indexOf("×");
      if (amount_start === -1) amount_start = weightStr.indexOf("X");
      if (amount_start === -1) return null;
      return parseInt(weightStr.slice(amount_start + 1).trim(), 10);
    } catch {
      return null;
    }
  };

  const categorizeProduct = async (productName) => {
    const result = await categorizeProductWithOpenAI(productName);
    return result;
  };

  const cleanData = async (df) => {
    return await Promise.all(
      df.map(async (row) => {
        const variant = convertVariantFormat(row.variant);
        const weight = extractSize(variant);
        const amount = extractAmount(variant);
        const weightInKg = weight && amount ? (weight * amount) / 1000 : null;

        const { productCategory, productSubcategory } = await categorizeProduct(
          row.productName
        );

        return {
          ...row,
          productCategory,
          productSubcategory,
          variant,
          variantType: "Size",
          amount,
          weightInKg: weightInKg ? Math.round(weightInKg) : null,
        };
      })
    );
  };

  const handleProcess = async () => {
    setLoading(true);
    try {
      const cleanedData = await cleanData(data);
      setData(cleanedData);
      message.success("Data processing completed.");
    } catch (error) {
      message.error("Failed to process data 😔");
      console.error("Error processing data:", error);
    }
    setLoading(false);
  };

  const handlePushToApproval = async () => {
    try {
      await axios.post("http://localhost:3000/api/approvals", data);
      message.success("Data successfully sent for approval 🎉");
    } catch (error) {
      message.error("Failed to send data for approval 😔");
      console.error("Error sending data for approval:", error);
    }
  };

  const handleModalOk = async () => {
    setIsModalVisible(false);
    await handlePushToApproval();
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleConfirm = () => {
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "product_name",
    },
    {
      title: "Manufacturer Name",
      dataIndex: "manufacturerName",
      key: "manufacturer_name",
    },
    {
      title: "Product Category",
      dataIndex: "productCategory",
      key: "product_category",
    },
    {
      title: "Product Subcategory",
      dataIndex: "productSubcategory",
      key: "product_subcategory",
    },
    {
      title: "Variant",
      dataIndex: "variant",
      key: "variant",
    },
    {
      title: "Variant Type",
      dataIndex: "variantType",
      key: "variant_type",
    },
    {
      title: "Quantity",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Weight (Kg)",
      dataIndex: "weightInKg",
      key: "weight_in_kg",
    },
    {
      title: "Image URL",
      dataIndex: "imageUrl",
      key: "image_url",
    },
  ];

  return (
    <div className="container">
      <div className="sidebar">
        <Sidebar />
      </div>
      <Flex vertical flex={1} className="content">
        <div>
          <h2>Data Cleaning 🧼</h2>
          <p className="spaced">
            From here, you will perform AI-assisted data cleaning.
          </p>
          <Button
            type="primary"
            className="spaced"
            onClick={handleProcess}
            disabled={loading || !data.length}
          >
            Process Data
          </Button>
          <>
            <Table
              columns={columns}
              dataSource={data}
              rowKey="productName"
              className="spaced"
            />
            <Button type="primary" className="spaced" onClick={handleConfirm}>
              Confirm & Send to Approval Page
            </Button>
          </>
          <Modal
            title="Confirm Data"
            open={isModalVisible}
            onOk={handleModalOk}
            onCancel={handleModalCancel}
          >
            <p>
              Are you sure you want to send these products to the Approval Page?
            </p>
          </Modal>
        </div>
      </Flex>
    </div>
  );
};

export default UploadTab;
