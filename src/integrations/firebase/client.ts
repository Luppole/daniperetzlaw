
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator, setPersistence, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";
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
  if (typeof window !== 'undefined') {
    analyticsInstance = getAnalytics(firebaseApp);
  }
} catch (error) {
  console.error("Failed to initialize analytics:", error);
}
export const analytics = analyticsInstance;

// Initialize Firebase and debug auth state
export const initializeFirebase = () => {
  try {
    // Try both persistence methods for better compatibility
    const setPersistencePromise = setPersistence(auth, browserLocalPersistence)
      .catch(error => {
        console.warn("Error setting local persistence, trying session persistence:", error);
        return setPersistence(auth, browserSessionPersistence);
      })
      .catch(error => {
        console.error("All persistence methods failed:", error);
      });
      
    auth.onAuthStateChanged((user) => {
      console.log('Auth state changed:', user ? 'Logged in as ' + user.email : 'Not logged in');
      
      // Debug user details to help with debugging
      if (user) {
        console.log('User details:', {
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
          isAnonymous: user.isAnonymous,
          displayName: user.displayName
        });
      }
    });
    
    console.log('Firebase initialization complete');
    return setPersistencePromise;
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
};
