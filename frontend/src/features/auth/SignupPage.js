import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaStethoscope } from 'react-icons/fa';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import './Auth.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    license: '',
    specialization: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password should be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;
    setLoading(true);

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );

      // Store additional user data in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        fullName: formData.fullName,
        email: formData.email,
        license: formData.license,
        specialization: formData.specialization,
        createdAt: new Date().toISOString(),
        role: 'healthcare_professional'
      });

      navigate('/diagnosis');
    } catch (error) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('Email already registered');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        default:
          setError('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <FaStethoscope className="auth-icon" />
          <h1>Create Account</h1>
          <p>Join our healthcare professional network</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              placeholder="Professional Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Medical License Number"
              value={formData.license}
              onChange={(e) => setFormData({...formData, license: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <select
              value={formData.specialization}
              onChange={(e) => setFormData({...formData, specialization: e.target.value})}
              required
            >
              <option value="">Select Specialization</option>
              <option value="neurologist">Neurologist</option>
              <option value="psychiatrist">Psychiatrist</option>
              <option value="general">General Practitioner</option>
            </select>
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              required
            />
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-redirect">
          <p>Already have an account?</p>
          <Link to="/login" className="redirect-link">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;