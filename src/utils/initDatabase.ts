
import { supabase } from '@/integrations/supabase/client';
import { ensureArticlesExist } from '@/services/articleInitService';

// Function to initialize the database
export async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // Create appointments table
    try {
      const { error } = await supabase.query(`
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
      `);
      
      if (error) {
        console.error('Error creating appointments table:', error);
      } else {
        console.log('Appointments table created or already exists');
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
