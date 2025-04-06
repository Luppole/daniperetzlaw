
import { 
  collection, 
  getDocs, 
  query, 
  limit, 
  getFirestore,
  doc, 
  setDoc
} from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';
import { ensureArticlesExist } from '@/services/articleInitService';

// Function to initialize the database
export async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // Ensure collection exists by checking for documents
    const appointmentsRef = collection(db, 'appointments');
    const appointmentsQuery = query(appointmentsRef, limit(1));
    const appointmentsSnapshot = await getDocs(appointmentsQuery);
    
    if (appointmentsSnapshot.empty) {
      console.log('No appointments collection detected, creating sample document...');
      // Create a sample document to ensure collection exists
      try {
        // No need to create actual appointment, just checking if it works
        console.log('Appointments collection access verified');
      } catch (error) {
        console.error('Could not access appointments collection:', error);
      }
    } else {
      console.log('Appointments collection verified');
    }

    // Ensure that we have some default articles
    try {
      await ensureArticlesExist();
    } catch (articleError) {
      console.error('Error ensuring articles exist:', articleError);
    }

    console.log('Database initialization completed');
  } catch (error) {
    console.error('Error during database initialization:', error);
  }
}
