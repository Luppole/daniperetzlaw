
import { supabase } from '@/integrations/supabase/client';
import { Appointment } from '@/types/appointments';

// Fetch all appointments
export async function getAllAppointments(): Promise<Appointment[]> {
  try {
    console.log('Fetching all appointments...');
    
    // Direct query to the appointments table
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('date', { ascending: true })
      .order('time', { ascending: true });
    
    if (error) {
      console.error('Supabase error fetching appointments:', error);
      throw error;
    }
    
    return (data as Appointment[]) || [];
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
}

// Create a new appointment - using direct insert
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
    
    // Direct insert to the appointments table
    const { data, error } = await supabase
      .from('appointments')
      .insert([{
        name: appointmentData.name,
        email: appointmentData.email,
        phone: appointmentData.phone,
        date: appointmentData.date,
        time: appointmentData.time,
        details: appointmentData.details || '',
        status: 'pending'
      }])
      .select('id')
      .single();

    if (error) {
      console.error('Supabase error creating appointment:', error);
      throw error;
    }
    
    console.log('Appointment created successfully:', data);
    return { success: true, id: data?.id };
  } catch (error) {
    console.error('Error creating appointment:', error);
    return { success: false };
  }
}

// Update appointment status
export async function updateAppointmentStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled'): Promise<boolean> {
  try {
    console.log(`Updating appointment ${id} status to ${status}`);
    
    // Direct update to the appointments table
    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id);
    
    if (error) {
      console.error('Supabase error updating appointment status:', error);
      throw error;
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
    
    // Direct delete from the appointments table
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Supabase error deleting appointment:', error);
      throw error;
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
    // Direct count queries to the appointments table
    const { count: total, error: totalError } = await supabase
      .from('appointments')
      .count();
      
    if (totalError) throw totalError;
    
    const { count: pending, error: pendingError } = await supabase
      .from('appointments')
      .count()
      .eq('status', 'pending');
      
    if (pendingError) throw pendingError;
    
    const { count: confirmed, error: confirmedError } = await supabase
      .from('appointments')
      .count()
      .eq('status', 'confirmed');
    
    if (confirmedError) throw confirmedError;
    
    return { 
      total: total || 0, 
      pending: pending || 0, 
      confirmed: confirmed || 0 
    };
  } catch (error) {
    console.error('Error getting appointment counts:', error);
    return { total: 0, pending: 0, confirmed: 0 };
  }
}

// Get booked time slots for a specific date
export async function getBookedSlots(date: string): Promise<string[]> {
  try {
    console.log('Fetching booked slots for date:', date);
    
    // Direct query to the appointments table
    const { data, error } = await supabase
      .from('appointments')
      .select('time')
      .eq('date', date)
      .in('status', ['confirmed', 'pending']);
    
    if (error) {
      console.error('Supabase error fetching booked slots:', error);
      throw error;
    }
    
    console.log('Received booked slots data:', data);
    // Map the data to get only the time strings
    const bookedSlots = Array.isArray(data) ? data.map(slot => slot.time) : [];
    console.log('Booked slots:', bookedSlots);
    return bookedSlots;
  } catch (error) {
    console.error('Error getting booked slots:', error);
    return [];
  }
}
