
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAdmin } from './AdminContext';
import { toast } from 'sonner';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  serverTimestamp, 
  getDoc,
  writeBatch,
  runTransaction
} from 'firebase/firestore';
import { db, auth } from '@/integrations/firebase/client';

// Type for edited text items
interface EditedText {
  id: string;
  content: string;
}

// Context type definition
interface TextEditContextType {
  editedTexts: Record<string, string>;
  isEditMode: boolean;
  toggleEditMode: () => void;
  updateText: (id: string, content: string) => Promise<void>;
  resetTexts: () => void;
}

// Create context with default values
const TextEditContext = createContext<TextEditContextType>({
  editedTexts: {},
  isEditMode: false,
  toggleEditMode: () => {},
  updateText: async () => {},
  resetTexts: () => {},
});

export const useTextEdit = () => useContext(TextEditContext);

// Firebase collection name for edited texts
const COLLECTION_NAME = 'edited_texts';

export const TextEditProvider = ({ children }: { children: ReactNode }) => {
  const { isAdmin } = useAdmin();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedTexts, setEditedTexts] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load texts from Firebase on initial render
  useEffect(() => {
    const fetchTexts = async () => {
      setIsLoading(true);
      try {
        const textsCollection = collection(db, COLLECTION_NAME);
        const textsSnapshot = await getDocs(textsCollection);
        
        const textsData: Record<string, string> = {};
        textsSnapshot.forEach((doc) => {
          textsData[doc.id] = doc.data().content;
        });
        
        setEditedTexts(textsData);
        console.log('Loaded edited texts from Firebase:', textsData);
      } catch (error) {
        console.error('Failed to fetch edited texts from Firebase', error);
        toast.error('שגיאה בטעינת הטקסטים המותאמים');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTexts();
  }, []);

  // Toggle edit mode on/off with authentication check
  const toggleEditMode = () => {
    if (isAdmin) {
      // Double check if user is authenticated before toggling
      if (!auth.currentUser && !isEditMode) {
        const currentUser = auth.currentUser;
        console.log('Current user when toggling edit mode:', currentUser);
        
        toast.error('יש להתחבר כדי לערוך טקסטים');
        return;
      }
      
      const newMode = !isEditMode;
      setIsEditMode(newMode);
      if (newMode) {
        toast.info('מצב עריכה פעיל. עבור עם העכבר מעל טקסט לעריכה.');
      } else {
        toast.success('מצב עריכה כובה.');
      }
      console.log('Edit mode toggled:', newMode, 'Current user:', auth.currentUser?.uid);
    } else {
      console.log('Non-admin user tried to toggle edit mode');
      toast.error('רק מנהלים רשאים לערוך טקסטים');
    }
  };

  // Update a specific text entry in Firebase with improved error handling
  const updateText = async (id: string, content: string) => {
    if (content.trim() === '') {
      toast.error('לא ניתן לשמור טקסט ריק');
      return;
    }

    // Force immediate authentication check
    const currentUser = auth.currentUser;
    console.log('Current user when saving text:', currentUser);
    
    // Check if user is authenticated
    if (!currentUser) {
      toast.error('יש להתחבר כדי לשמור טקסטים');
      return;
    }

    // Verify user is admin for client-side check (server enforces via rules)
    if (!isAdmin) {
      toast.error('רק מנהלים רשאים לשמור טקסטים');
      return;
    }

    console.log(`Updating text with ID: ${id}, content: ${content}`);
    
    try {
      // Try using a transaction for better atomicity
      await runTransaction(db, async (transaction) => {
        const docRef = doc(db, COLLECTION_NAME, id);
        
        // Set minimally required data
        const dataToUpdate = { 
          content,
          updated_at: serverTimestamp(),
          updated_by: currentUser.uid
        };
        
        // In a transaction, we must check if the document exists
        const docSnapshot = await transaction.get(docRef);
        
        if (!docSnapshot.exists()) {
          // For new documents, add creation date
          dataToUpdate['created_at'] = serverTimestamp();
          dataToUpdate['created_by'] = currentUser.uid;
        }
        
        transaction.set(docRef, dataToUpdate, { merge: true });
      });
      
      // Update local state after successful transaction
      setEditedTexts(prev => ({
        ...prev,
        [id]: content
      }));
      
      console.log(`Saved text with ID: ${id}, new content: ${content}`);
      toast.success('הטקסט נשמר בהצלחה');
    } catch (error) {
      console.error('Error saving text to Firebase:', error);
      
      // Show more detailed error message
      let errorMessage = 'שגיאה בשמירת הטקסט';
      if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
        console.log('Error details:', error);
      }
      
      toast.error(errorMessage);
      
      // Try a fallback direct approach if transaction failed
      try {
        console.log('Trying fallback direct document write...');
        const docRef = doc(db, COLLECTION_NAME, id);
        
        await setDoc(docRef, { 
          content,
          updated_at: serverTimestamp(),
          updated_by: currentUser.uid
        }, { merge: true });
        
        setEditedTexts(prev => ({
          ...prev,
          [id]: content
        }));
        
        console.log('Fallback write succeeded');
        toast.success('הטקסט נשמר בהצלחה (באמצעות שיטה חלופית)');
      } catch (fallbackError) {
        console.error('Fallback write also failed:', fallbackError);
      }
    }
  };

  // Reset all edited texts in Firebase with improved error handling
  const resetTexts = async () => {
    // Check if user is authenticated
    if (!auth.currentUser) {
      toast.error('יש להתחבר כדי לאפס טקסטים');
      return;
    }

    // Verify user is admin
    if (!isAdmin) {
      toast.error('רק מנהלים רשאים לאפס טקסטים');
      return;
    }

    try {
      // Use batch write for better performance and atomicity
      const textsCollection = collection(db, COLLECTION_NAME);
      const textsSnapshot = await getDocs(textsCollection);
      
      if (textsSnapshot.empty) {
        toast.info('אין טקסטים לאיפוס');
        return;
      }
      
      const batch = writeBatch(db);
      
      textsSnapshot.docs.forEach(document => {
        batch.delete(document.ref);
      });
      
      await batch.commit();
      
      // Clear local state
      setEditedTexts({});
      toast.success('כל הטקסטים אופסו בהצלחה');
      console.log('All texts have been reset');
    } catch (error) {
      console.error('Error resetting texts:', error);
      
      // Show more detailed error message
      let errorMessage = 'שגיאה באיפוס הטקסטים';
      if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
      }
      
      toast.error(errorMessage);
    }
  };

  const contextValue = {
    editedTexts,
    isEditMode,
    toggleEditMode,
    updateText,
    resetTexts
  };

  // Show loading indicator while fetching texts
  if (isLoading) {
    return <>{children}</>;
  }

  return (
    <TextEditContext.Provider value={contextValue}>
      {children}
    </TextEditContext.Provider>
  );
};
