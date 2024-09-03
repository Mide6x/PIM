import { Upload, Form, Button, message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";

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

const ImageUploadSection = () => (
  <>
    <p className="formTitle">Product Image</p>
    <Form.Item
      name="imageUrl"
      rules={[{ required: true, message: "Please enter the image URL" }]}
      className="imgUpload"
    >
      <Upload {...uploadProps} listType="picture">
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
  </>
);

export default ImageUploadSection;
