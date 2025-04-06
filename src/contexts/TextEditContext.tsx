
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAdmin } from './AdminContext';

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
        setEditedTexts(JSON.parse(savedTexts));
      } catch (error) {
        console.error('Failed to parse saved texts', error);
      }
    }
  }, []);

  // Save texts to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(editedTexts).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(editedTexts));
    }
  }, [editedTexts]);

  // Toggle edit mode on/off
  const toggleEditMode = () => {
    if (isAdmin) {
      setIsEditMode(prev => !prev);
    }
  };

  // Update a specific text entry
  const updateText = (id: string, content: string) => {
    setEditedTexts(prev => ({
      ...prev,
      [id]: content
    }));
  };

  // Reset all edited texts
  const resetTexts = () => {
    setEditedTexts({});
    localStorage.removeItem(STORAGE_KEY);
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
