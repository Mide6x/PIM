import Sidebar from "./sidebar/Sidebar";
import { Flex } from "antd";
const Approval = () => {
  return (
    <div className="container">
      <div className="sidebar">
        <Sidebar />
      </div>
      <Flex vertical flex={1} className="content">
      <div>
        <div>
          <h2>Product Approval ✅</h2>
          <p className="spaced">
            From here, you can approve and edit products before pushing to the
            database.
          </p>
        </div>
      </div>
      </Flex>
    </div>
  );
};

export default Approval;
