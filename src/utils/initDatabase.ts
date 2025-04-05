
import { supabase } from '@/integrations/supabase/client';
import { ensureArticlesExist } from '@/services/articleService';

export async function initializeDatabase() {
  try {
    // Initialize the database with the RPC function
    const { error } = await supabase.rpc<{}, {}>(
      'init_database',
      {},
      { headers: { 'Content-Type': 'application/json' } }
    );
    
    if (error) {
      console.error('Error initializing database:', error);
      
      // Fall back to manually ensuring articles exist
      await ensureArticlesExist();
    }
    
    console.info('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    
    // Still attempt to create default articles even if the RPC fails
    await ensureArticlesExist();
  }
}
