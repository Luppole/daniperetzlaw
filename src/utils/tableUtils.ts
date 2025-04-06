
import { supabase } from '@/integrations/supabase/client';

// Function to safely check if a table exists (with type safety)
export async function ensureTableExists(tableName: string) {
  try {
    // Use raw SQL query to check if table exists
    const { data, error } = await supabase.rpc('check_table_exists', { 
      table_name: tableName 
    }) as unknown as { data: boolean; error: any };
    
    if (error) {
      console.log(`Error checking if table ${tableName} exists:`, error);
      return false;
    }
    
    return data || false;
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
      // Use RPC to create table
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
  }
  
  console.log('Appointments table already exists');
  return true;
}
