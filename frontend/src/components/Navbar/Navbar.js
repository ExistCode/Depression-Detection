import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {FaStethoscope, FaBook, FaCode, FaShieldAlt, FaEnvelope, FaLock, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { useAuth } from '../../features/auth/contexts/AuthContext'; 
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  // Protected route navbar content
  const renderProtectedNav = () => (
    <div className="navbar-user">
      <div className="user-info">
        <FaUser className="user-icon" />
        <span className="user-email">{user?.email}</span>
      </div>
      <button 
        onClick={handleLogout} 
        className="logout-button"
      >
        <FaSignOutAlt /> <span>Sign Out</span>
      </button>
    </div>
  );

  // Public route navbar content
  const renderPublicNav = () => (
    <div className="navbar-links">
              <Link to="/diagnosis" className="nav-link">
                <FaStethoscope /> <span>Detection</span>
              </Link>
              <Link to="/methodology" className="nav-link">
                <FaBook /> <span>Methodology</span>
              </Link>
              <Link to="/explainable-ai" className="nav-link">
                <FaShieldAlt /> <span>XAI</span>
              </Link>
              <Link to="/api-docs" className="nav-link">
                <FaCode /> <span>API</span>
              </Link>
              <div className="nav-divider"></div>
              <Link to="/contact" className="nav-link">
                <FaEnvelope /> <span>Contact</span>
              </Link>
              <Link to="/gdpr" className="nav-link">
                <FaLock /> <span>Privacy</span>
              </Link>
            </div>
  );

  if (location.pathname === '/' || location.pathname === '/api-docs') {
    return null;
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            D.A.R.W.I.N
          </Link>
          
          {location.pathname.match(/\/(diagnosis|results)/) 
            ? renderProtectedNav() 
            : renderPublicNav()
          }
        </div>
      </nav>
      <div className="navbar-spacer"></div>
    </>
  );
};



export default Navbar;