import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Flex} from "antd";
import { useNavigate } from "react-router-dom";

const CategoryDetails = () => {
    const navigate = useNavigate();
  return (
    <Flex vertical flex={1} className="content">
          <div className="intro">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              className="backButton"
            >
              {" "}
             Categories
            </Button>
            <h2>Category Details</h2>
          </div>
          </Flex>
  )
}

export default CategoryDetails
