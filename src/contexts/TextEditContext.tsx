
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAdmin } from './AdminContext';
import { toast } from 'sonner';

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

// Storage key for saved texts
const STORAGE_KEY = 'edited_texts';

export const TextEditProvider = ({ children }: { children: ReactNode }) => {
  const { isAdmin } = useAdmin();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedTexts, setEditedTexts] = useState<Record<string, string>>({});

  // Load saved texts from localStorage on initial render
  useEffect(() => {
    const savedTexts = localStorage.getItem(STORAGE_KEY);
    if (savedTexts) {
      try {
        const parsedTexts = JSON.parse(savedTexts);
        setEditedTexts(parsedTexts);
        console.log('Loaded edited texts from localStorage:', parsedTexts);
      } catch (error) {
        console.error('Failed to parse saved texts', error);
      }
    }
  }, []);

  // Save texts to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(editedTexts).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(editedTexts));
      console.log('Saved edited texts to localStorage:', editedTexts);
    }
  }, [editedTexts]);

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
    } else {
      console.log('Non-admin user tried to toggle edit mode');
    }
  };

  // Update a specific text entry
  const updateText = (id: string, content: string) => {
    console.log(`Updating text with ID: ${id}, content: ${content}`);
    setEditedTexts(prev => {
      const newTexts = {
        ...prev,
        [id]: content
      };
      return newTexts;
    });
  };

  // Reset all edited texts
  const resetTexts = () => {
    setEditedTexts({});
    localStorage.removeItem(STORAGE_KEY);
    toast.success('כל הטקסטים אופסו בהצלחה');
    console.log('All texts have been reset');
  };

  return (
    <TextEditContext.Provider value={{
      editedTexts,
      isEditMode,
      toggleEditMode,
      updateText,
      resetTexts
    }}>
      {children}
    </TextEditContext.Provider>
  );
};
