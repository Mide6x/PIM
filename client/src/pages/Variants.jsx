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
            <div className="detailsContainer">
              <div className="variantDetails" style={{ marginTop: "20px" }}>
               <h3>Add or Update Variants</h3>
              </div>
              <div className="variantDetails" style={{ marginTop: "20px" }}>
              <h3>Existing Variants</h3>
              <p></p>
              </div>
            </div>
          </div>
        </Flex>
      </div>
    </div>
  );
};

export default Variants;
