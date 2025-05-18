// pages/Results/ResultsScreen.js
import React from 'react';
import { FaUser, FaChartLine, FaBrain, FaFileAlt } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import './ResultsScreen.css';
import { Navigate } from 'react-router-dom';
import PDFGenerator from './components/PDFGenerator'

const ResultsScreen = () => {
  const location = useLocation();
  const { patientData, fileData, analysisResult } = location.state || {};

  // Redirect if no data is present
  if (!patientData || !fileData || !analysisResult) {
    return <Navigate to="/diagnosis" replace />;
  }

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Adjust age if birthday hasn't occurred this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const formattedPatientData = {
    name: `${patientData.firstName} ${patientData.lastName}`,
    age: calculateAge(patientData.dateOfBirth),
    gender: patientData.gender,
    dateOfAnalysis: new Date().toISOString().split('T')[0],
    eegCondition: patientData.eegCondition,
    recordingDate: patientData.recordingDate,
    fileName: fileData?.originalName || 'N/A'
  };

  // Format the result data from the API response
  const result = {
    depressionProbability: analysisResult.prediction,
    modelAccuracy: 0.998, // This seems to be hardcoded in your original code
    severity: analysisResult.prediction < 0.3 ? "Mild" : 
              analysisResult.prediction < 0.7 ? "Moderate" : "Severe",
    interpretation: analysisResult.analysis_report,
    limePlotUrl: analysisResult.lime_plot
  };

  const renderDownloadButton = () => (
    <PDFGenerator patientData={formattedPatientData} result={result} />
  );

  return (
    <div className="results-container">
      <div className="results-header">
        <h1>Analysis Results</h1>
        {renderDownloadButton()}
      </div>

      <div className="results-grid">
        {/* Patient Overview Card */}
        <div className="result-card patient-card">
          <div className="card-header">
            <FaUser />
            <h2>Patient Overview</h2>
          </div>
          <div className="patient-info">
            <div className="info-item">
              <label>Name:</label>
              <span>{formattedPatientData.name}</span>
            </div>
            <div className="info-item">
              <label>Age:</label>
              <span>{formattedPatientData.age}</span>
            </div>
            <div className="info-item">
              <label>Gender:</label>
              <span>{formattedPatientData.gender}</span>
            </div>
            <div className="info-item">
              <label>Analysis Date:</label>
              <span>{formattedPatientData.dateOfAnalysis}</span>
            </div>
            <div className="info-item">
              <label>EEG Recording State:</label>
              <span>{formattedPatientData.eegCondition}</span>
            </div>
            <div className="info-item">
              <label>EEG Recording Date:</label>
              <span>{formattedPatientData.recordingDate}</span>
            </div>
          </div>
        </div>

        {/* Depression Score Card */}
        <div className="result-card score-card">
          <div className="card-header">
            <FaChartLine />
            <h2>Depression Analysis</h2>
          </div>
          <div className="score-display">
            <div className="score-circle" style={{
              background: `conic-gradient(
                var(--primary-dark) ${result.depressionProbability * 360}deg,
                var(--primary-lighter) 0deg
              )`
            }}>
              <div className="score-inner">
                <span className="score-value">{(result.depressionProbability * 100).toFixed(0)}%</span>
                <span className="score-label">Depression<br></br>Probability</span>
              </div>
            </div>
            <div className="score-details">
              <div className="detail-item">
                <label>Model Accuracy:</label>
                <span>{(result.modelAccuracy * 100).toFixed(1)}%</span>
              </div>
              <div className="detail-item">
                <label>Severity Level:</label>
                <span className="severity-tag">{result.severity}</span>
              </div>
            </div>
          </div>
        </div>

        {/* NeuroXAI Visualization Card */}
        <div className="result-card xai-card">
          <div className="card-header">
            <FaBrain />
            <h2>XAI Analysis</h2>
          </div>
          <div className="xai-content">
            <div className="neuroxai-plot">
              <img 
                src={result.limePlotUrl}
                alt="NeuroXAI visualization showing channel contributions"
                className="neuroxai-image"
              />
              <div className="plot-description">
                <h3>Understanding the Visualization</h3>
                <p>
                  This visualization shows the top 10 EEG channels and their temporal contributions to the depression detection. The x-axis represents time in milliseconds, while the y-axis shows different EEG channels. <span className="highlight positive">Green regions (positive values)</span> indicate brain activity patterns that contribute towards a depression diagnosis, while <span className="highlight negative">red regions (negative values)</span> represent patterns that contribute against a depression diagnosis. The length of each bar indicates the strength of that channel's contribution at that specific time point. 
                </p>
              </div>
            </div>
          </div>
        </div>


        {/* Interpretation Card */}
        <div className="result-card interpretation-card">
          <div className="card-header">
            <FaFileAlt />
            <h2>Analysis Interpretation</h2>
          </div>
          <div className="interpretation-content">
            <p>{result.interpretation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
