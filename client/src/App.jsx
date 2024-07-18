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
import Categories from "./pages/Categories";

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
      </Routes>
    </Router>
  );
};

export default App;
