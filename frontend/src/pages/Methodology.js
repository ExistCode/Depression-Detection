import React from 'react';
import './Methodology.css';

const Methodology = () => {
  return (
    <div className="methodology-container">
      <div className="methodology-header">
        <h1>Our Methodology</h1>
        <p className="header-subtitle">Understanding DARWIN's Advanced Deep Learning Approach to Depression Detection</p>
      </div>

      <div className="methodology-content">
        <section className="content-section">
          <h2>Overview</h2>
          <p>
            DARWIN (Depression Analysis and Recognition With Intelligent Networks) employs a sophisticated hybrid deep learning architecture combining 2D CNN and LSTM networks to analyze EEG (Electroencephalogram) data for accurate depression detection. Our approach integrates clinical expertise with state-of-the-art AI technology to provide highly accurate and interpretable results.
          </p>
        </section>

        <section className="content-section">
          <h2>Dataset and EEG Analysis</h2>
          <div className="methodology-card">
            <h3>Wajid Mumtaz Dataset</h3>
            <p>
              Our system is trained and validated on the comprehensive Wajid Mumtaz EEG dataset, which contains high-quality EEG recordings from both healthy controls and individuals diagnosed with Major Depressive Disorder (MDD). The dataset provides:
            </p>
            <ul>
              <li>Multi-channel EEG recordings</li>
              <li>Standardized recording conditions</li>
              <li>Clinically validated depression diagnoses</li>
              <li>Diverse patient demographics</li>
            </ul>
          </div>
        </section>

        <section className="content-section">
          <h2>Deep Learning Pipeline</h2>
          <div className="process-grid">
            <div className="process-card">
              <div className="process-number">1</div>
              <h3>Data Collection</h3>
              <p>Standardized EEG data acquisition from the Wajid Mumtaz dataset, ensuring consistent recording conditions and clinical validation.</p>
            </div>
            <div className="process-card">
              <div className="process-number">2</div>
              <h3>Preprocessing</h3>
              <p>Comprehensive signal processing pipeline including:
                <ul>
                  <li>Bandpass filtering for noise reduction</li>
                  <li>Bad channel removal</li>
                  <li>Epoching for temporal segmentation</li>
                  <li>Independent Component Analysis (ICA)</li>
                  <li>Baseline correction</li>
                </ul>
              </p>
            </div>
            <div className="process-card">
              <div className="process-number">3</div>
              <h3>Deep Learning Model</h3>
              <p>Hybrid 2D CNN-LSTM architecture:
                <ul>
                  <li>CNN layers for spatial feature extraction</li>
                  <li>LSTM layers for temporal pattern analysis</li>
                  <li>Advanced feature fusion techniques</li>
                </ul>
              </p>
            </div>
            <div className="process-card">
              <div className="process-number">4</div>
              <h3>Analysis & XAI</h3>
              <p>Integration of explainable AI techniques for transparent and interpretable results, highlighting key EEG patterns contributing to the diagnosis.</p>
            </div>
          </div>
        </section>

        <section className="content-section">
          <h2>Technical Specifications</h2>
          <div className="specs-container">
            <div className="methodology-card">
              <h3>Model Architecture</h3>
              <p>
                Our hybrid deep learning model combines:
              </p>
              <ul>
                <li>2D CNN for spatial feature extraction</li>
                <li>LSTM networks for temporal dependency analysis</li>
                <li>Advanced dropout layers for regularization</li>
                <li>Optimized hyperparameters for EEG analysis</li>
              </ul>
            </div>
            <div className="methodology-card">
              <h3>Performance Metrics</h3>
              <p>
                DARWIN achieves exceptional performance metrics:
              </p>
              <ul>
                <li>Accuracy: 99.95%</li>
                <li>Precision: 99.91%</li>
                <li>Recall: 99.99%</li>
                <li>F1-Score: 99.95%</li>
                <li>AUC-ROC: 1.00</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="content-section">
          <h2>Model Interpretability</h2>
          <p>
            Our system integrates advanced explainable AI (XAI) techniques to provide transparent insights into the decision-making process. This helps clinicians understand which EEG patterns and features contribute most significantly to the depression detection, ensuring trust and clinical relevance in the diagnosis process.
          </p>
          <div className="research-highlights">
            <div className="highlight-card">
              <h3>Clinical Integration</h3>
              <p>Seamless integration with existing clinical workflows and EEG analysis protocols.</p>
            </div>
            <div className="highlight-card">
              <h3>Continuous Validation</h3>
              <p>Ongoing performance monitoring and model updates based on clinical feedback and new research findings.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Methodology;
