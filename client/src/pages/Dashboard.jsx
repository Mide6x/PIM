import { Flex } from "antd";
import Sidebar from "./sidebar/Sidebar";

const Dashboard = () => {
  return (
    <Flex className="container">
      <Flex gap="medium" align="centers">
        <div className="sidebar">
          <Sidebar />
        </div>

        <Flex vertical flex={1} className="content">
          <div>
            <h2>Content of the Dashboard goes here...</h2>
            <p>Additional content...</p>
          </div>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Dashboard;
