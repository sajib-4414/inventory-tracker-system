import React, { useState } from "react";
import axios from "axios";
import { ToastType, useNotification } from "../contexts/NotificationContext";
import { useNavigate } from "react-router-dom";
import { server_url } from "../App";

const UserType = {
    Admin: "admin",
    Painter: "painter",
    Supervisor: "supervisor",
    SupplyCoordinator: "supply_coordinator",
  };

const CreateUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState(UserType.Painter);
  const [loading, setLoading] = useState(false);
  const notificationHook = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const API_ROOT = server_url//process.env.REACT_APP_API_HOST;
      axios.defaults.withCredentials = true;
      await axios.post(`${API_ROOT}/api/v1/users`, {
        name,
        email,
        password,
        type: userType,
      });
      setLoading(false);
      // Redirect to user list page after successful user creation
      
      notificationHook.showNotification('User created successfully', {
        type: ToastType.Success,
      });
      navigate('/user-list');
    } catch (error) {
      setLoading(false);
      console.error("User creation error:", error);
    }
  };

  return (
    <div className="container">
      <h2>Create a User</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="userType" className="form-label">
            User Type
          </label>
          <select
            className="form-select"
            id="userType"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            required
            >
            <option value={UserType.Admin}>Admin</option>
            <option value={UserType.Painter}>Painter</option>
            <option value={UserType.Supervisor}>Supervisor</option>
            <option value={UserType.SupplyCoordinator}>Supply Coordinator</option>
            </select>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>
    </div>
  );
};

export default CreateUser;
