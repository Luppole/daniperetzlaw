
import { supabase } from '@/integrations/supabase/client';
import { ContactMessage } from '@/types/contact-message';

export const fetchContactMessages = async (): Promise<ContactMessage[]> => {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching contact messages:', error);
    throw new Error(error.message);
  }

  return data || [];
};

export const markMessageAsRead = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('contact_messages')
    .update({ read: true })
    .eq('id', id);

  if (error) {
    console.error('Error marking message as read:', error);
    throw new Error(error.message);
  }
};

export const deleteMessage = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('contact_messages')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting message:', error);
    throw new Error(error.message);
  }
};
