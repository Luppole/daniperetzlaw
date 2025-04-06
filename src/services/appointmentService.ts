
import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';
import { Appointment } from '@/types/appointments';
import { FirebaseAppointment } from '@/integrations/firebase/types';

// Helper function to convert Firestore document to Appointment type
const convertFirestoreAppointmentToAppointment = (
  doc: FirebaseAppointment & { id: string }
): Appointment => {
  return {
    id: doc.id,
    name: doc.name,
    email: doc.email,
    phone: doc.phone,
    date: doc.date,
    time: doc.time,
    details: doc.details,
    status: doc.status,
    created_at: doc.created_at.toDate().toISOString()
  };
};

// Fetch all appointments
export async function getAllAppointments(): Promise<Appointment[]> {
  try {
    console.log('Fetching all appointments...');
    
    const appointmentsRef = collection(db, 'appointments');
    const appointmentsQuery = query(appointmentsRef, orderBy('date', 'asc'));
    const querySnapshot = await getDocs(appointmentsQuery);
    
    const appointments: Appointment[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as FirebaseAppointment;
      appointments.push(convertFirestoreAppointmentToAppointment({
        ...data,
        id: doc.id
      }));
    });
    
    return appointments;
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
    
    const firestoreAppointment: Omit<FirebaseAppointment, 'id'> = {
      ...appointmentData,
      status: 'pending',
      created_at: serverTimestamp() as any
    };
    
    const docRef = await addDoc(collection(db, 'appointments'), firestoreAppointment);
    
    console.log('Appointment created successfully:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating appointment:', error);
    return { success: false };
  }
}

// Update appointment status
export async function updateAppointmentStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled'): Promise<boolean> {
  try {
    console.log(`Updating appointment ${id} status to ${status}`);
    
    const appointmentRef = doc(db, 'appointments', id);
    await updateDoc(appointmentRef, { status });
    
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
    
    await deleteDoc(doc(db, 'appointments', id));
    
    return true;
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return false;
  }
}

// Get appointment counts for dashboard
export async function getAppointmentCounts(): Promise<{ total: number; pending: number; confirmed: number; }> {
  try {
    const appointmentsRef = collection(db, 'appointments');
    const querySnapshot = await getDocs(appointmentsRef);
    
    let total = 0;
    let pending = 0;
    let confirmed = 0;
    
    querySnapshot.forEach((doc) => {
      const appointment = doc.data() as FirebaseAppointment;
      total++;
      
      if (appointment.status === 'pending') {
        pending++;
      } else if (appointment.status === 'confirmed') {
        confirmed++;
      }
    });
    
    return { total, pending, confirmed };
  } catch (error) {
    console.error('Error getting appointment counts:', error);
    return { total: 0, pending: 0, confirmed: 0 };
  }
}

// Get booked time slots for a specific date
export async function getBookedSlots(date: string): Promise<string[]> {
  try {
    console.log('Fetching booked slots for date:', date);
    
    const appointmentsRef = collection(db, 'appointments');
    const appointmentsQuery = query(
      appointmentsRef, 
      where('date', '==', date),
      where('status', 'in', ['pending', 'confirmed'])
    );
    
    const querySnapshot = await getDocs(appointmentsQuery);
    
    const bookedSlots: string[] = [];
    querySnapshot.forEach((doc) => {
      const appointment = doc.data() as FirebaseAppointment;
      if (appointment.time) {
        bookedSlots.push(appointment.time);
      }
    });
    
    console.log('Booked slots:', bookedSlots);
    return bookedSlots;
  } catch (error) {
    console.error('Error getting booked slots:', error);
    return [];
  }
}
