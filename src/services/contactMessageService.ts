
import { supabase } from '@/integrations/supabase/client';
import { ContactMessage } from '@/types/contact-message';

export const fetchContactMessages = async (): Promise<ContactMessage[]> => {
  // We need to use more explicit type assertions to make TypeScript happy
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
};

export const markMessageAsRead = async (id: string): Promise<void> => {
  // More explicit type assertion for the update operation
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
};

export const deleteMessage = async (id: string): Promise<void> => {
  // More explicit type assertion for the delete operation
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
};
