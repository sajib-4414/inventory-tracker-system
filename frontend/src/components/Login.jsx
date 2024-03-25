import React, { useState } from 'react';
import axios from 'axios';
import { ToastType, useNotification } from '../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { server_url } from '../App';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const notificationHook = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const API_ROOT = server_url//process.env.REACT_APP_API_HOST;
      axios.defaults.withCredentials = true;
      const response = await axios.post(`${API_ROOT}/api/v1/auth/login`, {
        email,
        password,
      });
      console.log('Login successful:', response.data);
      
      // Store user data and token in local storage
      localStorage.setItem('user', JSON.stringify(response.data.data));
      localStorage.setItem('token', response.data.token);

      notificationHook.showNotification('Login successful', {
        type: ToastType.Success,
      });
      //navigate('/'); TODO needs State implmenetation for the header to take effect
      setTimeout(() => {
        window.location.href = "/";
      }, 700);

    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
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
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
};

export default Login;
