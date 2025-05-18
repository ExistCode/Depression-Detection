// components/PDFGenerator.js
import React, { useState, useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { FaDownload } from 'react-icons/fa';
import Reports from '../../reports/Reports';
import fallbackImage from '../../../assets/xai-plots/xai_plot_1.png'; // Fallback image

const PDFGenerator = ({ patientData, result }) => {
  const [imageBase64, setImageBase64] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(result.limePlotUrl);
        const blob = await response.blob();
        
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageBase64(reader.result);
          setIsLoading(false);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("Error fetching image:", error);
        setIsLoading(false);
      }
    };
    
    fetchImage();
  }, [result.limePlotUrl]);

  if (isLoading) {
    return (
      <button className="download-button" disabled>
        <FaDownload /> Preparing PDF...
      </button>
    );
  }

  // Create a modified result object with the base64 image
  const pdfResult = {
    ...result,
    limePlotUrl: imageBase64 || fallbackImage
  };

  return (
    <PDFDownloadLink
      document={<Reports patientData={patientData} result={pdfResult} />}
      fileName={`DARWIN_Report_${patientData.name.replace(' ', '_')}.pdf`}
    >
      {({ blob, url, loading, error }) => (
        <button 
          className="download-button" 
          disabled={loading}
        >
          <FaDownload /> 
          {loading ? 'Generating PDF...' : 'Generate PDF Report'}
        </button>
      )}
    </PDFDownloadLink>
  );
};

export default PDFGenerator;
