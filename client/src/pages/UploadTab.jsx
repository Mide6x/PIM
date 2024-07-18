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

  const cleanData = (df) => {
    df = df.map((row) => ({
      ...row,
      "Product Category": categorizeProduct(
        row["Product Name"],
        row["Manufacturer Name"]
      ),
    }));
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
              <Button className="spaced" icon={<UploadOutlined />}>
                Click to Upload
              </Button>
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
      </Flex>
    </Flex>
  );
};

export default UploadTab;
