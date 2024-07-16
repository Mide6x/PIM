import { Button } from "antd";
import useAuth from "../contexts/useAuth"; // Correct path to useAuth hook

const Dashboard = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout(); // Call logout function
  };

  return (
    <>
      <div>Dashboard</div>
      <Button onClick={handleLogout}>Logout</Button>{" "}
      {/* Use handleLogout function */}
    </>
  );
};

export default Dashboard;
