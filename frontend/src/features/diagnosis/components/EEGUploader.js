// src/components/EEGUploader/EEGUploader.js
import React, { useState } from 'react';
import { FaUpload } from 'react-icons/fa';

const EEGUploader = ({ onFileSelect }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileUpload = (files) => {
    const file = files[0];
    if (file) {
      if (file.name.toLowerCase().endsWith('.edf')) {
        setSelectedFile(file);
        onFileSelect([file]); // Pass as array to match original handler
      } else {
        setSelectedFile(null);
        alert('Please upload a valid EEG file (.edf format)');
      }
    }
  };

  return (
    <div 
      className={`file-upload-area ${dragActive ? 'drag-active' : ''}`}
      onDragEnter={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setDragActive(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDragActive(false);
        handleFileUpload(e.dataTransfer.files);
      }}
      onDragOver={(e) => e.preventDefault()}
    >
      <input
        type="file"
        id="eeg-file"
        accept=".edf"
        onChange={(e) => handleFileUpload(e.target.files)}
        className="file-input"
      />
      <label htmlFor="eeg-file" className="file-label">
        <FaUpload />
        <span>Drag & drop EEG file or click to upload</span>
        <span className="file-format">Supported format: .edf</span>
      </label>
      {selectedFile && (
        <div className="file-info">
          <span>Selected file: {selectedFile.name}</span>
        </div>
      )}
    </div>
  );
};

export default EEGUploader;