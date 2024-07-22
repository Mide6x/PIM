import { useState } from "react";
import { Flex, Button, message, Upload, Table } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Sidebar from "../sidebar/Sidebar";
import * as XLSX from "xlsx";
import axios from "axios";
import { saveAs } from "file-saver";

const Images = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = (info) => {
    const file = info.file;
    if (!file) {
      message.error("No file selected");
      return;
    }

    if (
      !file.type.includes("spreadsheetml.sheet") &&
      !file.type.includes("excel")
    ) {
      message.error("Invalid file type. Please upload an Excel file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer = e.target.result;
      try {
        const wb = XLSX.read(arrayBuffer, { type: "array" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const parsedData = XLSX.utils.sheet_to_json(ws);

  
        const hasEmptyVariants = parsedData.some((item) => !item["Variant"]);
        if (hasEmptyVariants) {
          message.error(
            "Some rows have empty Variant values. Please check your file."
          );
          return;
        }

        console.log("Parsed data:", parsedData);
        setData(parsedData);
      } catch (error) {
        message.error(
          "Failed 😔 to read the file. Ensure it is a valid Excel file. 😔"
        );
        console.error("Error reading file:", error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const processImages = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/images/process",
        {
          images:processedData,  // This should include Amount
        }
      );
  
      const transformedImages = response.data.results;
  
      console.log("Transformed Images:", transformedImages);
  
      if (!Array.isArray(transformedImages) || !transformedImages.length) {
        throw new Error("No valid image data received from the server.");
      }
  
      const ws = XLSX.utils.json_to_sheet(transformedImages);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Transformed Images");
  
      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  
      saveAs(
        new Blob([wbout], { type: "application/octet-stream" }),
        "transformed_images.xlsx"
      );
  
      message.success("Images processed and file downloaded successfully");
    } catch (error) {
      console.error("Error processing images:", error);
      message.error(`Error processing images: ${error.message}`);
    } finally {
      setLoading(false);
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

  const processedData = data.map((item) => {
    const formattedVariant = convertVariantFormat(item["Variant"]);
    const amount = extractAmount(formattedVariant);

    return {
      ...item,
      Variant: formattedVariant,
      Amount: amount,
    };
  });

  const columns = [
    {
      title: "Image Name",
      dataIndex: "Image Name",
      key: "image_name",
    },
    {
      title: "Variant",
      dataIndex: "Variant",
      key: "variant",
    },
    {
      title: "Amount",
      dataIndex: "Amount",
      key: "amount",
    },
    {
      title: "Image Url",
      dataIndex: "Image Url",
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
          <h2>Upload Image Excel Sheet Here 📂</h2>
          <p className="spaced">
            From here, you can upload your image sheet. Kindly ensure that the
            Image URL is in the correct format.
          </p>
          <Upload
            name="file"
            accept=".xlsx, .xls"
            beforeUpload={() => false}
            onChange={handleUpload}
            showUploadList={false}
            className="spaced"
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
          <span style={{ margin: "0 8px" }} />
          <Button
            type="primary"
            className="spaced"
            onClick={processImages}
            loading={loading}
            disabled={loading || !data.length}
          >
            Process Data
          </Button>

          <Table
            columns={columns}
            dataSource={processedData}
            rowKey={(record) => record["Image Name"] || record.index}
            className="spaced"
          />
        </div>
      </Flex>
    </div>
  );
};

export default Images;
