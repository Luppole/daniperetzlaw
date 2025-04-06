
import { supabase } from '@/integrations/supabase/client';
import { ContactMessage } from '@/types/contact-message';

export const fetchContactMessages = async (): Promise<ContactMessage[]> => {
  try {
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
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in saveContactMessage:', error);
    return false;
  }
};
