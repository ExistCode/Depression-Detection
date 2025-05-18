import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaBrain, FaChartLine, FaStethoscope } from 'react-icons/fa';
import Typewriter from 'typewriter-effect';

import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <div className="brand-name">
              <div className="title-container">
                <h1>Welcome to</h1>
                <div className="darwin-text">
                  <Typewriter
                    options={{
                      strings: ['D.A.R.W.I.N'],
                      autoStart: true,
                      loop: true,
                      delay: 150,
                      pauseFor: 7000,
                      deleteSpeed: 100,
                      cursor: '|'
                    }}
                  />
                </div>
              </div>
              <p className="system-name">
                Depression Analysis and Recognition With Intelligent Networks
              </p>
            </div>
            <div className="hero-features">
              <span className="feature-tag">
                <FaBrain /> EEG Analysis
              </span>
              <span className="feature-tag">
                <FaChartLine /> Depression Detection
              </span>
              <span className="feature-tag">
                <FaStethoscope /> Early Medical Screening
              </span>
            </div>
            <button className="cta-button" onClick={() => navigate('/diagnosis')}>
              Start Detection <FaArrowRight className="arrow-icon" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div 
          className="feature-card mint"
          onClick={() => navigate('/diagnosis')}
        >
          <div className="feature-content">
            <h3>Start Detecting</h3>
            <p>Begin EEG analysis</p>
          </div>
          <button className="arrow-button">
            <FaArrowRight />
          </button>
        </div>

        <div 
          className="feature-card yellow"
          onClick={() => navigate('/methodology')}
        >
          <div className="feature-content">
            <h3>Our Methodology</h3>
            <p>Learn about our approach</p>
          </div>
          <button className="arrow-button">
            <FaArrowRight />
          </button>
        </div>

        <div 
          className="feature-card pink"
          onClick={() => navigate('/explainable-ai')}
        >
          <div className="feature-content">
            <h3>About Our XAI</h3>
            <p>Transparent AI decisions</p>
          </div>
          <button className="arrow-button">
            <FaArrowRight />
          </button>
        </div>

        <div 
          className="feature-card blue"
          onClick={() => navigate('/api-docs')}
        >
          <div className="feature-content">
            <h3>API Documentation</h3>
            <p>Integration guide</p>
          </div>
          <button className="arrow-button">
            <FaArrowRight />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Landing;