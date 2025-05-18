// components/LoadingScreen/LoadingScreen.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaBrain, FaSpinner } from 'react-icons/fa';
import { analyzeEEG } from '../../utils/apiService';
import './LoadingScreen.css';

const LoadingScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { patientData, fileData } = location.state || {};
  
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState(null);
  const [factIndex, setFactIndex] = useState(0);

  const eegFacts = [
    "EEG can detect changes in brain activity in milliseconds, making it one of the fastest neuroimaging techniques available.",
    "An EEG records the electrical activity of your brain through electrodes placed on your scalp.",
    "During an EEG, your brain is constantly producing electrical signals, even when you're asleep.",
    "EEG is used to diagnose conditions like epilepsy, sleep disorders, and can help assess brain activity patterns.",
    "The first human EEG was recorded in 1924 by German psychiatrist Hans Berger.",
    "EEG is painless - the electrodes only detect signals and don't transmit any sensation to your scalp.",
    "Your brain cells communicate via electrical impulses, which appear as wavy lines on an EEG recording.",
    "EEG can help confirm brain death in someone in a coma or determine the right level of anesthesia.",
    "Brain waves are categorized by frequency: delta (0.5-4 Hz), theta (4-7 Hz), alpha (8-13 Hz), and beta (13-30 Hz).",
    "The electrolyte gel used in EEG studies is sometimes nicknamed 'salty jello' by researchers.",
    "Modern EEG systems can collect up to 1000 samples per second across multiple channels.",
    "EEG can detect abnormal patterns that may indicate seizures, even when a person isn't visibly having one."
  ];

  useEffect(() => {
    if (!patientData || !fileData) {
      navigate('/diagnosis', { replace: true });
      return;
    }

    // Start elapsed time counter
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    // Rotate through EEG facts every 15 seconds
    const factTimer = setInterval(() => {
      setFactIndex(prev => (prev + 1) % eegFacts.length);
    }, 22000);

    // Make the API call
    const processEEG = async () => {
      try {
        // Call the API with the file URL
        const analysisResult = await analyzeEEG(fileData.url);
        
        // Navigate to results with all data
        navigate('/results', { 
          state: { 
            patientData,
            fileData,
            analysisResult
          }
        });
      } catch (error) {
        console.error('API Error:', error);
        setError('An error occurred during analysis. Please try again.');
        setIsProcessing(false);
      }
    };

    processEEG();

    // Cleanup timers
    return () => {
      clearInterval(timer);
      clearInterval(factTimer);
    };
  }, [navigate, patientData, fileData, eegFacts.length]);

  // Format elapsed time as mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="loading-overlay">
      <div className="loading-card">
        <div className="loading-content">
          <div className="brain-icon">
            <FaBrain />
          </div>
          
          <div className="wave-container">
            <div className="wave-animation">
              <div className="wave wave1"></div>
              <div className="wave wave2"></div>
              <div className="wave wave3"></div>
            </div>
          </div>

          <h2>Analyzing Brain Patterns</h2>
          
          <div className="time-display">
            <div className="elapsed-time-label">Processing Time</div>
            <div className="elapsed-time-value">{formatTime(elapsedTime)}</div>
          </div>

          {error ? (
            <div className="error-message">
              <p>{error}</p>
              <button 
                className="retry-button"
                onClick={() => navigate('/diagnosis')}
              >
                Return to Diagnosis
              </button>
            </div>
          ) : (
            <>
              <div className="loading-info">
                <p>DARWIN's neural network is carefully analyzing the EEG data patterns. This typically takes 2-3 minutes to complete.</p>
                <p className="warning-text">Please don't close this window during processing.</p>
              </div>
              
              <div className="eeg-fact-container">
                <div className="eeg-fact-title">Did you know?</div>
                <p className="eeg-fact">{eegFacts[factIndex]}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
