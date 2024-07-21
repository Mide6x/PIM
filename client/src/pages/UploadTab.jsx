import { useState, useEffect } from "react";
import { Flex, Button, message, Upload, Table } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Sidebar from "./sidebar/Sidebar";
import * as XLSX from "xlsx";
import axios from "axios";

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
        const data = XLSX.utils.sheet_to_json(ws);
        setData(data);
      } catch (error) {
        message.error(
          "Failed to read the file. Ensure it is a valid Excel file. 😔"
        );
        console.error("Error reading file:", error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const preprocessCategories = (categories) => {
    const categoryMap = {};
    categories.forEach((category) => {
      categoryMap[category.name.toLowerCase()] = category.name;
      category.subcategories.forEach((subcategory) => {
        categoryMap[
          subcategory.toLowerCase()
        ] = `${category.name} > ${subcategory}`;
      });
    });
    return categoryMap;
  };

  const categoryMap = preprocessCategories(categoryData);

  const categorizeProduct = (productName, manufacturer) => {
    const tokens = new Set(productName.toLowerCase().split());
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

    for (const token of tokens) {
      if (categoryMap[token]) {
        return categoryMap[token];
      }
    }

    return null;
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

  const extractAmount = (weightStr) => {
    try {
      let amount_start = weightStr.indexOf("x");
      if (amount_start === -1) amount_start = weightStr.indexOf("×");
      if (amount_start === -1) amount_start = weightStr.indexOf("X");
      if (amount_start === -1) return null;
      return parseInt(weightStr.slice(amount_start + 1));
    } catch {
      return null;
    }
  };

  const cleanData = (df) => {
    df = df.map((row) => {
      const variant = convertVariantFormat(row["Variant"]);
      const weight = extractSize(variant);
      const amount = extractAmount(variant);
      const weightInKg = weight && amount ? (weight * amount) / 1000 : null;

      return {
        ...row,
        "Product Category": categorizeProduct(
          row["Product Name"],
          row["Manufacturer Name"]
        ),
        Variant: variant,
        "Variant Type": "Size",
        Weight: weight,
        Amount: amount,
        "Weight (in Kg)": weightInKg ? Math.round(weightInKg) : null,
      };
    });
    return df;
  };

  const handleProcess = () => {
    setLoading(true);
    let cleanedData = cleanData(data);
    setData(cleanedData);
    setLoading(false);
    message.success("Data processing completed 🎉.");
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
      title: "Product Category",
      dataIndex: "Product Category",
      key: "product_category",
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
      title: "Weight",
      dataIndex: "Weight",
      key: "weight",
    },
    {
      title: "Amount",
      dataIndex: "Amount",
      key: "amount",
    },
    {
      title: "Weight (in Kg)",
      dataIndex: "Weight (in Kg)",
      key: "weight_in_kg",
    },
  ];

  return (
    <div className="container">
      
        <div className="sidebar">
          <Sidebar />
        </div>
        <Flex vertical flex={1} className="content">
          <div>
            <h2>Upload Excel Sheet Here 📂</h2>
            <p className="spaced">
              From here, you can upload you product sheet.
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
              onClick={handleProcess}
              disabled={loading || !data.length}
            >
              Process Data
            </Button>

            {data.length > 0 && (
              <Table
                columns={columns}
                dataSource={data}
                rowKey="Product Name"
                className="spaced"
              />
            )}
          </div>
        </Flex>
      
    </div>
  );
};

export default UploadTab;
