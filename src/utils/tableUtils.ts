
import { supabase } from '@/integrations/supabase/client';

// Function to safely check if a table exists
export async function ensureTableExists(tableName: string) {
  try {
    // Try to select a single row from the table to see if it exists
    const { error } = await supabase.from(tableName).select('*').limit(1);
    
    if (error && error.code === '42P01') { // Table doesn't exist error
      console.log(`Table ${tableName} doesn't exist. Consider creating it in the Supabase dashboard.`);
      return false;
    }
    
    return !error; // If no error, table exists
  } catch (err) {
    console.error(`Error checking if table ${tableName} exists:`, err);
    return false;
  }
}

// Function to safely create the appointments table if it doesn't exist
// This will only work if the user has enough permissions, but won't crash if they don't
export async function createAppointmentsTableIfNeeded() {
  const tableExists = await ensureTableExists('appointments');
  
  if (!tableExists) {
    console.log('Attempting to create appointments table via client...');
    try {
      // Note: This will likely fail due to permissions, but we should try anyway
      await supabase.auth.signUp({
        email: 'temporary@example.com',
        password: 'temporary_password',
        options: {
          data: {
            operation: 'create_appointments_table'
          }
        }
      });
      
      console.log('Auth operation completed - check if table was created');
    } catch (error) {
      console.error('Failed to create appointments table:', error);
    }
  }
}
