
import React, { createContext, useContext, useState, ReactNode } from 'react';

type DraggableInfo = {
  isDragging: boolean;
  content: string;
};

type DraggableInfoContextType = {
  draggableInfo: DraggableInfo;
  setDraggableInfo: React.Dispatch<React.SetStateAction<DraggableInfo>>;
};

const DraggableInfoContext = createContext<DraggableInfoContextType | undefined>(undefined);

export const DraggableInfoProvider = ({ children }: { children: ReactNode }) => {
  const [draggableInfo, setDraggableInfo] = useState<DraggableInfo>({
    isDragging: false,
    content: '',
  });

  return (
    <DraggableInfoContext.Provider value={{ draggableInfo, setDraggableInfo }}>
      {children}
    </DraggableInfoContext.Provider>
  );
};

export const useDraggableInfo = () => {
  const context = useContext(DraggableInfoContext);
  if (context === undefined) {
    throw new Error('useDraggableInfo must be used within a DraggableInfoProvider');
  }
  return context;
};
