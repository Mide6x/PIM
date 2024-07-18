import { useState, useEffect } from "react";
import { Flex, Button, message, Upload, Table } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import axios from "axios";
import Sidebar from "./sidebar/Sidebar";

const UploadTab = () => {
  const [data, setData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategoryData();
  }, []);

  const fetchCategoryData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/categories");
      setCategoryData(response.data);
    } catch (error) {
      message.error("Failed to fetch categories");
    }
  };

  const handleUpload = (info) => {
    console.log("Upload Info:", info);

    const file = info.file;
    if (!file) {
      message.error("No file selected");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer = e.target.result;
      console.log("ArrayBuffer:", arrayBuffer);

      const binaryString = new TextDecoder("utf-8").decode(
        new Uint8Array(arrayBuffer)
      );
      console.log("Binary String:", binaryString);

      const wb = XLSX.read(binaryString, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      console.log("Parsed Data:", data);

      setData(data);
    };
    reader.readAsArrayBuffer(file);
  };

  const convertVariantFormat = (variant) => {
    variant = String(variant);

    // Normalize input by replacing '×' with 'x', 'ltr' with 'L', and removing spaces around 'x'
    variant = variant.replace(/ltr/g, "L").replace(/\s*[xX×]\s*/g, "x");

    // Patterns to match various formats with dynamic units
    const pattern1 = new RegExp("(\\d+)\\s*([a-zA-Z]+)\\s*x\\s*(\\d+)", "i");
    const pattern2 = new RegExp("(\\d+)\\s*x\\s*(\\d+)\\s*([a-zA-Z]+)", "i");
    const pattern3 = new RegExp("(\\d+)x(\\d+)([a-zA-Z]+)", "i");

    // Try to match each pattern and convert to "sizeUNIT x number"
    const match1 = pattern1.exec(variant);
    if (match1) {
      const size = match1[1];
      const unit = match1[2];
      const count = match1[3];
      return `${size.toUpperCase()}${unit.toUpperCase()} x ${count}`;
    }

    const match2 = pattern2.exec(variant);
    if (match2) {
      const count = match2[1];
      const size = match2[2];
      const unit = match2[3];
      return `${size.toUpperCase()}${unit.toUpperCase()} x ${count}`;
    }

    const match3 = pattern3.exec(variant);
    if (match3) {
      const count = match3[1];
      const size = match3[2];
      const unit = match3[3];
      return `${size.toUpperCase()}${unit.toUpperCase()} x ${count}`;
    }

    return variant;
  };

  const extractSize = (weightStr) => {
    try {
      // Use regular expression to match a number followed by "kg", "G", or "ml"
      const match = weightStr.match(/(\d+\.?\d*)(KG|G|ML|L|CL)/i);
      if (match) {
        const value = parseFloat(match[1]); // Extract the numeric part
        const unit = match[2].toUpperCase();
        if (unit === "KG") return value * 1000; // Convert kg to grams
        if (unit === "G") return value;
        if (unit === "ML") return value; // Assuming density of 1 g/ml
        if (unit === "L") return value * 1000; // Convert litre to grams
        if (unit === "CL") return value * 10; // Convert centilitre to grams
      }
      return null; // Handle cases where no unit or invalid format is found
    } catch {
      return null; // Handle other potential errors during conversion
    }
  };

  const extractAmount = (weightStr) => {
    try {
      let amountStart = weightStr.indexOf("x");
      if (amountStart === -1) amountStart = weightStr.indexOf("×");
      if (amountStart === -1) amountStart = weightStr.indexOf("X");
      if (amountStart === -1) return null;
      return parseInt(weightStr.slice(amountStart + 1));
    } catch {
      return null;
    }
  };

  const categorizeProduct = (productName, manufacturer) => {
    const tokens = productName.toLowerCase().split();
    const lowerCaseManufacturer = manufacturer.toLowerCase();

    for (const token of tokens) {
      if (token.includes("poundo") || token.includes("iyan")) {
        return "Poundo, Wheat & Semolina";
      } else if (token.includes("rum") || token.includes("liqueur")) {
        return "Liquers & Creams";
      } else if (token.includes("soda") || token.includes("bicarbonate")) {
        return "Baking Tools & Accessories";
      } else if (token.includes("custard")) {
        return "Oats & Instant Cereals";
      } else if (token.includes("sauce")) {
        return "Cooking Oils";
      }
    }

    if (lowerCaseManufacturer.includes("the coca-cola company")) {
      return "Fizzy Drinks & Malt";
    } else if (lowerCaseManufacturer.includes("mount gay barbados")) {
      return "Liquers & Creams";
    }

    for (const category of categoryData) {
      const productTypes = category.product_types || [];
      for (const productType of productTypes) {
        for (const token of tokens) {
          if (productType.toLowerCase().includes(token)) {
            return category.name;
          }
        }
      }
    }

    return null;
  };

  const cleanData = (df) => {
    df = df.map((row) => ({
      ...row,
      "Product Category": categorizeProduct(
        row["Product Name"],
        row["Manufacturer Name"]
      ),
      Variant: convertVariantFormat(row["Variant"]),
      "Variant Type": "Size",
      Weight: extractSize(row["Variant"]),
      Amount: extractAmount(row["Variant"]),
      "Weight (g)": Math.round(
        (extractSize(row["Variant"]) * extractAmount(row["Variant"])) / 1000 + 1
      ),
      "Product Name": row["Product Name"]
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
    }));
    return df;
  };

  const handleProcess = () => {
    setLoading(true);
    let cleanedData = cleanData(data);
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
      dataIndex: "Weight (g)",
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
              <Table
                columns={columns}
                dataSource={data}
                rowKey="Product Name"
              />
            )}
          </div>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default UploadTab;
