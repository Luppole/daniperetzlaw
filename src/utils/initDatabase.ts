
import { supabase } from '@/integrations/supabase/client';
import { ensureArticlesExist } from '@/services/articleService';

export async function initializeDatabase() {
  try {
    // Check if appointments table exists, if not create it
    const { error: appointmentsError } = await supabase.rpc('create_appointments_table_if_not_exists');
    
    if (appointmentsError) {
      console.error('Error ensuring appointments table exists:', appointmentsError);
      
      // Fall back to direct SQL if RPC fails
      const { error } = await supabase.query(`
        CREATE TABLE IF NOT EXISTS public.appointments (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
      }
    }

    // Ensure default articles exist
    await ensureArticlesExist();
    
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}
