import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { ToastType, useNotification } from '../contexts/NotificationContext';

Modal.setAppElement('#root');

const PaintInventory = () => {
  const [paints, setPaints] = useState([]);
  const [selectedPaint, setSelectedPaint] = useState(null);
  const [quantity, setQuantity] = useState('');
  const notificationHook = useNotification();
  const [showModal, setShowModal] = useState(false);
  const fetchPaints = async () => {
    try {
      const API_ROOT = process.env.REACT_API_HOST;
      axios.defaults.withCredentials = true;
      const response = await axios.get(`${API_ROOT}/api/v1/paints`);
      setPaints(response.data.data);
    } catch (error) {
      console.error('Error fetching paints:', error);
    }
  };
  useEffect(() => {
    fetchPaints();
  }, []);

  const handleUpdateClick = (paint) => {
    setSelectedPaint(paint);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setQuantity('');
  };

  const handleUpdateQuantity = async () => {
    if (Number(quantity) <= 0 || isNaN(Number(quantity))) {
      alert('Quantity must be a positive number');
      return;
    }

    try {
      const API_ROOT = process.env.REACT_API_HOST;
      axios.defaults.withCredentials = true;
      const response = await axios.post(`${API_ROOT}/api/v1/paints/update-stock-all`, {
        newQuantity: Number(quantity),
        paintId:selectedPaint._id
      });
      notificationHook.showNotification('Paint Stock update successful', {
        type: ToastType.Success,
      });
      console.log('Update successful:', response.data);
      setShowModal(false);
      setQuantity('');
      // Refresh paints list
      fetchPaints()
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  return (
    <div className="container">
      <h2>Paint Inventory</h2>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Color</th>
            <th scope="col">Quantity</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paints.map(paint => (
            <tr key={paint._id}>
              <td>{paint.color}</td>
              <td>{paint.quantity.length > 0 ? paint.quantity[0].quantity : 0}</td>
              <td>
                <button className="btn btn-primary" onClick={() => handleUpdateClick(paint)}>Update</button>
                <button className="btn btn-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={showModal}
        onRequestClose={handleCloseModal}
        contentLabel="Update Quantity Modal"
      >
        <h2>Update Quantity</h2>
        <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        <button onClick={handleUpdateQuantity}>Update</button>
        <button onClick={handleCloseModal}>Cancel</button>
      </Modal>
    </div>
  );
};

export default PaintInventory;
