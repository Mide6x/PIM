import { Upload, Form, Button, message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useState } from "react";

const uploadProps = {
  accept: ".jpg,.jpeg,.png",
  beforeUpload: (file) => {
    const isJpgOrPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/jpg";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    return isJpgOrPng || Upload.LIST_IGNORE;
  },
  maxCount: 1,
};

const ImageUploadSection = () => {
  const [imageUrl, setImageUrl] = useState(null);

  const handleUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
        const response = await axios.post("http://localhost:3000/api/v1/processedproductformimages", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        
      if (response.status === 200) {
        setImageUrl(response.data.imageUrl);
        message.success("Image uploaded successfully!");
        console.log("Image uploaded successfully:", response.data);
        console.log("Image URL:", response.data.imageUrl);
      } else {
        message.error("Failed to upload image.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      message.error("An error occurred while uploading the image.");
    }
  };

  return (
    <>
      <p className="formTitle">Product Image</p>
      <Form.Item
        name="imageUrl"
        rules={[{ required: true }]}
        className="imgUpload"
      >
        <Upload
          {...uploadProps}
          listType="picture"
          customRequest={handleUpload}
        >
          <Button className="imgbtn">
            <FontAwesomeIcon
              icon={faCloudArrowUp}
              size="2xl"
              style={{ color: "#069f7e" }}
            />
            Upload Image
          </Button>
        </Upload>
        <span>Supported file formats: JPG, JPEG, and PNG</span>
      </Form.Item>
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Uploaded"
          style={{ marginTop: 16, maxWidth: "100%" }}
        />
      )}
    </>
  );
};

export default ImageUploadSection;
