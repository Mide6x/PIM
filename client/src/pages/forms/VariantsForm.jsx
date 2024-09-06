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
          <Form.Item
            name="name"
            label="Variant Name"
            rules={[
              { required: true, message: "Please input the variant name!" },
            ]}
          >
            <Input placeholder="Enter variant name (e.g. Color, Size)" />
          </Form.Item>
          <Form.Item
            name="subVariants"
            label="Sub-Variants"
            rules={[
              { required: true, message: "Please input the sub-variants!" },
            ]}
          >
            <Input placeholder="Enter sub-variants separated by commas (e.g. Red, Blue, Green)" />
          </Form.Item>
          <Form.Item>
            <Button onClick={onCancel}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
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
