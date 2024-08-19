import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Flex, message} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState} from "react"


const CategoryDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isArchived, setIsArchived] = useState(false);
    const [category, setCategory] = useState(null)
    

    useEffect(() => {
      const fetchCategoryDetails = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/categories/${id}`
          );
          setCategory(response.data);
          setIsArchived(response.data.isArchived);
        } catch (error) {
          message.error("Failed to fetch categories details 😔");
        }
      };
  
      fetchCategoryDetails();
    }, [id]);

    const handleArchive = async () => {
      try {
        await axios.patch(`http://localhost:3000/api/categories/${id}/archive`);
        setIsArchived(true);
        message.success("Category archived successfully 🎉");
      } catch (error) {
        message.error("Failed to archive category 😔");
      }
    };
  
    const handleUnarchive = async (category) => {
      try {
        await axios.patch(
          `http://localhost:3000/api/categories/${category._id}/unarchive`
        );
        message.success("Category unarchived successfully 🎉");
        fetchCategories();
      } catch (error) {
        message.error("Failed to unarchive category 😔");
      }
    };


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
            <div>
            <Button className="archiveBtn" onClick={() => handleArchive(record)}>
            Archive
          </Button>
            </div>
          </div>
          </Flex>
  )
}

export default CategoryDetails;
