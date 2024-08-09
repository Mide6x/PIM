import { Flex } from "antd";
import Sidebar from "./sidebar/Sidebar";
import Topbar from "./sidebar/Topbar";

const Variants = () => {
  return (
    <div className="container">
      <div>
        <Sidebar />
      </div>

      <div className="fullcontent">
        <div className="cont">
          <Topbar />
        </div>
        <Flex vertical flex={1} className="content">
          <div>
          <h2>Variants Management</h2>
            <div className="details" style={{ marginTop: "20px" }}>
              <span style={{ margin: "0 8px" }} />
              </div>
          </div>
        </Flex>
      </div>
    </div>
  );
};

export default Variants;
