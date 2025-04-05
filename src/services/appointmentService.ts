
import { supabase } from '@/integrations/supabase/client';
import { Appointment } from '@/types/appointments';

// Define types for Supabase RPC functions
interface GetAllAppointmentsResponse extends Appointment {}
interface InsertAppointmentResponse { id: string }
interface GetAppointmentCountsResponse { total: number; pending: number; confirmed: number }
interface GetBookedSlotsResponse { time: string }

// Generic type for RPC function calls
type RPCResponse<T> = {
  data: T | null;
  error: Error | null;
}

// Fetch all appointments
export async function getAllAppointments(): Promise<Appointment[]> {
  try {
    const { data, error } = await supabase.rpc<GetAllAppointmentsResponse[]>(
      'get_all_appointments'
    ) as RPCResponse<GetAllAppointmentsResponse[]>;
    
    if (error) throw error;
    return data || [];
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
    const { data, error } = await supabase.rpc<InsertAppointmentResponse>(
      'insert_appointment',
      {
        p_name: appointmentData.name,
        p_email: appointmentData.email,
        p_phone: appointmentData.phone,
        p_date: appointmentData.date,
        p_time: appointmentData.time,
        p_details: appointmentData.details,
        p_status: 'pending'
      }
    ) as RPCResponse<InsertAppointmentResponse>;

    if (error) throw error;
    return { success: true, id: data?.id };
  } catch (error) {
    console.error('Error creating appointment:', error);
    return { success: false };
  }
}

// Update appointment status
export async function updateAppointmentStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled'): Promise<boolean> {
  try {
    const { error } = await supabase.rpc(
      'update_appointment_status',
      {
        p_id: id,
        p_status: status
      }
    ) as RPCResponse<unknown>;
    
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
    const { error } = await supabase.rpc(
      'delete_appointment',
      {
        p_id: id
      }
    ) as RPCResponse<unknown>;
    
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
    const { data, error } = await supabase.rpc<GetAppointmentCountsResponse>(
      'get_appointment_counts'
    ) as RPCResponse<GetAppointmentCountsResponse>;
    
    if (error) throw error;
    return data || { total: 0, pending: 0, confirmed: 0 };
  } catch (error) {
    console.error('Error getting appointment counts:', error);
    return { total: 0, pending: 0, confirmed: 0 };
  }
}

// Get booked time slots for a specific date
export async function getBookedSlots(date: string): Promise<string[]> {
  try {
    const { data, error } = await supabase.rpc<GetBookedSlotsResponse[]>(
      'get_booked_slots',
      {
        date_param: date
      }
    ) as RPCResponse<GetBookedSlotsResponse[]>;
    
    if (error) throw error;
    // Safely handle the data and map it properly
    return Array.isArray(data) ? data.map(slot => slot.time) : [];
  } catch (error) {
    console.error('Error getting booked slots:', error);
    return [];
  }
}
