
import { db } from '@/integrations/firebase/client';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  serverTimestamp,
} from 'firebase/firestore';
import { FirebaseContactMessage } from '@/integrations/firebase/types';
import { ContactMessage } from '@/types/contact-message';
import { toast } from 'sonner';

const COLLECTION_NAME = 'contact_messages';

export const fetchContactMessages = async (): Promise<ContactMessage[]> => {
  try {
    console.log('Attempting to fetch contact messages from Firebase');
    
    const contactMessagesRef = collection(db, COLLECTION_NAME);
    const contactMessagesQuery = query(
      contactMessagesRef,
      orderBy('created_at', 'desc')
    );
    
    const querySnapshot = await getDocs(contactMessagesQuery);
    console.log('Fetched messages count:', querySnapshot.size);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as FirebaseContactMessage;
      return {
        id: doc.id,
        name: data.name,
        phone: data.phone,
        email: data.email,
        subject: data.subject,
        message: data.message,
        created_at: data.created_at?.toDate().toISOString() || new Date().toISOString(),
        read: data.read || false
      };
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    toast.error('שגיאה בטעינת ההודעות');
    // Return empty array instead of throwing to prevent UI crashes
    return [];
  }
};

export const markMessageAsRead = async (id: string): Promise<void> => {
  try {
    const messageRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(messageRef, {
      read: true
    });
  } catch (error) {
    console.error('Error marking message as read:', error);
    toast.error('שגיאה בסימון ההודעה כנקראה');
    throw error;
  }
};

export const deleteMessage = async (id: string): Promise<void> => {
  try {
    const messageRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(messageRef);
  } catch (error) {
    console.error('Error deleting message:', error);
    toast.error('שגיאה במחיקת ההודעה');
    throw error;
  }
};

export const saveContactMessage = async (message: Omit<ContactMessage, 'id' | 'created_at' | 'read'>): Promise<boolean> => {
  try {
    console.log('Saving contact message to Firebase:', message);
    
    // Ensure we have a valid collection reference
    const contactMessagesRef = collection(db, COLLECTION_NAME);
    
    const docRef = await addDoc(contactMessagesRef, {
      ...message,
      created_at: serverTimestamp(),
      read: false
    });
    
    console.log('Contact message saved successfully with ID:', docRef.id);
    return true;
  } catch (error) {
    console.error('Error saving contact message to Firebase:', error);
    toast.error('שגיאה בשמירת ההודעה');
    // Return false to indicate error
    return false;
  }
};
