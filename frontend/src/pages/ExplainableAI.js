import React from 'react';
import { FaBrain, FaChartLine, FaRobot, FaSearchPlus } from 'react-icons/fa';
import './ExplainableAI.css';

const ExplainableAI = () => {
  return (
    <div className="xai-container">
      <section className="xai-hero">
        <div className="hero-content">
          <h1>Explainable AI in DARWIN</h1>
          <div className="tags">
            <span className="tag">Transparency</span>
            <span className="tag">Interpretability</span>
            <span className="tag">Clinical Trust</span>
          </div>
          <p className="subtitle">
            Understanding how our AI system detects depression through EEG analysis
          </p>
        </div>
      </section>

      <section className="methodology-section">
        <h2>Our XAI Methodology</h2>
        <p className="methodology-text">
          DARWIN employs a comprehensive three-layer XAI approach to ensure transparency and build trust in our depression detection system. By combining LIME for local explanations, NeuroXAI for feature importance visualization, and OpenAI for natural language interpretation, we provide clinicians with clear insights into the decision-making process.
        </p>
      </section>

      <div className="xai-grid">
        <div className="xai-card mint">
          <div className="card-content">
            <h3>NeuroXAI Feature Importance</h3>
            <p>Visualizes the top 10 EEG channels and their temporal contributions to depression detection. Green regions indicate patterns supporting depression diagnosis, while red regions show patterns against it.</p>
            <div className="icon-container">
              <FaBrain />
            </div>
          </div>
        </div>

        <div className="xai-card yellow">
          <div className="card-content">
            <h3>LIME Local Explanations</h3>
            <p>Provides detailed insights into how specific EEG patterns and channel activities contribute to individual predictions, making the model's decisions transparent and interpretable.</p>
            <div className="icon-container">
              <FaSearchPlus />
            </div>
          </div>
        </div>

        <div className="xai-card pink">
          <div className="card-content">
            <h3>OpenAI Interpretation</h3>
            <p>Translates complex EEG analysis into clear, clinically relevant explanations, helping both healthcare professionals and patients understand the results.</p>
            <div className="icon-container">
              <FaRobot />
            </div>
          </div>
        </div>

        <div className="xai-card blue">
          <div className="card-content">
            <h3>Model Performance</h3>
            <p>Achieves 99.8% accuracy with comprehensive validation metrics, ensuring reliable and trustworthy depression detection results.</p>
            <div className="icon-container">
              <FaChartLine />
            </div>
          </div>
        </div>
      </div>

      <section className="explanation-section">
        <h2>Technical Implementation</h2>
        <div className="explanation-grid">
          <div className="explanation-item">
            <h3>Channel Analysis</h3>
            <p>Our NeuroXAI visualization highlights specific EEG channels and timepoints that contribute most significantly to the depression detection, providing temporal insights into brain activity patterns.</p>
          </div>
          <div className="explanation-item">
            <h3>Weight Interpretation</h3>
            <p>Positive weights (green) indicate EEG patterns that support a depression diagnosis, while negative weights (red) represent patterns more commonly found in non-depressed individuals.</p>
          </div>
          <div className="explanation-item">
            <h3>Clinical Integration</h3>
            <p>OpenAI processes the technical analysis into clear, medical explanations that align with clinical understanding and practice.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExplainableAI;
