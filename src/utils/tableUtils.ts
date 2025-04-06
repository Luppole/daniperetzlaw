
import { supabase } from '@/integrations/supabase/client';

// Function to safely check if a table exists using edge functions
export async function ensureTableExists(tableName: string) {
  try {
    // Use edge function to check table existence
    console.log(`Checking if table ${tableName} exists...`);
    
    // Call edge function with explicit typing
    const response = await supabase.functions.invoke('check-table-exists', {
      body: { tableName } 
    });
    
    if (response.error) {
      console.log(`Error checking table existence via function:`, response.error);
      return false;
    }
    
    return response.data?.exists || false;
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
      // Try using functions API with proper typing
      const response = await supabase.functions.invoke('create-appointments-table', {
        body: {} 
      });
      
      if (response.error) {
        console.error('Failed to create appointments table via function:', response.error);
        
        // Fall back to RPC
        try {
          const rpcResponse = await supabase.rpc('init_database');
          
          if (rpcResponse.error) {
            console.error('Failed to create appointments table via RPC:', rpcResponse.error);
            return false;
          }
          
          console.log('Appointments table created successfully via RPC');
          return true;
        } catch (rpcErr) {
          console.error('Failed to call RPC for table creation:', rpcErr);
          return false;
        }
      }
      
      console.log('Appointments table created successfully via function');
      return true;
    } catch (error) {
      console.error('Failed to create appointments table:', error);
      return false;
    }
  }
  
  console.log('Appointments table already exists');
  return true;
}
