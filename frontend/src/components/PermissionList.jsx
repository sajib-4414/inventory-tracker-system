import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { server_url } from '../App';

const PermissionList = () => {
    const [permissions, setPermissions] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        code: ''
    });
    const API_ROOT = server_url//process.env.REACT_APP_API_HOST;
    axios.defaults.withCredentials = true;

    useEffect(() => {
        fetchPermissions();
    }, []);

    const fetchPermissions = async () => {
        try {
            const response = await axios.get(`${API_ROOT}/api/v1/auth/permissions`);
            setPermissions(response.data.data);
        } catch (error) {
            console.error('Error fetching permissions:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_ROOT}/api/v1/auth/permissions`, formData);
            // Clear form data
            setFormData({
                name: '',
                description: '',
                code: ''
            });
            // Refetch permissions
            fetchPermissions();
        } catch (error) {
            console.error('Error creating permission:', error);
        }
    };

    const handleDelete = async (permissionId) => {
        try {
            await axios.delete(`${API_ROOT}/api/v1/auth/permissions/${permissionId}`);
            fetchPermissions();
        } catch (error) {
            console.error('Error deleting permission:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Permission List</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input type="text" className="form-control" id="description" name="description" value={formData.description} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="code" className="form-label">Code</label>
                    <input type="text" className="form-control" id="code" name="code" value={formData.code} onChange={handleChange} />
                </div>
                <button type="submit" className="btn btn-primary">Create Permission</button>
            </form>
            <table className="table mt-3">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {permissions.map(permission => (
                        <tr key={permission._id}>
                            <td>{permission.name}</td>
                            <td>{permission.description}</td>
                            <td>
                                <button className="btn btn-danger" onClick={() => handleDelete(permission._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PermissionList;
