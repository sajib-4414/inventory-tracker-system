import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastType, useNotification } from '../contexts/NotificationContext';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import { server_url } from '../App';

// Define a mapping object for user types
const UserTypeLabels = {
    admin: 'Admin',
    painter: 'Painter',
    supervisor: 'Supervisor',
    supply_coordinator: 'Supply Coordinator'
};

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [newName, setNewName] = useState('');
    const API_ROOT = server_url//process.env.REACT_APP_API_HOST;
    const notificationHook = useNotification();
    axios.defaults.withCredentials = true; // Communicate cookie with the server

    useEffect(() => {
        fetchUsers();
    }, [filter]);

    const fetchUsers = async () => {
        try {
            let queryString = "";
            if (filter !== "all") queryString = `?type=${filter}`;
            const response = await axios.get(`${API_ROOT}/api/v1/users${queryString}`);
            setUsers(response.data.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const handleUpdateUser = (userId, userName) => {
        setSelectedUserId(userId);
        setNewName(userName); // Set the initial value of newName to the existing name
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewName('');
        setSelectedUserId(null);
    };

    const handleNameChange = (e) => {
        setNewName(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_ROOT}/api/v1/users/${selectedUserId}`, { name: newName });
            notificationHook.showNotification('User Updated', {
                type: ToastType.Info,
            });
            setIsModalOpen(false);
            fetchUsers(); // Refresh user list
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`${API_ROOT}/api/v1/users/${userId}`);
            notificationHook.showNotification('User Deleted', {
                type: ToastType.Info,
            });
            fetchUsers(); // Refresh user list
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleEnableDisableUser = async (userId, isEnabled) => {
        try {
            await axios.post(`${API_ROOT}/api/v1/users/setenabled/${userId}`, { isEnabled: !isEnabled });
            notificationHook.showNotification(isEnabled ? 'User Disabled' : 'User Enabled', {
                type: ToastType.Info,
            });
            fetchUsers(); // Refresh user list
        } catch (error) {
            console.error('Error updating user status:', error);
        }
    };

    return (
        <div className="container">
            <div className="row mb-3">
                <div className="col">
                    <div className="container text-center">
                        <Link to="/create-user" className="btn btn-primary mb-1" style={{ width: '300px' }}>Create User</Link>
                    </div>
                    <br></br>
                    <label htmlFor="filter" className="form-label">Filter by type:</label>
                    <select id="filter" className="form-select" value={filter} onChange={handleFilterChange}>
                        <option value="all">All</option>
                        <option value="admin">Admin</option>
                        <option value="painter">Painter</option>
                        <option value="supervisor">Supervisor</option>
                        <option value="supply_coordinator">Supply Coordinator</option>
                    </select>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Type</th>
                                <th>Enabled</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{UserTypeLabels[user.type]}</td> {/* Display human-readable label */}
                                    <td>{user.is_enabled ? 'Enabled' : 'Disabled'}</td>
                                    <td>
                                        <button className="btn btn-primary btn-sm me-1" onClick={() => handleUpdateUser(user._id, user.name)}>Update</button>
                                        <button className="btn btn-danger btn-sm me-1" onClick={() => handleDeleteUser(user._id)}>Delete</button>
                                        <button className="btn btn-secondary btn-sm" onClick={() => handleEnableDisableUser(user._id, user.is_enabled)}>
                                            {user.is_enabled ? 'Disable' : 'Enable'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal isOpen={isModalOpen} onRequestClose={handleCloseModal}>
                <h2>Update User</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="newName">New Name:</label>
                        <input type="text" className="form-control" id="newName" value={newName} onChange={handleNameChange} />
                    </div>
                    <button type="submit" className="btn btn-primary">Update</button>
                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                </form>
            </Modal>
        </div>
    );
};

export default UserList;
