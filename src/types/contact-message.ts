
export interface ContactMessage {
  id: string; // Changed from number to string to match Supabase's string ID format
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  read?: boolean;
}
