import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastType, useNotification } from '../contexts/NotificationContext';
import { server_url } from '../App';

const AbilityList = () => {
    const [abilities, setAbilities] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const notificationHook = useNotification();
    const API_ROOT = server_url//process.env.REACT_APP_API_HOST;
    axios.defaults.withCredentials = true;

    useEffect(() => {
        fetchAbilities();
    }, []);

    const fetchAbilities = async () => {
        try {
            const response = await axios.get(`${API_ROOT}/api/v1/auth/abilities`);
            setAbilities(response.data.data);
        } catch (error) {
            console.error('Error fetching abilities:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_ROOT}/api/v1/auth/abilities`, formData);
            // Clear form data
            setFormData({
                name: '',
                description: ''
            });
            notificationHook.showNotification('Ability create successful', {
                type: ToastType.Success,
              });
            // Refetch abilities
            fetchAbilities();
        } catch (error) {
            console.error('Error creating ability:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Ability List</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input type="text" className="form-control" id="description" name="description" value={formData.description} onChange={handleChange} />
                </div>
                
                <button type="submit" className="btn btn-primary">Create Ability</button>
            </form>
            <ul className="list-group mt-3">
                {abilities.map((ability) => (
                    <li key={ability._id} className="list-group-item">
                        <h5>{ability.name}</h5>
                        <ul className="list-group">
                            {ability.permissions.map((permission) => (
                                <li key={permission._id} className="list-group-item">{permission.name}</li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AbilityList;
