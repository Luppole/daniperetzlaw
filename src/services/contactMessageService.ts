
import { supabase } from '@/integrations/supabase/client';
import { ContactMessage } from '@/types/contact-message';
import { toast } from 'sonner';

// Check if the contact_messages table exists
export async function checkTableExists(): Promise<boolean> {
  try {
    // Query Supabase's information schema to check if the table exists
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'contact_messages')
      .eq('table_schema', 'public');
    
    if (error) {
      console.error('Error checking table existence:', error);
      return false;
    }
    
    return data && data.length > 0;
  } catch (error) {
    console.error('Error in checkTableExists:', error);
    return false;
  }
}

// Get tables
export async function listTables(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (error) {
      console.error('Error listing tables:', error);
      return [];
    }
    
    return data ? data.map(item => item.table_name) : [];
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

    // Use explicit type assertion to bypass TypeScript restrictions
    const { data, error } = await supabase
      .from('contact_messages' as any)
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
    
    // Explicit type assertion for the update operation
    const { error } = await supabase
      .from('contact_messages' as any)
      .update({ read: true } as any)
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
    
    // Explicit type assertion for the delete operation
    const { error } = await supabase
      .from('contact_messages' as any)
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
    
    // Explicit type assertion for the insert operation
    const { error } = await supabase
      .from('contact_messages' as any)
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
