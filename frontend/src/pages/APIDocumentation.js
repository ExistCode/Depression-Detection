// pages/APIDocumentation.js
import React, { useState } from 'react';
import { FaCode, FaBook, FaKey, FaCopy, FaArrowLeft, FaRocket, FaBell } from 'react-icons/fa';
import './APIDocumentation.css';
import { useNavigate } from 'react-router-dom';

const APIDocumentation = () => {
  const [activeTab, setActiveTab] = useState('introduction');
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  return (
    <div className="api-container">
      <div className="coming-soon-banner">
        <FaRocket className="banner-icon" />
        <span>Developer API access coming soon! Join the waitlist for early access.</span>
        <button className="waitlist-button">Join Waitlist</button>
      </div>
      
      <button className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>
      
      <aside className="api-sidebar">
        <div className="sidebar-header">
          <h3>DARWIN API</h3>
          <p>v1.0.0 <span className="beta-tag">BETA</span></p>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'introduction' ? 'active' : ''}`}
            onClick={() => setActiveTab('introduction')}
          >
            Introduction
          </button>
          <button 
            className={`nav-item ${activeTab === 'authentication' ? 'active' : ''}`}
            onClick={() => setActiveTab('authentication')}
          >
            Authentication
          </button>
          <button 
            className={`nav-item ${activeTab === 'endpoints' ? 'active' : ''}`}
            onClick={() => setActiveTab('endpoints')}
          >
            Endpoints
          </button>
          <button 
            className={`nav-item ${activeTab === 'examples' ? 'active' : ''}`}
            onClick={() => setActiveTab('examples')}
          >
            Code Examples
          </button>
        </nav>
        
        <div className="sidebar-footer">
          <div className="preview-note">
            <FaBell className="note-icon" />
            <p>This is a preview of our upcoming API documentation.</p>
          </div>
        </div>
      </aside>

      <main className="api-content">
        <div className="content-header">
          <div className="api-key-section">
            <div className="api-key-label">Your API Key (Coming Soon)</div>
            <input 
              type="text" 
              value="••••••••••••••••••••••••••••••" 
              readOnly 
              disabled
            />
            <button 
              onClick={() => copyToClipboard("YOUR_API_KEY_WILL_APPEAR_HERE")}
              className="copy-button"
              disabled
            >
              <FaCopy />
            </button>
          </div>
          {showNotification && (
            <div className="copy-notification">Copied to clipboard!</div>
          )}
        </div>

        <div className="content-body">
          {activeTab === 'introduction' && (
            <section className="intro-section">
              <h2>Introduction to DARWIN API</h2>
              <div className="intro-card">
                <p>
                  The DARWIN API provides developers with access to our advanced depression detection algorithms 
                  powered by EEG analysis and machine learning. Integrate our technology into your healthcare 
                  applications, research tools, or clinical systems.
                </p>
                <div className="feature-list">
                  <div className="feature-item">
                    <span className="feature-icon">🧠</span>
                    <div className="feature-text">
                      <h4>Advanced EEG Analysis</h4>
                      <p>Process EEG data through our neural networks trained on extensive clinical datasets</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">⚡</span>
                    <div className="feature-text">
                      <h4>Fast Processing</h4>
                      <p>Get results within minutes, no matter the size of your EEG files</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">📊</span>
                    <div className="feature-text">
                      <h4>Explainable AI</h4>
                      <p>Receive detailed visualizations explaining the factors behind each analysis</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="coming-soon-card">
                <h3>Developer Access Coming Soon</h3>
                <p>
                  We're currently finalizing our API for public release. Join our waitlist to be among the first 
                  developers to integrate DARWIN's depression detection capabilities into your applications.
                </p>
                <button className="waitlist-button large">Join Developer Waitlist</button>
              </div>
            </section>
          )}
          
          {activeTab === 'endpoints' && (
            <section className="endpoint-section">
              <h2>API Endpoints</h2>
              
              <div className="endpoint-card">
                <div className="endpoint-header">
                  <span className="method post">POST</span>
                  <code>/api/eeg-analysis</code>
                </div>
                <div className="endpoint-body">
                  <div className="endpoint-description">
                    <h3>Analyze EEG Data</h3>
                    <p>
                      Submit an EEG file for depression analysis. The file should be in EDF format and 
                      accessible via a public URL.
                    </p>
                  </div>
                  
                  <h4>Request Format</h4>
                  <pre className="code-block">
{`// Request Body
{
  "file_url": "https://storage.example.com/path/to/eeg_file.edf"
}`}
                  </pre>
                  
                  <h4>Response Format</h4>
                  <pre className="code-block">
{`// Response (200 OK)
{
  "status": "success",
  "prediction": 0.6472599506378174,
  "lime_plot": "https://storage.googleapis.com/bucket/xai_images/lime_plot.png",
  "analysis_report": "The EEG features listed refer to electrical activity in different regions..."
}`}
                  </pre>
                </div>
              </div>

              <div className="endpoint-card">
                <div className="coming-soon-tag">Coming Soon</div>
                <div className="endpoint-header">
                  <span className="method get">GET</span>
                  <code>/api/analysis/{'{analysis_id}'}</code>
                </div>
                <div className="endpoint-body">
                  <div className="endpoint-description">
                    <h3>Retrieve Analysis Results</h3>
                    <p>
                      Get the results of a previously submitted analysis by its ID.
                    </p>
                  </div>
                  
                  <h4>Response Format</h4>
                  <pre className="code-block">
{`// Response (200 OK)
{
  "status": "completed",
  "results": {
    "depression_probability": 0.85,
    "confidence_score": 0.92,
    "visualizations": {
      "lime_plot": "https://..."
    }
  }
}`}
                  </pre>
                </div>
              </div>
            </section>
          )}
          
          {activeTab === 'examples' && (
            <section className="examples-section">
              <h2>Code Examples</h2>
              
              <div className="example-card">
                <h3>JavaScript/Node.js</h3>
                <pre className="code-block">
{`// Using fetch API
async function analyzeEEG(fileUrl) {
  try {
    const response = await fetch('https://depression-detection-488265660887.us-central1.run.app/api/eeg-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file_url: fileUrl
      })
    });

    if (!response.ok) {
      throw new Error(\`API request failed with status \${response.status}\`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}`}
                </pre>
              </div>
              
              <div className="example-card">
                <h3>Python</h3>
                <pre className="code-block">
{`import requests
import json

def analyze_eeg(file_url):
    url = "https://depression-detection-488265660887.us-central1.run.app/api/eeg-analysis"
    
    payload = {
        "file_url": file_url
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, headers=headers, data=json.dumps(payload))
    
    if response.status_code != 200:
        raise Exception(f"API request failed with status {response.status_code}")
        
    return response.json()`}
                </pre>
              </div>
            </section>
          )}
          
          {activeTab === 'authentication' && (
            <section className="auth-section">
              <h2>Authentication</h2>
              
              <div className="auth-card">
                <div className="coming-soon-tag">Coming Soon</div>
                <h3>API Keys</h3>
                <p>
                  When our API is publicly released, you'll need to authenticate your requests using API keys. 
                  Each request will require an API key to be included in the request headers.
                </p>
                
                <h4>Authentication Header Example</h4>
                <pre className="code-block">
{`// Include in all API requests
headers: {
  'Content-Type': 'application/json',
  'X-API-Key': 'YOUR_API_KEY'
}`}
                </pre>
                
                <div className="pricing-preview">
                  <h4>Planned Pricing Tiers</h4>
                  <div className="pricing-tiers">
                    <div className="pricing-tier">
                      <h5>Free Tier</h5>
                      <ul>
                        <li>50 analyses per month</li>
                        <li>Basic reporting</li>
                        <li>Community support</li>
                      </ul>
                    </div>
                    <div className="pricing-tier">
                      <h5>Professional</h5>
                      <ul>
                        <li>500 analyses per month</li>
                        <li>Advanced reporting</li>
                        <li>Email support</li>
                      </ul>
                    </div>
                    <div className="pricing-tier">
                      <h5>Enterprise</h5>
                      <ul>
                        <li>Unlimited analyses</li>
                        <li>Custom integration</li>
                        <li>Dedicated support</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default APIDocumentation;
