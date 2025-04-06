
export interface ContactMessage {
  id: number;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  read?: boolean;
}
