import { useState } from "react";
import { Flex, Button, message, Upload, Table } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Sidebar from "../sidebar/Sidebar";
import * as XLSX from "xlsx";
import axios from "axios";

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

    const processImages = async () => {
        setLoading(true);
        try {
            const response = await axios.post("/api/images/process", { images: data });
            message.success("Images processed successfully.");
            console.log(response.data.results);
        } catch (error) {
            message.error("Failed to process images.");
            console.error("Error processing images:", error);
        }
        setLoading(false);
    };

    const columns = [
        {
            title: "Image Name",
            dataIndex: "Image Name",
            key: "image_name",
        },
        {
            title: "Image Url",
            dataIndex: "Image Url",
            key: "image_url",
        },
    ];

    return (
        <div className="container">
            <Flex gap="medium" align="centers">
                <div className="sidebar">
                    <Sidebar />
                </div>
                <Flex vertical flex={1} className="content">
                    <div>
                        <h2>Upload Image Excel Sheet Here 📂</h2>
                        <p className="spaced">
                            From here, you can upload your image sheet. Kindly ensure that the Image URL is in the correct format.
                        </p>
                        <Upload
                            name="file"
                            accept=".xlsx, .xls"
                            beforeUpload={() => false} // Prevent automatic upload
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

                        {data.length > 0 && (
                            <Table
                                columns={columns}
                                dataSource={data}
                                rowKey="Image Name"
                                className="spaced"
                            />
                        )}
                    </div>
                </Flex>
            </Flex>
        </div>
    );
};

export default Images;
