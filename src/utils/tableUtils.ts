
import { supabase } from '@/integrations/supabase/client';

// Define proper types for functions
interface TableExistsResponse {
  exists: boolean;
}

interface TableCreateResponse {
  success: boolean;
}

// Function to safely check if a table exists using edge functions
export async function ensureTableExists(tableName: string): Promise<boolean> {
  try {
    console.log(`Checking if table ${tableName} exists...`);
    
    // Use proper typing for Supabase functions
    const { data, error } = await supabase.functions.invoke('check-table-exists', {
      body: { tableName }
    });
    
    if (error) {
      console.log(`Error checking table existence via function:`, error);
      return false;
    }
    
    // Type assertion with safety check
    if (data && typeof data === 'object' && 'exists' in data) {
      return (data as TableExistsResponse).exists || false;
    }
    
    return false;
  } catch (err) {
    console.error(`Error checking if table ${tableName} exists:`, err);
    return false;
  }
}

// Function to safely create the appointments table if it doesn't exist
export async function createAppointmentsTableIfNeeded(): Promise<boolean> {
  const tableExists = await ensureTableExists('appointments');
  
  if (!tableExists) {
    console.log('Attempting to create appointments table...');
    try {
      // Use proper typing for Supabase functions
      const { data, error } = await supabase.functions.invoke('create-appointments-table', {
        body: {}
      });
      
      if (error) {
        console.error('Failed to create appointments table via function:', error);
        
        // Fall back to RPC
        try {
          const { data: rpcData, error: rpcError } = await supabase.rpc('init_database');
          
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
      
      // Type assertion with safety check
      if (data && typeof data === 'object' && 'success' in data) {
        const typedData = data as TableCreateResponse;
        if (typedData.success) {
          console.log('Appointments table created successfully via function');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Failed to create appointments table:', error);
      return false;
    }
  }
  
  console.log('Appointments table already exists');
  return true;
}
