
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
export const storage = getStorage(firebaseApp);

// Initialize analytics safely
let analyticsInstance = null;
try {
  // Only initialize analytics in browser environment
  analyticsInstance = getAnalytics(firebaseApp);
} catch (error) {
  console.error("Failed to initialize analytics:", error);
}
export const analytics = analyticsInstance;

// Initialize Firebase and debug auth state
export const initializeFirebase = () => {
  try {
    // Console log the auth state to debug
    console.log('Current auth state:', auth.currentUser ? 'Logged in' : 'Not logged in');
    console.log('Firebase initialization complete');
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
};
