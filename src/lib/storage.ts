'use client';
import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const UPLOAD_TIMEOUT = 30000; // 30 seconds

export const uploadFile = async (file: File, path: string): Promise<string> => {
  if (!file) {
    throw new Error('No file provided for upload.');
  }
  const storageRef = ref(storage, path);
  
  try {
    const uploadPromise = uploadBytes(storageRef, file);

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Upload timed out after 30 seconds. Please try again.')), UPLOAD_TIMEOUT)
    );

    const snapshot = await Promise.race([uploadPromise, timeoutPromise]);
    
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error: any) {
    console.error("Detailed upload error:", error);
    
    if (error.message.includes('timed out')) {
      throw error;
    }
    
    switch (error.code) {
      case 'storage/unauthorized':
        throw new Error('Permission denied. Please check your Storage security rules.');
      case 'storage/unauthenticated':
        throw new Error('Authentication required. Please sign in again.');
      case 'storage/canceled':
        throw new Error('Upload canceled by the user.');
      case 'storage/object-not-found':
         throw new Error('File not found during upload process.');
      case 'storage/bucket-not-found':
        throw new Error('Storage bucket not found. Check your Firebase project configuration.');
      case 'storage/project-not-found':
        throw new Error('Firebase project not found. Check your Firebase configuration.');
      case 'storage/quota-exceeded':
        throw new Error('Storage quota exceeded. Please contact the site administrator.');
      default:
        throw new Error(`An unknown error occurred during upload: ${error.message}`);
    }
  }
};
