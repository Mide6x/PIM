import { Routes, Route, Navigate } from "react-router-dom";
import useAuth from "../../contexts/useAuth";
import Login from "../../Auth/Login";

const SidebarRoutes = () => {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
      />
      <Route
        path="/uploadtab"
        element={isAuthenticated ? <Navigate to="/uploadtab" /> : <Login />}
      />
    </Routes>
  );
};

export default SidebarRoutes;
