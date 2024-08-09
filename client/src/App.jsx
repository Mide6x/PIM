import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Register from "./Auth/Register";
import Login from "./Auth/Login";
import Dashboard from "./pages/Dashboard";
import useAuth from "./contexts/useAuth";
import UploadTab from "./pages/UploadTab";
import Approval from "./pages/Approval";
import Images from "./pages/Images";
import MngManufacturers from "./pages/MngManufacturers";
import Categories from "./pages/Categories";
import Variants from "./pages/Variants";

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Register />
          }
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/dashboard/*"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/uploadtab/*"
          element={isAuthenticated ? <UploadTab /> : <Navigate to="/" />}
        />
        <Route
          path="/categories/*"
          element={isAuthenticated ? <Categories /> : <Navigate to="/" />}
        />
        <Route
          path="/approval/*"
          element={isAuthenticated ? <Approval /> : <Navigate to="/" />}
        />
        <Route
          path="/mngmanufacturers/*"
          element={isAuthenticated ? <MngManufacturers /> : <Navigate to="/" />}
        />
        <Route
          path="/images/*"
          element={isAuthenticated ? <Images /> : <Navigate to="/" />}
        />
        <Route
          path="/variants/*"
          element={isAuthenticated ? <Variants /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
