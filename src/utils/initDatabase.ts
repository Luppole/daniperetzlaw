
import { supabase } from '@/integrations/supabase/client';
import { ensureArticlesExist } from '@/services/articleInitService';
import { createAppointmentsTableIfNeeded } from '@/utils/tableUtils';

// Function to initialize the database
export async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // Try to create exec_sql function via edge function
    try {
      const { error } = await supabase.functions.invoke('setup-database-functions', {
        body: {}
      });
      
      if (error) {
        console.error('Error setting up database functions:', error);
      } else {
        console.log('Database functions set up successfully');
      }
    } catch (error) {
      console.error('Error invoking setup functions:', error);
    }
    
    // Create appointments table
    try {
      const success = await createAppointmentsTableIfNeeded();
      
      if (!success) {
        console.error('Could not create appointments table');
      } else {
        console.log('Appointments table check completed');
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
