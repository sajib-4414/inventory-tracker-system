import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState('all');
    const API_ROOT = process.env.REACT_API_HOST;
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

    const handleUpdateUser = (userId) => {
        // Navigate to update user page or modal
    };

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`${API_ROOT}/3001/api/v1/users/${userId}`);
            // Refresh user list
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleEnableDisableUser = async (userId, isEnabled) => {
        try {
            await axios.post(`${API_ROOT}/api/v1/users/setenabled/${userId}`, { isEnabled: !isEnabled });
            // Refresh user list
            fetchUsers();
        } catch (error) {
            console.error('Error updating user status:', error);
        }
    };

    return (
        <div className="container">
            <div className="row mb-3">
                <div className="col">
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
                                    <td>{user.type}</td>
                                    <td>{user.is_enabled ? 'Enabled' : 'Disabled'}</td>
                                    <td>
                                        <button className="btn btn-primary btn-sm me-1" onClick={() => handleUpdateUser(user._id)}>Update</button>
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
        </div>
    );
};

export default UserList;
