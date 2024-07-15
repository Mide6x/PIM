import { Button, Card, Flex, Form, Input, Typography } from "antd";
import { Link } from "react-router-dom";

const Register = () => {
  const handleRegister = (values) => {
    console.log(values);
  };

  return (
    <Card className="form-container">
      <Flex>
        {/*This for the Registration Form*/}
        <Flex vertical flex={1}>
          <Typography.Title level={3} strong className="title">
            Welcome Pookie, let&apos;s create an account for you! 🎉
          </Typography.Title>
          <Typography.Text type="secondary" strong className="slogan">
            if you&apos;re here, I assume you work in Sabi.
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
              <Input size="large" placeholder="Enter your full name"></Input>
            </Form.Item>
            <Form.Item
              label="Sabi E-mail Address"
              name="email"
              rules={[
                {
                  required: true,
                  message: "We'll need your E-mail address Pookie 👉👈",
                },
                {
                  type: "email",
                  message:
                    "That input does not look like an E-mail sorry, let's do that again?",
                },
              ]}
            >
              <Input size="large" placeholder="...and your E-mail"></Input>
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Your Password is Important.",
                },
              ]}
            >
              <Input.Password
                size="large"
                placeholder="Give us a Strong Password? 🥷🏿"
              ></Input.Password>
            </Form.Item>
            <Form.Item
              label="Password"
              name="passwordConfirm"
              rules={[
                {
                  required: true,
                  message: "Type in your password again.",
                },
              ]}
            >
              <Input.Password
                size="large"
                placeholder="type your password again."
              ></Input.Password>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="btn"
              >
                Create Account
              </Button>
            </Form.Item>
            <Form.Item>
              <Link to="/login">
                <Button size="large" className="btn">
                  Sign In
                </Button>
              </Link>
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
