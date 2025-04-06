
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
      console.log('RPC function not available, skipping database initialization');
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
