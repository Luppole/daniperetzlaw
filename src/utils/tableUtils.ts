
import { supabase } from '@/integrations/supabase/client';

// Function to safely check if a table exists using edge functions
export async function ensureTableExists(tableName: string) {
  try {
    // Use edge function to check table existence
    console.log(`Checking if table ${tableName} exists...`);
    
    // Call edge function
    const { data, error } = await supabase.functions.invoke('check-table-exists', {
      body: { tableName } as { tableName: string }
    });
    
    if (error) {
      console.log(`Error checking table existence via function:`, error);
      return false;
    }
    
    return data?.exists || false;
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
      const { error } = await supabase.functions.invoke('create-appointments-table', {
        body: {} as Record<string, never>
      });
      
      if (error) {
        console.error('Failed to create appointments table via function:', error);
        
        // Fall back to RPC
        try {
          const { error: rpcError } = await supabase.rpc('init_database') as { 
            data: any; 
            error: any 
          };
          
          if (rpcError) {
            console.error('Failed to create appointments table via RPC:', rpcError);
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
