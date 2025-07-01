'use client';
import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const uploadFile = async (file: File, path: string): Promise<string> => {
  if (!file) {
    throw new Error('No file provided for upload.');
  }
  const storageRef = ref(storage, path);
  
  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error: any) {
    console.error("Detailed upload error:", error); // Log the full error object
    
    // Re-throw a more specific error based on the Firebase error code
    switch (error.code) {
      case 'storage/unauthorized':
        throw new Error('Permission denied. You might need to check your Storage security rules.');
      case 'storage/unauthenticated':
        throw new Error('Authentication required. Please sign in again.');
      case 'storage/canceled':
        throw new Error('Upload canceled by the user.');
      case 'storage/object-not-found':
         throw new Error('File not found. This should not happen during an upload.');
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
