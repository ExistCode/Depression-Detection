// src/services/apiService.js
const API_BASE_URL = 'https://depression-detection-488265660887.us-central1.run.app';

export const analyzeEEG = async (eegFileUrl) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/eeg-analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file_url: eegFileUrl 
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
