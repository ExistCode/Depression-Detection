import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-text">
          Developed for Capstone Project • Taylor's University 2024-2025
        </div>
        <div className="footer-links">
          <Link to="/contact">Contact</Link>
          <span className="divider">•</span>
          <Link to="/gdpr">GDPR Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;