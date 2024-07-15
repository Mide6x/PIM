import { Card, Flex, Form, Input, Typography } from "antd";

const Register = () => {
  const handleRegister = (values) => {
    console.log(values);
  };

  return (
    <Card className="form-container">
      <Flex>
        {/*This for the Registration Form*/}
        <Flex>
          <Typography.Title level={3} strong className="title">
            Hey there 👋, let&apos;s create an account!
          </Typography.Title>
          <Typography.Text type="secondary" strong className="slogan">
            if you&apos;re here, I assume you work in Sabi...
          </Typography.Text>
          <Form layout="vertical" onFinish={handleRegister} autoComplete="off">
            <Form.Item
              label="Full Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Kindly Input Your Full Name 👉👈",
                },
              ]}
            >
              <Input placeholder="Enter your full name 🫣"></Input>
            </Form.Item>
          </Form>
        </Flex>

        {/*This for the Picture*/}
        <Flex></Flex>
      </Flex>
    </Card>
  );
};

export default Register;
