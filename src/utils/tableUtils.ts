
import { 
  collection, 
  getDocs, 
  query, 
  limit 
} from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';

// Function to safely check if a collection has documents (simulating table exists)
export async function ensureTableExists(tableName: string): Promise<boolean> {
  try {
    console.log(`Checking if collection ${tableName} exists...`);
    
    const collectionRef = collection(db, tableName);
    const q = query(collectionRef, limit(1));
    const snapshot = await getDocs(q);
    
    // If we can query the collection without errors, it exists or can be created
    return true;
  } catch (err) {
    console.error(`Error checking if collection ${tableName} exists:`, err);
    return false;
  }
}

// Function to ensure the appointments collection is ready
export async function createAppointmentsTableIfNeeded(): Promise<boolean> {
  const collectionExists = await ensureTableExists('appointments');
  
  if (!collectionExists) {
    console.log('Attempting to verify appointments collection access...');
    try {
      // Just try to access the collection
      const appointmentsRef = collection(db, 'appointments');
      const q = query(appointmentsRef, limit(1));
      await getDocs(q);
      
      console.log('Appointments collection access verified');
      return true;
    } catch (error) {
      console.error('Failed to verify appointments collection access:', error);
      return false;
    }
  }
  
  console.log('Appointments collection exists');
  return true;
}
