import PropTypes from "prop-types";
import { Button, Form, Input } from "antd";
import { useEffect } from "react";
import useAuth from "../../contexts/useAuth";

const VariantForm = ({ initialValues, onCancel, onOk }) => {
  const [form] = Form.useForm();
  const { userData } = useAuth();

  useEffect(() => {
    if (userData && userData._id) {
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          subVariants: initialValues.subVariants.join(", "),
        });
      } else {
        form.resetFields();
      }
    }
  }, [initialValues, form, userData]);

  const onFinish = (values) => {
    values.subvariants = values.subVariants
      .split(",")
      .map((item) => item.trim());

    onOk(values);
  };

  return (
    <>
      {userData && (
        <Form form={form} onFinish={onFinish}>
              <p className="formTitle">Variant Name</p>
          <Form.Item
            name="name"
     
            rules={[
              { required: true, message: "Please input the variant name!" },
            ]}
          >
            <Input  className="userInput" placeholder="Enter variant name (e.g. Color, Size)" />
          </Form.Item>
          <p className="formTitle">Sub-Variants</p>
          <Form.Item
            name="subVariants"
          
            rules={[
              { required: true, message: "Please input the sub-variants!" },
            ]}
          >
            <Input  className="userInput" placeholder="Enter sub-variants separated by commas (e.g. Red, Blue, Green)" />
          </Form.Item>
          <Form.Item>
            <Button onClick={onCancel}  className="editBtn">Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
               className="addBtn"
              style={{ marginLeft: "10px" }}
            >
              Save
            </Button>
          </Form.Item>
        </Form>
      )}
    </>
  );
};

VariantForm.propTypes = {
  initialValues: PropTypes.shape({
    name: PropTypes.string,
    subVariants: PropTypes.arrayOf(PropTypes.string),
  }),
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
};

export default VariantForm;