// UploadTab.js
import { useState } from "react";
import { Flex, Button, message, Upload, Table } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import Sidebar from "./sidebar/Sidebar";

const UploadTab = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = (info) => {
    const { status, originFileObj } = info.file;
    if (status === "done" || status === "uploading") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const bstr = e.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        setData(data);
      };
      reader.readAsBinaryString(originFileObj);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const processImages = async (df) => {
    for (let row of df) {
      const imageUrl = row["Image URL 1"];
      const Amount = extractAmount(row["Variant"]);
      try {
        // Simulate downloading and uploading image
        const transformedImageUrl = await uploadAndTransformImage(
          imageUrl,
          Amount
        );
        row["Image URL 1"] = transformedImageUrl;
      } catch (error) {
        console.error("Image processing error: ", error);
      }
    }
    return df;
  };

  const handleProcess = async () => {
    setLoading(true);
    let cleanedData = cleanData(data);
    cleanedData = await processImages(cleanedData);
    setData(cleanedData);
    setLoading(false);
    message.success("Data processing completed.");
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: "Product Name",
      key: "product_name",
    },
    {
      title: "Manufacturer Name",
      dataIndex: "Manufacturer Name",
      key: "manufacturer_name",
    },
    {
      title: "Variant",
      dataIndex: "Variant",
      key: "variant",
    },
    {
      title: "Variant Type",
      dataIndex: "Variant Type",
      key: "variant_type",
    },
    {
      title: "Weight (g)",
      dataIndex: "Weight",
      key: "weight",
    },
    {
      title: "Amount",
      dataIndex: "Amount",
      key: "amount",
    },
    {
      title: "Product Category",
      dataIndex: "Product Category",
      key: "product_category",
    },
    {
      title: "Image URL 1",
      dataIndex: "Image URL 1",
      key: "image_url_1",
      render: (text) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ),
    },
  ];

  return (
    <Flex className="container">
      <Flex gap="medium" align="centers">
        <div className="sidebar">
          <Sidebar />
        </div>

        <Flex vertical flex={1} className="content">
          <div style={{ width: "800px" }}>
            <h2>Upload Excel Sheet Here</h2>
            <Upload
              name="file"
              accept=".xlsx, .xls"
              beforeUpload={() => false} // Prevent automatic upload
              onChange={handleUpload}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
            <Button onClick={handleProcess} disabled={loading || !data.length}>
              Process Data
            </Button>
            {data.length > 0 && (
              <Table columns={columns} dataSource={data} rowKey="id" />
            )}
          </div>
        </Flex>
      </Flex>
    </Flex>
  );
};

const cleanData = (data) => {
  // Implement your data cleaning logic here
  return data;
};

const uploadAndTransformImage = async (imageUrl, amount) => {
  // Implement your image upload and transformation logic using Cloudinary
  return transformedImageUrl;
};

const extractAmount = (variant) => {
  // Implement your logic to extract amount from variant
  return amount;
};

export default UploadTab;
