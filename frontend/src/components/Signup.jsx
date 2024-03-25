import React, { useState } from "react";
import axios from "axios";
import { ToastType, useNotification } from "../contexts/NotificationContext";
import { useNavigate } from "react-router-dom";
import { server_url } from "../App";

const UserType = {
  Painter: "painter",
  Supervisor: "supervisor",
  SupplyCoordinator: "supply_coordinator",
};

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState(UserType.Painter);
  const [loading, setLoading] = useState(false);
  const notificationHook = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const API_ROOT = server_url//process.env.REACT_APP_API_HOST;
      axios.defaults.withCredentials = true;
      const response = await axios.post(`${API_ROOT}/api/v1/auth/register`, {
        name,
        email,
        password,
        type: userType,
      });
      const { token, data } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(data));
      setLoading(false);
      // Redirect to home page or any other route after successful registration
      
      notificationHook.showNotification('Registration successful', {
        type: ToastType.Success,
      });
      // navigate('/'); TODO needs State implmenetation for the header to take effect
      setTimeout(() => {
        window.location.href = "/";
      }, 700);
    } catch (error) {
      setLoading(false);
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="container">
      <h2>Signup</h2>
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
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            <option value={UserType.Painter}>Painter</option>
            <option value={UserType.Supervisor}>Supervisor</option>
            <option value={UserType.SupplyCoordinator}>Supply Coordinator</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Loading..." : "Signup"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
