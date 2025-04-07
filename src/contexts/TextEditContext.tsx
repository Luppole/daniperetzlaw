
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAdmin } from './AdminContext';
import { toast } from 'sonner';
import { collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';

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
  updateText: (id: string, content: string) => void;
  resetTexts: () => void;
}

// Create context with default values
const TextEditContext = createContext<TextEditContextType>({
  editedTexts: {},
  isEditMode: false,
  toggleEditMode: () => {},
  updateText: () => {},
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

  // Toggle edit mode on/off
  const toggleEditMode = () => {
    if (isAdmin) {
      const newMode = !isEditMode;
      setIsEditMode(newMode);
      if (newMode) {
        toast.info('מצב עריכה פעיל. עבור עם העכבר מעל טקסט לעריכה.');
      } else {
        toast.success('השינויים נשמרו בהצלחה.');
      }
      console.log('Edit mode toggled:', newMode);
    } else {
      console.log('Non-admin user tried to toggle edit mode');
    }
  };

  // Update a specific text entry in Firebase
  const updateText = async (id: string, content: string) => {
    if (content.trim() === '') {
      toast.error('לא ניתן לשמור טקסט ריק');
      return;
    }

    console.log(`Updating text with ID: ${id}, content: ${content}`);
    
    try {
      // Update in Firestore
      await setDoc(doc(db, COLLECTION_NAME, id), { 
        content,
        updated_at: new Date().toISOString(),
      });
      
      // Update local state
      setEditedTexts(prev => ({
        ...prev,
        [id]: content
      }));
      
      toast.success('הטקסט נשמר בהצלחה');
    } catch (error) {
      console.error('Error saving text to Firebase:', error);
      toast.error('שגיאה בשמירת הטקסט');
    }
  };

  // Reset all edited texts in Firebase
  const resetTexts = async () => {
    try {
      // Get all documents in the collection
      const textsCollection = collection(db, COLLECTION_NAME);
      const textsSnapshot = await getDocs(textsCollection);
      
      // Delete each document
      const deletePromises = textsSnapshot.docs.map(doc => 
        deleteDoc(doc.ref)
      );
      
      await Promise.all(deletePromises);
      
      // Clear local state
      setEditedTexts({});
      toast.success('כל הטקסטים אופסו בהצלחה');
      console.log('All texts have been reset');
    } catch (error) {
      console.error('Error resetting texts:', error);
      toast.error('שגיאה באיפוס הטקסטים');
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
