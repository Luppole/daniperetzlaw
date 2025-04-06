
import { supabase } from '@/integrations/supabase/client';
import { ensureArticlesExist } from '@/services/articleInitService';

// Function to initialize the database
export async function initializeDatabase() {
  try {
    // Try to call the init_database RPC function
    try {
      // Cast to any to bypass TypeScript's type checking for RPC functions
      await (supabase.rpc as any)('init_database');
      console.log('Database initialized via RPC function');
    } catch (rpcError) {
      console.log('RPC function not available, creating tables directly');
      
      // Create appointments table directly if RPC function is not available
      try {
        await (supabase as any).query(`
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
        console.log('Appointments table created or already exists');
      } catch (tableError) {
        console.log('Could not create appointments table directly:', tableError);
      }
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
