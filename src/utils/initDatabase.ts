
import { supabase } from '@/integrations/supabase/client';
import { ensureArticlesExist } from '@/services/articleService';

export async function initializeDatabase() {
  try {
    // We'll use rpc instead of direct table operations to work around type issues
    const { error } = await supabase.rpc('init_database');
    
    if (error) {
      console.error('Error initializing database:', error);
    }

    // Ensure default articles exist
    await ensureArticlesExist();
    
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}
