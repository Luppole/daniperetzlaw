
import { supabase } from '@/integrations/supabase/client';
import { Appointment } from '@/types/appointments';

// Define interfaces for RPC functions' response types
interface AppointmentRPCResponse {
  id?: string;
  success?: boolean;
  [key: string]: any;
}

// Fetch all appointments using RPC
export async function getAllAppointments(): Promise<Appointment[]> {
  try {
    console.log('Fetching all appointments...');
    
    // Use the supabase.rpc with proper type parameters
    const { data, error } = await supabase.rpc('get_all_appointments');
    
    if (error) {
      console.error('Error fetching appointments:', error);
      return [];
    }
    
    return data as Appointment[] || [];
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
}

// Create a new appointment
export async function createAppointment(appointmentData: {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  details: string | null;
}): Promise<{success: boolean; id?: string}> {
  try {
    console.log('Creating appointment with data:', appointmentData);
    
    // Use supabase.rpc with proper type parameters
    const { data, error } = await supabase.rpc('insert_appointment', {
      p_name: appointmentData.name,
      p_email: appointmentData.email,
      p_phone: appointmentData.phone,
      p_date: appointmentData.date,
      p_time: appointmentData.time,
      p_details: appointmentData.details || ''
    });

    if (error) {
      console.error('Error creating appointment:', error);
      return { success: false };
    }
    
    console.log('Appointment created successfully:', data);
    // Type guard to ensure data has the expected shape
    if (data && typeof data === 'object' && 'id' in data) {
      return { success: true, id: data.id as string };
    }
    return { success: true };
  } catch (error) {
    console.error('Error creating appointment:', error);
    return { success: false };
  }
}

// Update appointment status
export async function updateAppointmentStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled'): Promise<boolean> {
  try {
    console.log(`Updating appointment ${id} status to ${status}`);
    
    // Use supabase.rpc with the correct parameters
    const { data, error } = await supabase.rpc('update_appointment_status', {
      p_id: id,
      p_status: status
    });
    
    if (error) {
      console.error('Error updating appointment status:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating appointment status:', error);
    return false;
  }
}

// Delete an appointment
export async function deleteAppointment(id: string): Promise<boolean> {
  try {
    console.log(`Deleting appointment ${id}`);
    
    // Use supabase.rpc with proper parameters
    const { data, error } = await supabase.rpc('delete_appointment', {
      p_id: id
    });
    
    if (error) {
      console.error('Error deleting appointment:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return false;
  }
}

// Get appointment counts for dashboard
export async function getAppointmentCounts(): Promise<{ total: number; pending: number; confirmed: number; }> {
  try {
    // Use supabase.rpc with proper parameters
    const { data, error } = await supabase.rpc('get_appointment_counts');
    
    if (error) {
      console.error('Error getting appointment counts:', error);
      return { total: 0, pending: 0, confirmed: 0 };
    }
    
    return data as { total: number; pending: number; confirmed: number; } || { total: 0, pending: 0, confirmed: 0 };
  } catch (error) {
    console.error('Error getting appointment counts:', error);
    return { total: 0, pending: 0, confirmed: 0 };
  }
}

// Get booked time slots for a specific date
export async function getBookedSlots(date: string): Promise<string[]> {
  try {
    console.log('Fetching booked slots for date:', date);
    
    // Use supabase.rpc with proper parameters
    const { data, error } = await supabase.rpc('get_booked_slots', {
      date_param: date
    });
    
    if (error) {
      console.error('Error fetching booked slots:', error);
      return [];
    }
    
    // Safe handling if data is null or undefined
    if (!data) return [];
    
    // Extract time values safely with proper type assertion
    const typedData = data as Array<{ time: string }>;
    const bookedSlots = typedData.map(item => item.time || '').filter(Boolean);
    console.log('Booked slots:', bookedSlots);
    return bookedSlots;
  } catch (error) {
    console.error('Error getting booked slots:', error);
    return [];
  }
}
