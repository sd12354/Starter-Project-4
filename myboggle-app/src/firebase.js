// Firebase configuration for authentication only
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDCrmAsYhRyOt8uYwFu8XBRhVGkQScBXFA",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "boggle-app-c0d1c.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "boggle-app-c0d1c",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "boggle-app-c0d1c.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "749574729989",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:749574729989:web:ecc34b32ebf2454b92476c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;

