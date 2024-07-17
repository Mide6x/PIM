import { Card, Flex } from "antd";
import Sidebar from "./sidebar/Sidebar";

const Dashboard = () => {
  return (
    <Card className="container">
      <Flex gap="large" align="centers">
        <Flex flex={1}>
          <Sidebar />
        </Flex>

        <Flex vertical flex={1}>
          <h2>Content of the Dashboard goes here...</h2>
          <p>Additional content...</p>
        </Flex>
      </Flex>
    </Card>
  );
};

export default Dashboard;
