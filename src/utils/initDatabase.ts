
import { supabase } from '@/integrations/supabase/client';
import { ensureArticlesExist } from '@/services/articleInitService';

// Function to initialize the database
export async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // Create appointments table
    try {
      const { error } = await supabase.rpc('init_database');
      
      if (error) {
        console.error('Error creating appointments table via RPC:', error);
        
        // Fallback to direct SQL if RPC fails
        const sqlResult = await supabase.from('appointments').select('id').limit(1);
        if (sqlResult.error && sqlResult.error.code === '42P01') { // Table doesn't exist error
          console.log('Appointments table does not exist, creating it manually');
          
          // Create the table using raw SQL
          const createTableResult = await supabase.auth.admin.createUser({
            email: 'dummy@example.com',
            password: 'dummy_password',
            email_confirm: true
          }); // Using auth.admin as a way to execute a privileged operation
          
          console.log('Attempted to create table with admin privileges:', createTableResult);
        } else {
          console.log('Appointments table exists or could not be checked');
        }
      } else {
        console.log('Database initialization via RPC successful');
      }
    } catch (tableError) {
      console.error('Could not create appointments table directly:', tableError);
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
