// services/eegUploadService.js
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

export const uploadEEGFile = (file, onProgress) => {
  return new Promise((resolve, reject) => {
    // Validate file
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.edf')) {
      reject(new Error('Invalid file type. Please upload an EDF file'));
      return;
    }

    // Validate file size (10MB limit)
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      reject(new Error('File size exceeds 10MB limit'));
      return;
    }

    // Create metadata
    const metadata = {
      contentType: 'application/x-edf',  // Correct MIME type for EDF files
      customMetadata: {
        'fileType': 'edf',
        'originalName': file.name,
        'uploadTime': new Date().toISOString(),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      }
    };

    // Create storage reference with unique filename
    const fileName = `eeg_data/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, fileName);
    
    // Start upload
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload progress:', progress);
        onProgress?.(progress);
      },
      (error) => {
        console.error('Upload error:', error);
        reject(error);
      },
      // In the uploadEEGFile function, modify the resolve block:
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            url: downloadURL,
            fileName: fileName,
            originalName: file.name,
            size: file.size,
            uploadTime: new Date().toISOString()
          });
        } catch (error) {
          console.error('Get download URL error:', error);
          reject(error);
        }
      }
    );
  });
};