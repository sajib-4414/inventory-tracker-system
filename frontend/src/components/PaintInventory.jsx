import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { ToastType, useNotification } from '../contexts/NotificationContext';
import { Link } from 'react-router-dom';
import { server_url } from '../App';

Modal.setAppElement('#root');

const PaintInventory = () => {
  const [paints, setPaints] = useState([]);
  const [selectedPaint, setSelectedPaint] = useState(null);
  const [quantity, setQuantity] = useState('');
  const notificationHook = useNotification();
  const [showModal, setShowModal] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  
  const isAdminOrCoordinator = user && (user.type === 'admin' || user.type === 'supply_coordinator');
  const isPainter = user && (user.type === 'painter');

  const fetchPaints = async () => {
    try {
      const API_ROOT = server_url//process.env.REACT_APP_API_HOST;
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

  const handleDeleteClick = async (paint) => {
    try{
      const API_ROOT = server_url//process.env.REACT_APP_API_HOST;
      axios.defaults.withCredentials = true;
      const response = await axios.delete(`${API_ROOT}/api/v1/paints/${paint._id}`);
      notificationHook.showNotification('Paint deleted', {
        type: ToastType.Info,
      });
      fetchPaints()
    } catch(err){
      console.log(err)
    }
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
      const API_ROOT = server_url//process.env.REACT_APP_API_HOST;
      axios.defaults.withCredentials = true;
      let endpoint = ""
      if (isPainter)
        endpoint =`${API_ROOT}/api/v1/paints/update-stock-assigned`
      else if (isAdminOrCoordinator)
        endpoint =`${API_ROOT}/api/v1/paints/update-stock-all`
      const response = await axios.post(endpoint, {
        newQuantity: Number(quantity),
        paintId:selectedPaint._id
      });
      notificationHook.showNotification('Paint Stock update successful', {
        type: ToastType.Success,
      });
      setShowModal(false);
      setQuantity('');
      fetchPaints()
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  return (
    <div className="container">
      {isAdminOrCoordinator && (
        <div className="container text-center">
          <Link to="/create-paint" className="btn btn-primary mb-1" style={{ width: '300px' }}>Create Paint</Link>
        </div>
      )}
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
                {(isAdminOrCoordinator|| isPainter) && (
                  <>
                    <button className="btn btn-primary" onClick={() => handleUpdateClick(paint)}>Update</button>
                  </>
                )}
                {isAdminOrCoordinator && (
                  <>
                    <button className="btn btn-danger" onClick={() => handleDeleteClick(paint)}>Delete</button>
                  </>
                )}
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
