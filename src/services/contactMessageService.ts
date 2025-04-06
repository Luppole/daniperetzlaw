
import { supabase } from '@/integrations/supabase/client';
import { ContactMessage } from '@/types/contact-message';

export const fetchContactMessages = async (): Promise<ContactMessage[]> => {
  // Use a type assertion to tell TypeScript this is safe
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false }) as any;

  if (error) {
    console.error('Error fetching contact messages:', error);
    throw new Error(error.message);
  }

  return (data || []) as ContactMessage[];
};

export const markMessageAsRead = async (id: string): Promise<void> => {
  // Use a type assertion for the table
  const { error } = await supabase
    .from('contact_messages')
    .update({ read: true })
    .eq('id', id) as any;

  if (error) {
    console.error('Error marking message as read:', error);
    throw new Error(error.message);
  }
};

export const deleteMessage = async (id: string): Promise<void> => {
  // Use a type assertion for the table
  const { error } = await supabase
    .from('contact_messages')
    .delete()
    .eq('id', id) as any;

  if (error) {
    console.error('Error deleting message:', error);
    throw new Error(error.message);
  }
};
