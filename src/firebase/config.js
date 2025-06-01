// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your Firebase config - Using your actual project credentials
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDDK6UKBgQGVTh1jEv6xbYKyCKLrHShjg4",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "cxvari20.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "cxvari20",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "cxvari20.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "358957775313",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:358957775313:web:6006e7ec2d1888061508f0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app;
