
import { supabase } from '@/integrations/supabase/client';
import { Appointment } from '@/types/appointments';

// Fetch all appointments using RPC only
export async function getAllAppointments(): Promise<Appointment[]> {
  try {
    console.log('Fetching all appointments...');
    
    // Use RPC call to get appointments
    const { data, error } = await supabase.rpc('get_all_appointments') as {
      data: Appointment[] | null;
      error: any;
    };
    
    if (error) {
      console.error('Error fetching appointments:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
}

// Create a new appointment - using RPC only
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
    
    // Use RPC for type safety
    const { data, error } = await supabase.rpc('insert_appointment', {
      p_name: appointmentData.name,
      p_email: appointmentData.email,
      p_phone: appointmentData.phone,
      p_date: appointmentData.date,
      p_time: appointmentData.time,
      p_details: appointmentData.details || ''
    }) as { data: any; error: any };

    if (error) {
      console.error('Error creating appointment:', error);
      return { success: false };
    }
    
    console.log('Appointment created successfully:', data);
    // Handle the response data safely with proper typing
    if (data && typeof data === 'object' && 'id' in data) {
      return { success: true, id: data.id as string };
    }
    return { success: true };
  } catch (error) {
    console.error('Error creating appointment:', error);
    return { success: false };
  }
}

// Update appointment status with RPC
export async function updateAppointmentStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled'): Promise<boolean> {
  try {
    console.log(`Updating appointment ${id} status to ${status}`);
    
    // Use RPC
    const { error } = await supabase.rpc('update_appointment_status', {
      p_id: id,
      p_status: status
    }) as { data: any; error: any };
    
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

// Delete an appointment with RPC
export async function deleteAppointment(id: string): Promise<boolean> {
  try {
    console.log(`Deleting appointment ${id}`);
    
    // Use RPC
    const { error } = await supabase.rpc('delete_appointment', {
      p_id: id
    }) as { data: any; error: any };
    
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

// Get appointment counts for dashboard with RPC
export async function getAppointmentCounts(): Promise<{ total: number; pending: number; confirmed: number; }> {
  try {
    // Use RPC only
    const { data, error } = await supabase.rpc('get_appointment_counts') as {
      data: { total: number; pending: number; confirmed: number; } | null;
      error: any;
    };
    
    if (error) {
      console.error('Error getting appointment counts:', error);
      return { total: 0, pending: 0, confirmed: 0 };
    }
    
    // Handle potentially null data
    const result = data || { total: 0, pending: 0, confirmed: 0 };
    return result;
  } catch (error) {
    console.error('Error getting appointment counts:', error);
    return { total: 0, pending: 0, confirmed: 0 };
  }
}

// Get booked time slots for a specific date with RPC
export async function getBookedSlots(date: string): Promise<string[]> {
  try {
    console.log('Fetching booked slots for date:', date);
    
    // Use RPC
    const { data, error } = await supabase.rpc('get_booked_slots', {
      date_param: date
    }) as { data: any[] | null; error: any };
    
    if (error) {
      console.error('Error fetching booked slots:', error);
      return [];
    }
    
    // Extract time values safely
    if (!data) return [];
    const bookedSlots = Array.isArray(data) ? data.map((item: any) => item.time || '') : [];
    console.log('Booked slots:', bookedSlots);
    return bookedSlots;
  } catch (error) {
    console.error('Error getting booked slots:', error);
    return [];
  }
}
