
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6GP8bbDi_0CZCN-WlMOd1sGiVFVBXNGc",
  authDomain: "dannyperetzlaw.firebaseapp.com",
  projectId: "dannyperetzlaw",
  storageBucket: "dannyperetzlaw.firebasestorage.app",
  messagingSenderId: "434508219722",
  appId: "1:434508219722:web:fd1531d419b4e65f0cedb3",
  measurementId: "G-JM8VLXW3S2"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
export const analytics = getAnalytics(firebaseApp);

// Initialize Firebase Analytics
export const initializeFirebase = () => {
  // Enable auth emulator if in development
  if (import.meta.env.DEV) {
    try {
      // Connect to auth emulator if running locally
      // connectAuthEmulator(auth, "http://localhost:9099");
      console.log("Firebase initialization complete");
    } catch (error) {
      console.error("Firebase initialization error:", error);
    }
  }
};
