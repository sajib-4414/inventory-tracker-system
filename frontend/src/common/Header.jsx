import React, { useState, useEffect } from "react";
import { Link, useHistory, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastType, useNotification } from "../contexts/NotificationContext";
import { server_url } from "../App";

const Header = () => {
  const [userType, setUserType] = useState(""); // Initialize userType state
  const notificationHook = useNotification();
  const [name, setName] = useState("");
  const navigate = useNavigate();

  // Function to handle logout
  const handleLogout = async () => {
    try {
      const API_ROOT = server_url//process.env.REACT_APP_API_HOST;
      axios.defaults.withCredentials = true;
      await axios.get(`${API_ROOT}/api/v1/auth/logout`);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      notificationHook.showNotification('Logout successful', {
        type: ToastType.Success,
      });
      //navigate('/'); TODO needs State implmenetation for the header to take effect
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Get user data from local storage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserType(user.type);
      setName(user.name)
    }
  }, []);

  // Render additional menu items based on user type
  const renderAdditionalMenuItems = () => {
    switch (userType) {
      case "painter":
        return (
          <>
            <li className="nav-item">
              <Link to="/tasks-list" className="nav-link text-white">
                My Tasks
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/" className="nav-link text-white">
                Paint Inventory
              </Link>
            </li>
          </>
        );
      case "supervisor":
        return (
          <>
          <li className="nav-item">
              <Link to="/" className="nav-link text-white">
                Paint Inventory
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/tasks-list" className="nav-link text-white">
                All Tasks
              </Link>
            </li>
            
          </>
        );
      case "supply_coordinator":
        return (
          <li className="nav-item">
            <Link to="/" className="nav-link text-white">
              Paint Inventory
            </Link>
          </li>
        );
      case "admin":
        return (
          <>
          <li className="nav-item">
              <Link to="/" className="nav-link text-white">
                Paint Inventory
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/user-list" className="nav-link text-white">
                All Users
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/tasks-list" className="nav-link text-white">
                All Tasks
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/abilities-list" className="nav-link text-white">
                All Abilities
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/all-permissions" className="nav-link text-white">
                All Permissions
              </Link>
            </li>
            
          </>
        );
      default:
        return null;
    }
  };

  return (
    <header className="p-3 bg-dark text-white">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-between">
          <Link
            to="/"
            className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none"
          >
            <h2 className="text-white">Paint Stock System</h2>
          </Link>

          

          
          <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
              {userType && renderAdditionalMenuItems()} {/* Render additional menu items */}
            </ul>
          <div className="">
            
            {userType ? (
              <>
              <span className="nav-item">{name} ({userType}) </span>
              <button
                className="btn btn-outline-light me-2"
                onClick={handleLogout}
              >
                Logout
              </button>
              </>
              
            ) : (
              <>
                <Link to="login" className="btn btn-outline-light me-2">
                  Login
                </Link>
                <Link to="signup" className="btn btn-warning">
                  Sign-up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
