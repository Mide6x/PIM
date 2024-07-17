import { Card, Flex } from "antd";
import Sidebar from "./sidebar/Sidebar";

const UploadTab = () => {
  return (
    <Card className="container">
      <Flex gap="large" align="centers">
        <Flex flex={1}>
          <Sidebar />
        </Flex>

        <Flex vertical flex={1}>
          <h2>Upload excel sheet Here</h2>
          <p>Additional content...</p>
        </Flex>
      </Flex>
    </Card>
  );
};

export default UploadTab;
