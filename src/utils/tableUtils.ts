
import { supabase } from '@/integrations/supabase/client';

// Function to safely check if a table exists using direct SQL
export async function ensureTableExists(tableName: string) {
  try {
    // Use direct SQL function call
    console.log(`Checking if table ${tableName} exists...`);
    
    try {
      const { data, error } = await supabase.functions.invoke('check-table-exists', {
        body: { tableName }
      });
      
      if (error) {
        console.log(`Error checking table existence via function:`, error);
        return false;
      }
      
      return data?.exists || false;
    } catch (err) {
      console.error(`Cannot invoke function to check table:`, err);
      return false;
    }
  } catch (err) {
    console.error(`Error checking if table ${tableName} exists:`, err);
    return false;
  }
}

// Function to safely create the appointments table if it doesn't exist
export async function createAppointmentsTableIfNeeded() {
  const tableExists = await ensureTableExists('appointments');
  
  if (!tableExists) {
    console.log('Attempting to create appointments table...');
    try {
      // Try using functions API
      try {
        const { error } = await supabase.functions.invoke('create-appointments-table', {
          body: {}
        });
        
        if (error) {
          console.error('Failed to create appointments table via function:', error);
          return false;
        }
        
        return true;
      } catch (fnError) {
        console.error('Failed to invoke create table function:', fnError);
      }
      
      // Fall back to direct RPC
      try {
        const { error } = await supabase.rpc('init_database');
        
        if (error) {
          console.error('Failed to create appointments table:', error);
          return false;
        }
        
        console.log('Appointments table created successfully');
        return true;
      } catch (error) {
        console.error('Failed to create appointments table:', error);
        return false;
      }
    } catch (error) {
      console.error('Failed to create appointments table:', error);
      return false;
    }
  }
  
  console.log('Appointments table already exists');
  return true;
}
