
import { supabase } from '@/integrations/supabase/client';
import { Appointment } from '@/types/appointments';

// Fetch all appointments
export async function getAllAppointments(): Promise<Appointment[]> {
  try {
    // Use rpc to get all appointments
    const { data, error } = await supabase.rpc('get_all_appointments', {}, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (error) throw error;
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
    const { data, error } = await supabase.rpc('insert_appointment', {
      p_name: appointmentData.name,
      p_email: appointmentData.email,
      p_phone: appointmentData.phone,
      p_date: appointmentData.date,
      p_time: appointmentData.time,
      p_details: appointmentData.details,
      p_status: 'pending'
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (error) throw error;
    return { success: true, id: data?.id as string | undefined };
  } catch (error) {
    console.error('Error creating appointment:', error);
    return { success: false };
  }
}

// Update appointment status
export async function updateAppointmentStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled'): Promise<boolean> {
  try {
    const { error } = await supabase.rpc('update_appointment_status', {
      p_id: id,
      p_status: status
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating appointment status:', error);
    return false;
  }
}

// Delete an appointment
export async function deleteAppointment(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.rpc('delete_appointment', {
      p_id: id
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return false;
  }
}

// Get appointment counts for dashboard
export async function getAppointmentCounts(): Promise<{ total: number; pending: number; confirmed: number; }> {
  try {
    const { data, error } = await supabase.rpc('get_appointment_counts', {}, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (error) throw error;
    return data as { total: number; pending: number; confirmed: number; } || { total: 0, pending: 0, confirmed: 0 };
  } catch (error) {
    console.error('Error getting appointment counts:', error);
    return { total: 0, pending: 0, confirmed: 0 };
  }
}

// Get available time slots
export async function getBookedSlots(date: string): Promise<string[]> {
  try {
    const { data, error } = await supabase.rpc('get_booked_slots', {
      date_param: date
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (error) throw error;
    return (data as {time: string}[] || []).map(slot => slot.time);
  } catch (error) {
    console.error('Error getting booked slots:', error);
    return [];
  }
}
