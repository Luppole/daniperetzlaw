
import { supabase } from '@/integrations/supabase/client';

// Define proper types for functions
interface TableExistsResponse {
  exists: boolean;
}

// Function to safely check if a table exists using edge functions
export async function ensureTableExists(tableName: string): Promise<boolean> {
  try {
    console.log(`Checking if table ${tableName} exists...`);
    
    // Use proper typing with generic parameters
    const { data, error } = await supabase.functions.invoke<TableExistsResponse>('check-table-exists', {
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
export async function createAppointmentsTableIfNeeded(): Promise<boolean> {
  const tableExists = await ensureTableExists('appointments');
  
  if (!tableExists) {
    console.log('Attempting to create appointments table...');
    try {
      // Use proper typing with generic parameters
      const { data, error } = await supabase.functions.invoke<{ success: boolean }>('create-appointments-table', {
        body: {} as Record<string, never>
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
