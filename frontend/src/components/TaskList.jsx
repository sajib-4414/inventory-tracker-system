import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastType, useNotification } from '../contexts/NotificationContext';
import { Link } from 'react-router-dom';
const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const notificationHook = useNotification();
  const fetchTasks = async () => {
    try {
      const API_ROOT = process.env.REACT_API_HOST;
      axios.defaults.withCredentials = true;
      const response = await axios.get(`${API_ROOT}/api/v1/tasks`);
      setTasks(response.data.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };
  useEffect(() => {
    fetchTasks();
  }, []);

  const handleMarkAsDone = async (taskId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'due' ? 'done' : 'due';
      const API_ROOT = process.env.REACT_API_HOST;
      axios.defaults.withCredentials = true;
      const response = await axios.put(`${API_ROOT}/api/v1/tasks/updateanytask`, { 
        taskId,
        status: newStatus
     });
     fetchTasks();
     notificationHook.showNotification('Task update successful', {
        type: ToastType.Success,
      });
      console.log('Task status updated:', response.data);
      
    } catch (error) {
      console.error('Update task status error:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const API_ROOT = process.env.REACT_API_HOST;
      axios.defaults.withCredentials = true;
      const response = await axios.delete(`${API_ROOT}/api/v1/tasks/${taskId}`);
      console.log('Task deleted:', response.data);
      notificationHook.showNotification('Task delete successful', {
        type: ToastType.Info,
      });
      // Remove the deleted task from the ui by fetching the tasks again
      fetchTasks();
    } catch (error) {
      console.error('Delete task error:', error);
    }
  };


  return (
    <div className="container">

<div className="container text-center">
                        <Link to="/create-task" className="btn btn-primary mb-1" style={{ width: '300px' }}>Create Task</Link>
  </div>
      
      <h2>Task List</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>House Address</th>
            <th>Paint Color</th>
            <th>User</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task._id}>
              <td>{task.title}</td>
              <td>{task.status}</td>
              <td>{task.houseAddress}</td>
              <td>{task.paintColor}</td>
              <td>{task.user.name}</td>
              <td>
                <button className="btn btn-primary" onClick={() => handleMarkAsDone(task._id, task.status)}>
                  {task.status === 'due' ? 'Mark as Done' : 'Mark as Due'}
                </button>
                <button className="btn btn-danger mx-2" onClick={() => handleDeleteTask(task._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
