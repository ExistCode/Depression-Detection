import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaUserMd, FaTimes } from 'react-icons/fa';
import './AuthModal.css';

// components/AuthModal/AuthModal.js
const AuthModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  // Handle click outside
  const handleOverlayClick = (e) => {
    // Only close if clicking the overlay, not the modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={handleOverlayClick} // Add click handler to overlay
    >
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <FaTimes />
        </button>
        
        <div className="modal-icon">
          <FaUserMd />
        </div>
        
        <h2>Healthcare Professionals Only</h2>
        
        <div className="modal-body">
          <FaLock className="lock-icon" />
          <p>You need to be logged in as a healthcare professional to access this feature.</p>
          <p className="modal-subtitle">Please log in or register to continue.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;