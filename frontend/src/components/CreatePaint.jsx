import React, { useState } from 'react';
import axios from 'axios';
import { ToastType, useNotification } from '../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { server_url } from '../App';

const CreatePaint = () => {
    const [color, setColor] = useState('');
    const [quantity, setQuantity] = useState('');
    const API_ROOT = server_url//process.env.REACT_APP_API_HOST;
    axios.defaults.withCredentials = true;
    const notificationHook = useNotification();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            
            const response = await axios.post(`${API_ROOT}/api/v1/paints`, {
                color,
                quantity
            });
            console.log('Paint created:', response.data);
            notificationHook.showNotification('Task update successful', {
                type: ToastType.Success,
              });
              navigate('/')
            
        } catch (error) {
            console.error('Error creating paint:', error);
            
        }
    };

    return (
        <div className="container mt-5">
            <h2>Create Paint</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="color" className="form-label">Color</label>
                    <input
                        type="text"
                        className="form-control"
                        id="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="quantity" className="form-label">Quantity</label>
                    <input
                        type="text"
                        className="form-control"
                        id="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Create Paint</button>
            </form>
        </div>
    );
};

export default CreatePaint;
