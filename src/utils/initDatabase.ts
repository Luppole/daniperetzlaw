
import { supabase } from '@/integrations/supabase/client';
import { ensureArticlesExist } from '@/services/articleService';

// Generic type for RPC function calls
type RPCResponse<T, FnName extends string = string> = {
  data: T | null;
  error: Error | null;
}

export async function initializeDatabase() {
  try {
    // Initialize the database with the RPC function
    const { error } = await supabase.rpc<unknown, string>(
      'init_database'
    ) as RPCResponse<unknown>;
    
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
