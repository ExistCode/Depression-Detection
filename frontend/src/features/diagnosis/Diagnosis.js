import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaUser, FaFileUpload } from 'react-icons/fa';
import './Diagnosis.css';
import AuthModal from '../auth/components/AuthModal';
import useAuthCheck from '../../utils/useAuthCheck';
import EEGUploader from './components/EEGUploader';
import { uploadEEGFile } from '../../utils/eegUploadService';
import { analyzeEEG } from '../../utils/apiService';


const Diagnosis = () => {
  const navigate = useNavigate()
  const [patientData, setPatientData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    eegCondition: '',
    recordingDate: ''
  });

  const [errors, setErrors] = useState({});
  const [eegFile, setEegFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const validateName = (name) => {
    return /^[A-Za-z\s]+$/.test(name) && name.trim().length > 0;
  };

  const validateDate = (date, type) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(selectedDate.getTime())) {
      return { isValid: false, message: 'Please enter a valid date' };
    }

    if (selectedDate > today) {
      return { isValid: false, message: `${type} cannot be in the future` };
    }

    if (type === 'Date of birth') {
      const age = today.getFullYear() - selectedDate.getFullYear();
      if (age > 120) {
        return { isValid: false, message: 'Please enter a valid date of birth' };
      }
    }

    return { isValid: true, message: '' };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newErrors = { ...errors };
    
    // Name validation
    if (name === 'firstName' || name === 'lastName') {
      if (value && !validateName(value)) {
        newErrors[name] = 'Name can only contain letters and spaces';
      } else {
        delete newErrors[name];
      }
    }

    // Date validation
    if (name === 'dateOfBirth' || name === 'recordingDate') {
      const dateType = name === 'dateOfBirth' ? 'Date of birth' : 'Recording date';
      const dateValidation = validateDate(value, dateType);
      
      if (!dateValidation.isValid) {
        newErrors[name] = dateValidation.message;
      } else {
        delete newErrors[name];
      }
    }

    setErrors(newErrors);
    setPatientData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Inside the Diagnosis component
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let formErrors = {};
    
    if (!validateName(patientData.firstName)) {
      formErrors.firstName = 'Please enter a valid first name';
    }
    if (!validateName(patientData.lastName)) {
      formErrors.lastName = 'Please enter a valid last name';
    }

    const birthDateValidation = validateDate(patientData.dateOfBirth, 'Date of birth');
    if (!birthDateValidation.isValid) {
      formErrors.dateOfBirth = birthDateValidation.message;
    }

    const recordingDateValidation = validateDate(patientData.recordingDate, 'Recording date');
    if (!recordingDateValidation.isValid) {
      formErrors.recordingDate = recordingDateValidation.message;
    }

    if (!eegFile) {
      formErrors.file = 'Please select an EEG file';
    }

    if (!patientData.eegCondition) {
      formErrors.eegCondition = 'Please select EEG recording condition';
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      setIsUploading(true);
      const fileData = await uploadEEGFile(eegFile, (progress) => {
        setUploadProgress(progress);
      });
      
      // Navigate to loading screen first with file and patient data
      navigate('/loading', { 
        state: { 
          fileData: fileData,
          patientData: patientData,
          // No analysis result yet
        } 
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Error processing request. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const { showAuthModal, setShowAuthModal, isAuthenticated } = useAuthCheck();

  if (!isAuthenticated) {
    return (
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    );
  }

  return (
    <div className="diagnosis-container">
      <div className="diagnosis-header">
        <h1>EEG Analysis Upload</h1>
        <p>Enter patient details and upload EEG data for depression detection</p>
      </div>

      <form onSubmit={handleSubmit} className="diagnosis-form">
        <div className="form-sections">
          <section className="form-section">
            <h2><FaUser /> Patient Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={patientData.firstName}
                  onChange={handleInputChange}
                  className={errors.firstName ? 'error' : ''}
                  required
                />
                {errors.firstName && <span className="error-message">{errors.firstName}</span>}
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={patientData.lastName}
                  onChange={handleInputChange}
                  className={errors.lastName ? 'error' : ''}
                  required
                />
                {errors.lastName && <span className="error-message">{errors.lastName}</span>}
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select
                  name="gender"
                  value={patientData.gender}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={patientData.dateOfBirth}
                  onChange={handleInputChange}
                  className={errors.dateOfBirth ? 'error' : ''}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
                {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
              </div>
            </div>
          </section>

          <section className="form-section">
            <h2><FaFileUpload /> EEG Data Upload</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Recording Condition</label>
                <select
                  name="eegCondition"
                  value={patientData.eegCondition}
                  onChange={handleInputChange}
                  className={errors.eegCondition ? 'error' : ''}
                  required
                >
                  <option value="">Select Recording Condition</option>
                  <option value="Resting, Eyes-Closed">Resting State - Eyes Closed</option>
                  <option value="Resting, Eyes-Opened">Resting State - Eyes Open</option>
                  <option value="Task-based">Task-based Recording</option>
                </select>
                {errors.eegCondition && <span className="error-message">{errors.eegCondition}</span>}
              </div>
              <div className="form-group">
                <label>Recording Date</label>
                <input
                  type="date"
                  name="recordingDate"
                  value={patientData.recordingDate}
                  onChange={handleInputChange}
                  className={errors.recordingDate ? 'error' : ''}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
                {errors.recordingDate && <span className="error-message">{errors.recordingDate}</span>}
              </div>
              <div className="form-group full-width">
                <EEGUploader onFileSelect={(files) => setEegFile(files[0])} />
                {errors.file && <span className="error-message">{errors.file}</span>}
              </div>
            </div>
          </section>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="secondary-button"
              disabled={isUploading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="primary-button"
              disabled={isUploading || !eegFile}
            >
              {isUploading ? `Uploading... ${uploadProgress.toFixed(0)}%` : 'Analyze EEG Data'}
            </button>
          </div>

          {isUploading && (
            <div className="upload-progress-overlay">
              <div className="upload-progress-content">
                <div className="upload-progress-bar">
                  <div 
                    className="progress" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p>Uploading EEG Data: {uploadProgress.toFixed(0)}%</p>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default Diagnosis;
