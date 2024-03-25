import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastType, useNotification } from '../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { server_url } from '../App';

const CreateTask = () => {
  const [title, setTitle] = useState('');
  const [houseAddress, setHouseAddress] = useState('');
  const [paints, setPaints] = useState([]);
  const [selectedPaint, setSelectedPaint] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [error, setError] = useState('');
  axios.defaults.withCredentials = true;
  const API_ROOT = server_url//process.env.REACT_APP_API_HOST;
  const notificationHook = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch paints and painter users when component mounts
    fetchPaints();
    fetchPainterUsers();
  }, []);

  const fetchPaints = async () => {
    try {
      const response = await axios.get(`${API_ROOT}/api/v1/paints`);
      setPaints(response.data.data);
    } catch (error) {
      console.error('Error fetching paints:', error);
      setError('Failed to fetch paints.');
    }
  };

  const fetchPainterUsers = async () => {
    try {
      const response = await axios.get(`${API_ROOT}/api/v1/users?type=painter`);
      console.log("users is",response.data.data)
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching painter users:', error);
      setError('Failed to fetch painter users.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send task creation request to API
      await axios.post(`${API_ROOT}/api/v1/tasks`, {
        title,
        houseAddress,
        paintColor: selectedPaint,
        userId: selectedUser,
      });
      // Task created successfully, reset form fields
      setTitle('');
      setHouseAddress('');
      setSelectedPaint('');
      setSelectedUser('');
      setError('');
      notificationHook.showNotification('Task created successfully', {
        type: ToastType.Success,
      });
      navigate('/tasks-list')
      
    } catch (error) {
      console.error('Error creating task:', error);
      setError('Failed to create task.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create Task</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input type="text" className="form-control" id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="houseAddress">House Address:</label>
          <input type="text" className="form-control" id="houseAddress" name="houseAddress" value={houseAddress} onChange={(e) => setHouseAddress(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="paintColor">Select Paint Color:</label>
          <select className="form-control" id="paintColor" name="paintColor" value={selectedPaint} onChange={(e) => setSelectedPaint(e.target.value)} required>
            <option value="">Select Paint Color</option>
            {paints.map(paint => (
              <option key={paint._id} value={paint.color}>{paint.color}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="user">Assign To:</label>
          <select className="form-control" id="user" name="user" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} required>
            <option value="">Select User</option>
            {users && users.map(user => (
              <option key={user._id} value={user._id}>{user.name}</option>
            ))}
          </select>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default CreateTask;
