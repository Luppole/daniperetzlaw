
import { supabase } from '@/integrations/supabase/client';
import { ensureArticlesExist } from '@/services/articleInitService';
import { createAppointmentsTableIfNeeded } from '@/utils/tableUtils';

// Function to initialize the database
export async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // Create exec_sql RPC function if it doesn't exist
    // This helps us run SQL directly as a fallback when needed
    try {
      const { error } = await supabase.rpc('create_exec_sql_function');
      if (error && !error.message.includes('already exists')) {
        console.log('Creating exec_sql RPC function:', error);
        
        // Execute the creation manually if function doesn't exist
        const { error: createError } = await supabase.rpc('exec_sql_raw', {
          query: `
            CREATE OR REPLACE FUNCTION public.exec_sql(sql_query TEXT)
            RETURNS JSONB
            LANGUAGE plpgsql
            SECURITY DEFINER
            AS $$
            DECLARE
              result JSONB;
            BEGIN
              EXECUTE sql_query INTO result;
              RETURN result;
            EXCEPTION WHEN OTHERS THEN
              RETURN NULL;
            END;
            $$;
          `
        });
        
        if (createError) {
          console.error('Error creating exec_sql function:', createError);
        }
      }
    } catch (error) {
      console.error('Error setting up SQL execution functions:', error);
    }
    
    // Create appointments table
    try {
      const success = await createAppointmentsTableIfNeeded();
      
      if (!success) {
        console.error('Could not create appointments table');
      }
    } catch (tableError) {
      console.error('Could not create appointments table:', tableError);
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
