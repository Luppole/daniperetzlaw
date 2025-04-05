
export interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  details: string | null;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}
