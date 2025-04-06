
import { supabase } from '@/integrations/supabase/client';

// Function to safely check if a table exists using RPC
export async function ensureTableExists(tableName: string) {
  try {
    // Try to execute an RPC function that checks table existence
    const { data, error } = await supabase.rpc('check_table_exists', { 
      table_name: tableName 
    });
    
    if (error) {
      console.log(`Error checking if table ${tableName} exists:`, error);
      
      // Fallback approach: try to query the postgres information schema directly
      // This is a more advanced SQL query we can use when the RPC doesn't exist yet
      const { data: infoData, error: infoError } = await supabase.rpc('exec_sql', {
        sql_query: `SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public'
          AND table_name = '${tableName}'
        )`
      });
      
      if (infoError) {
        console.error('Error with fallback table check:', infoError);
        return false;
      }
      
      return infoData ? true : false;
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
        
        // Fallback: Try with direct SQL execution if RPC fails
        const createTableSQL = `
          CREATE TABLE IF NOT EXISTS public.appointments (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            details TEXT,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
        `;
        
        const { error: sqlError } = await supabase.rpc('exec_sql', {
          sql_query: createTableSQL
        });
        
        if (sqlError) {
          console.error('Failed to create table with SQL fallback:', sqlError);
          return false;
        }
        
        return true;
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
