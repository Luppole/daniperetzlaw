
import { supabase } from '@/integrations/supabase/client';
import { Appointment } from '@/types/appointments';

// Define types for Supabase RPC functions
interface GetAllAppointmentsResponse extends Appointment {}
interface InsertAppointmentResponse { id: string }
interface GetAppointmentCountsResponse { total: number; pending: number; confirmed: number }
interface GetBookedSlotsResponse { time: string }

// Fetch all appointments
export async function getAllAppointments(): Promise<Appointment[]> {
  try {
    // First try the RPC function
    try {
      // Cast to any to bypass TypeScript's type checking for RPC functions
      const { data, error } = await (supabase.rpc as any)('get_all_appointments');
      
      if (!error && data) {
        return (data as GetAllAppointmentsResponse[]) || [];
      }
    } catch (rpcError) {
      console.log('RPC function not available, falling back to direct query');
    }
    
    // Fallback to direct query
    const { data, error } = await (supabase as any)
      .from('appointments')
      .select('*')
      .order('date', { ascending: true })
      .order('time', { ascending: true });
    
    if (error) throw error;
    return (data as Appointment[]) || [];
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
}

// Create a new appointment - using direct insert instead of RPC
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
    
    // First try direct insert to the appointments table
    const { data, error } = await (supabase as any)
      .from('appointments')
      .insert([{
        name: appointmentData.name,
        email: appointmentData.email,
        phone: appointmentData.phone,
        date: appointmentData.date,
        time: appointmentData.time,
        details: appointmentData.details,
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
    // First try the RPC function
    try {
      // Cast to any to bypass TypeScript's type checking for RPC functions
      const { error } = await (supabase.rpc as any)('update_appointment_status', {
        p_id: id,
        p_status: status
      });
      
      if (!error) {
        return true;
      }
    } catch (rpcError) {
      console.log('RPC function not available, falling back to direct update');
    }
    
    // Fallback to direct update
    const { error } = await (supabase as any)
      .from('appointments')
      .update({ status })
      .eq('id', id);
    
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
    // First try the RPC function
    try {
      // Cast to any to bypass TypeScript's type checking for RPC functions
      const { error } = await (supabase.rpc as any)('delete_appointment', {
        p_id: id
      });
      
      if (!error) {
        return true;
      }
    } catch (rpcError) {
      console.log('RPC function not available, falling back to direct delete');
    }
    
    // Fallback to direct delete
    const { error } = await (supabase as any)
      .from('appointments')
      .delete()
      .eq('id', id);
    
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
    // First try the RPC function
    try {
      // Cast to any to bypass TypeScript's type checking for RPC functions
      const { data, error } = await (supabase.rpc as any)('get_appointment_counts');
      
      if (!error && data) {
        return (data as GetAppointmentCountsResponse) || { total: 0, pending: 0, confirmed: 0 };
      }
    } catch (rpcError) {
      console.log('RPC function not available, falling back to direct queries');
    }
    
    // Fallback to direct queries
    const { count: total } = await (supabase as any)
      .from('appointments')
      .count();
      
    const { count: pending } = await (supabase as any)
      .from('appointments')
      .count()
      .eq('status', 'pending');
      
    const { count: confirmed } = await (supabase as any)
      .from('appointments')
      .count()
      .eq('status', 'confirmed');
    
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
    
    // First try the RPC function
    try {
      // Cast to any to bypass TypeScript's type checking for RPC functions
      const { data, error } = await (supabase.rpc as any)('get_booked_slots', {
        date_param: date
      });
      
      if (!error && data) {
        console.log('RPC returned booked slots:', data);
        return (data as GetBookedSlotsResponse[]).map(slot => slot.time);
      }
    } catch (rpcError) {
      console.log('RPC function not available, falling back to direct query');
    }
    
    // Fallback to direct query to the appointments table
    const { data, error } = await (supabase as any)
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
    console.log('Mapped booked slots:', bookedSlots);
    return bookedSlots;
  } catch (error) {
    console.error('Error getting booked slots:', error);
    return [];
  }
}
