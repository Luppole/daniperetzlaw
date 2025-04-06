
import { 
  collection, 
  getDocs, 
  query, 
  limit,
  getDoc,
  doc
} from 'firebase/firestore';
import { db, auth } from '@/integrations/firebase/client';
import { ensureArticlesExist } from '@/services/articleInitService';

// Function to initialize the database
export async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // First check if the current user is authenticated
    const currentUser = auth.currentUser;
    console.log('Current user:', currentUser?.uid || 'No user logged in');
    
    // Test basic read operation to verify permissions
    try {
      // Try to read a document in the articles collection
      const articlesRef = collection(db, 'articles');
      const articlesQuery = query(articlesRef, limit(1));
      const articlesSnapshot = await getDocs(articlesQuery);
      console.log('Articles collection access granted. Documents:', articlesSnapshot.size);
    } catch (error: any) {
      console.error('Error accessing articles collection:', error.message);
      // We'll continue with the initialization even if this fails
    }
    
    // Check appointments collection
    try {
      const appointmentsRef = collection(db, 'appointments');
      const appointmentsQuery = query(appointmentsRef, limit(1));
      const appointmentsSnapshot = await getDocs(appointmentsQuery);
      
      console.log('Appointments collection access granted. Documents:', appointmentsSnapshot.size);
    } catch (error: any) {
      console.error('Error accessing appointments collection:', error.message);
      // We'll continue with the initialization even if this fails
    }

    // Ensure that we have all our default articles
    try {
      await ensureArticlesExist();
      console.log('Articles initialization completed');
    } catch (articleError: any) {
      console.error('Error ensuring articles exist:', articleError.message);
      // We'll log the detailed error for debugging
      if (articleError.code) {
        console.error('Error code:', articleError.code);
      }
    }

    console.log('Database initialization completed');
  } catch (error: any) {
    console.error('Error during database initialization:', error.message);
    // Check if it's a permissions error and log more details
    if (error.code === 'permission-denied') {
      console.error('Permission denied. Please check your Firebase security rules.');
    }
  }
}
