
import { supabase } from '@/integrations/supabase/client';
import { Appointment } from '@/types/appointments';

// Type-safe approach to working with appointments
type AppointmentResult = { data: Appointment[] | null; error: any };
type AppointmentSingleResult = { data: Appointment | null; error: any };
type AppointmentCountResult = { data: { total: number; pending: number; confirmed: number; } | null; error: any };
type BookedSlotsResult = { data: string[] | null; error: any };

// Fetch all appointments
export async function getAllAppointments(): Promise<Appointment[]> {
  try {
    console.log('Fetching all appointments...');
    
    // Use RPC to avoid type issues
    const { data, error } = await supabase.rpc('get_all_appointments') as unknown as AppointmentResult;
    
    if (error) {
      console.error('Supabase error fetching appointments:', error);
      
      // Try direct SQL as fallback (but handle the type safety)
      try {
        const result = await supabase.rpc('get_all_appointments_direct_sql') as unknown as AppointmentResult;
        if (result.error) {
          throw result.error;
        }
        return result.data || [];
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        // Last resort - empty array with proper typing
        return [];
      }
    }
    
    // Type cast data to Appointment[] 
    return data || [];
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
}

// Create a new appointment - using direct insert with RPC
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
    
    // Try RPC for type safety
    const { data, error } = await supabase.rpc('insert_appointment', {
      p_name: appointmentData.name,
      p_email: appointmentData.email,
      p_phone: appointmentData.phone,
      p_date: appointmentData.date,
      p_time: appointmentData.time,
      p_details: appointmentData.details || ''
    }) as unknown as { data: {id: string} | null; error: any };

    if (error) {
      console.error('RPC error creating appointment:', error);
      
      // Fallback to SQL procedure (bypassing type checks)
      try {
        const result = await supabase.rpc('insert_appointment_direct_sql', {
          data: JSON.stringify(appointmentData)
        }) as unknown as { data: {id: string} | null; error: any };
        
        if (result.error) {
          throw result.error;
        }
        
        return { success: true, id: result.data?.id };
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        return { success: false };
      }
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
    
    // Try RPC first
    const { error } = await supabase.rpc('update_appointment_status', {
      p_id: id,
      p_status: status
    });
    
    if (error) {
      console.error('RPC error updating appointment status:', error);
      
      // Fallback to SQL procedure
      try {
        const result = await supabase.rpc('update_appointment_status_direct_sql', {
          p_id: id,
          p_status: status
        });
        
        if (result.error) {
          throw result.error;
        }
        
        return true;
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        return false;
      }
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
    
    // Try RPC
    const { error } = await supabase.rpc('delete_appointment', {
      p_id: id
    });
    
    if (error) {
      console.error('RPC error deleting appointment:', error);
      
      // Fallback
      try {
        const result = await supabase.rpc('delete_appointment_direct_sql', {
          p_id: id
        });
        
        if (result.error) {
          throw result.error;
        }
        
        return true;
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        return false;
      }
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
    // Try RPC
    const { data, error } = await supabase.rpc('get_appointment_counts') as unknown as AppointmentCountResult;
    
    if (error) {
      console.error('RPC error getting appointment counts:', error);
      
      // Fallback
      try {
        const result = await supabase.rpc('get_appointment_counts_direct_sql') as unknown as AppointmentCountResult;
        
        if (result.error) {
          throw result.error;
        }
        
        return result.data || { total: 0, pending: 0, confirmed: 0 };
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        return { total: 0, pending: 0, confirmed: 0 };
      }
    }
    
    return data || { total: 0, pending: 0, confirmed: 0 };
  } catch (error) {
    console.error('Error getting appointment counts:', error);
    return { total: 0, pending: 0, confirmed: 0 };
  }
}

// Get booked time slots for a specific date
export async function getBookedSlots(date: string): Promise<string[]> {
  try {
    console.log('Fetching booked slots for date:', date);
    
    // Try RPC
    const { data, error } = await supabase.rpc('get_booked_slots', {
      date_param: date
    }) as unknown as BookedSlotsResult;
    
    if (error) {
      console.error('RPC error fetching booked slots:', error);
      
      // Fallback
      try {
        const result = await supabase.rpc('get_booked_slots_direct_sql', {
          date_param: date
        }) as unknown as BookedSlotsResult;
        
        if (result.error) {
          throw result.error;
        }
        
        return result.data || [];
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        return [];
      }
    }
    
    // Extract time values safely
    const bookedSlots = Array.isArray(data) ? data : [];
    console.log('Booked slots:', bookedSlots);
    return bookedSlots;
  } catch (error) {
    console.error('Error getting booked slots:', error);
    return [];
  }
}
