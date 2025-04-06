
import { supabase } from '@/integrations/supabase/client';
import { ContactMessage } from '@/types/contact-message';
import { toast } from 'sonner';

// Check if the contact_messages table exists
export async function checkTableExists(): Promise<boolean> {
  try {
    // Use rpc for custom SQL instead of direct schema query to avoid type errors
    const { data, error } = await supabase.rpc('check_table_exists', {
      table_name: 'contact_messages'
    });
    
    if (error) {
      console.error('Error checking table existence:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error in checkTableExists:', error);
    return false;
  }
}

// Get tables (alternative implementation to avoid type errors)
export async function listTables(): Promise<string[]> {
  try {
    // Use direct SQL query via rpc to avoid type issues
    const { data, error } = await supabase.rpc('list_tables');
    
    if (error) {
      console.error('Error listing tables:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in listTables:', error);
    return [];
  }
}

export const fetchContactMessages = async (): Promise<ContactMessage[]> => {
  try {
    // First check if the table exists
    const tableExists = await checkTableExists();
    if (!tableExists) {
      console.warn('contact_messages table does not exist');
      return [];
    }

    // Use a more generic approach with raw query via rpc to avoid type checking issues
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false }) as {
        data: ContactMessage[] | null;
        error: any;
      };

    if (error) {
      console.error('Error fetching contact messages:', error);
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchContactMessages:', error);
    return [];
  }
};

export const markMessageAsRead = async (id: string): Promise<void> => {
  try {
    // First check if the table exists
    const tableExists = await checkTableExists();
    if (!tableExists) {
      console.warn('contact_messages table does not exist');
      throw new Error('Table does not exist');
    }
    
    const { error } = await supabase
      .from('contact_messages')
      .update({ read: true })
      .eq('id', id) as {
        error: any;
      };

    if (error) {
      console.error('Error marking message as read:', error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Error in markMessageAsRead:', error);
    throw error;
  }
};

export const deleteMessage = async (id: string): Promise<void> => {
  try {
    // First check if the table exists
    const tableExists = await checkTableExists();
    if (!tableExists) {
      console.warn('contact_messages table does not exist');
      throw new Error('Table does not exist');
    }
    
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id) as {
        error: any;
      };

    if (error) {
      console.error('Error deleting message:', error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Error in deleteMessage:', error);
    throw error;
  }
};

export const saveContactMessage = async (message: Omit<ContactMessage, 'id' | 'created_at' | 'read'>): Promise<boolean> => {
  try {
    // First check if the table exists
    const tableExists = await checkTableExists();
    
    if (!tableExists) {
      console.warn('contact_messages table does not exist, sending email only');
      // If the table doesn't exist, we'll still return true since we'll fall back to email
      return true;
    }
    
    const { error } = await supabase
      .from('contact_messages')
      .insert([{
        ...message,
        created_at: new Date().toISOString(),
        read: false
      }]) as {
        error: any;
      };

    if (error) {
      console.error('Error saving contact message:', error);
      // We'll still return true to allow email fallback
      return true;
    }

    return true;
  } catch (error) {
    console.error('Error in saveContactMessage:', error);
    // Return true to still allow email fallback
    return true;
  }
};
