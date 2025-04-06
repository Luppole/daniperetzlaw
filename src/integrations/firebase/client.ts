
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6GP8bbDi_0CZCN-WlMOd1sGiVFVBXNGc",
  authDomain: "dannyperetzlaw.firebaseapp.com",
  projectId: "dannyperetzlaw",
  storageBucket: "dannyperetzlaw.appspot.com",
  messagingSenderId: "434508219722",
  appId: "1:434508219722:web:fd1531d419b4e65f0cedb3",
  measurementId: "G-JM8VLXW3S2"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
export const analytics = getAnalytics(firebaseApp);
export const storage = getStorage(firebaseApp);

// Initialize Firebase Analytics
export const initializeFirebase = () => {
  // Console log the auth state to debug
  console.log('Current auth state:', auth.currentUser ? 'Logged in' : 'Not logged in');
  
  // Enable auth emulator if in development
  if (import.meta.env.DEV) {
    try {
      // Connect to auth emulator if running locally
      // connectAuthEmulator(auth, "http://localhost:9099");
      // connectFirestoreEmulator(db, "localhost", 8080);
      console.log("Firebase initialization complete");
    } catch (error) {
      console.error("Firebase initialization error:", error);
    }
  }
};
