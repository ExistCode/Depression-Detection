// pages/GDPRPolicy.js
import React from 'react';
import { FaShieldAlt, FaUserLock, FaDatabase, FaFileAlt } from 'react-icons/fa';
import './GDPR.css';

const GDPRPolicy = () => {
  return (
    <div className="gdpr-container">
      <section className="gdpr-hero">
        <div className="hero-content">
          <FaShieldAlt className="hero-icon" />
          <h1>GDPR Compliance</h1>
          <p>Your Privacy and Data Protection Rights</p>
        </div>
      </section>

      <div className="policy-grid">
        <div className="policy-card">
          <div className="card-icon">
            <FaUserLock />
          </div>
          <h3>Data Protection</h3>
          <p>We implement robust security measures to protect your EEG data and personal information.</p>
          <ul className="policy-list">
            <li>End-to-end encryption</li>
            <li>Secure data storage</li>
            <li>Access control protocols</li>
          </ul>
        </div>

        <div className="policy-card">
          <div className="card-icon">
            <FaDatabase />
          </div>
          <h3>Data Processing</h3>
          <p>Your rights regarding your personal data:</p>
          <ul className="policy-list">
            <li>Right to access</li>
            <li>Right to rectification</li>
            <li>Right to erasure</li>
            <li>Right to data portability</li>
          </ul>
        </div>

        <div className="policy-card">
          <div className="card-icon">
            <FaFileAlt />
          </div>
          <h3>Consent Management</h3>
          <p>Control over your data:</p>
          <ul className="policy-list">
            <li>Transparent processing</li>
            <li>Consent withdrawal</li>
            <li>Data usage preferences</li>
          </ul>
        </div>
      </div>

      <section className="detailed-policy">
        <h2>Our Commitment to Privacy</h2>
        <div className="policy-section">
          <h3>Data Collection</h3>
          <p>We collect and process the following types of data:</p>
          <ul>
            <li>EEG recordings</li>
            <li>Basic personal information</li>
            <li>Medical history (when provided)</li>
          </ul>
        </div>

        <div className="policy-section">
          <h3>Contact Information</h3>
          <div className="contact-box">
            <p>For any privacy-related queries, contact our Data Protection Officer:</p>
            <a href="mailto:dpo@darwin-eeg.com" className="contact-button">
              Contact DPO
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GDPRPolicy;