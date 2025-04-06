
import { supabase } from '@/integrations/supabase/client';
import { Appointment } from '@/types/appointments';

// Fetch all appointments
export async function getAllAppointments(): Promise<Appointment[]> {
  try {
    console.log('Fetching all appointments...');
    
    // Use an untyped query to avoid TypeScript errors
    const query = `SELECT * FROM appointments ORDER BY date ASC, time ASC`;
    const { data, error } = await supabase.rpc('get_all_appointments').catch(async () => {
      // Fallback to direct query if RPC fails
      return await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      }).catch(async () => {
        // If OAuth fails, use a simple select (this will actually run in most cases)
        return await supabase.from('appointments').select('*').order('date').order('time');
      });
    });
    
    if (error) {
      console.error('Supabase error fetching appointments:', error);
      throw error;
    }
    
    // Safely cast the data to Appointment[] type
    return ((data || []) as unknown) as Appointment[];
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
    
    // Try RPC first, then fall back to direct insert
    const result = await supabase.rpc('insert_appointment', {
      p_name: appointmentData.name,
      p_email: appointmentData.email,
      p_phone: appointmentData.phone,
      p_date: appointmentData.date,
      p_time: appointmentData.time,
      p_details: appointmentData.details || ''
    }).catch(async () => {
      // Use a direct SQL insert as fallback
      return await supabase.from('appointments').insert({
        name: appointmentData.name,
        email: appointmentData.email,
        phone: appointmentData.phone,
        date: appointmentData.date,
        time: appointmentData.time,
        details: appointmentData.details || '',
        status: 'pending'
      } as unknown as any).select('id').single();
    });

    const { data, error } = result;

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
    
    // Try RPC first, then fall back to direct update
    const { error } = await supabase.rpc('update_appointment_status', {
      p_id: id,
      p_status: status
    }).catch(async () => {
      // Direct update as fallback
      return await supabase.from('appointments').update({
        status
      } as unknown as any).eq('id', id);
    });
    
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
    
    // Try RPC first, then fall back to direct delete
    const { error } = await supabase.rpc('delete_appointment', {
      p_id: id
    }).catch(async () => {
      // Direct delete as fallback
      return await supabase.from('appointments').delete().eq('id', id);
    });
    
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
    // Try RPC first, then fall back to direct queries
    const result = await supabase.rpc('get_appointment_counts').catch(async () => {
      // Direct queries as fallback
      let total = 0, pending = 0, confirmed = 0;
      
      // Get total count
      const totalResult = await supabase.from('appointments').select('id', { count: 'exact' });
      if (!totalResult.error) {
        total = totalResult.count || 0;
      }
      
      // Get pending count
      const pendingResult = await supabase.from('appointments').select('id', { count: 'exact' }).eq('status', 'pending');
      if (!pendingResult.error) {
        pending = pendingResult.count || 0;
      }
      
      // Get confirmed count
      const confirmedResult = await supabase.from('appointments').select('id', { count: 'exact' }).eq('status', 'confirmed');
      if (!confirmedResult.error) {
        confirmed = confirmedResult.count || 0;
      }
      
      return { data: { total, pending, confirmed }, error: null };
    });
    
    const { data, error } = result;
    
    if (error) {
      throw error;
    }
    
    return {
      total: data?.total || 0,
      pending: data?.pending || 0,
      confirmed: data?.confirmed || 0
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
    
    // Try RPC first, then fall back to direct query
    const result = await supabase.rpc('get_booked_slots', {
      date_param: date
    }).catch(async () => {
      // Direct query as fallback
      return await supabase.from('appointments').select('time')
        .eq('date', date)
        .in('status', ['confirmed', 'pending']);
    });
    
    const { data, error } = result;
    
    if (error) {
      console.error('Supabase error fetching booked slots:', error);
      throw error;
    }
    
    console.log('Received booked slots data:', data);
    // Safely extract time values
    const bookedSlots = Array.isArray(data) 
      ? data.map(slot => (slot as any).time).filter(Boolean) 
      : [];
    console.log('Booked slots:', bookedSlots);
    return bookedSlots;
  } catch (error) {
    console.error('Error getting booked slots:', error);
    return [];
  }
}
