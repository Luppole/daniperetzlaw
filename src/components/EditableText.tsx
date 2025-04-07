
import React, { useState, useRef, useEffect } from 'react';
import { Edit, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTextEdit } from '@/contexts/TextEditContext';
import { cn } from '@/lib/utils';
import { useAdmin } from '@/contexts/AdminContext';
import { 
  HoverCard,
  HoverCardTrigger,
  HoverCardContent
} from '@/components/ui/hover-card';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { auth } from '@/integrations/firebase/client';

interface EditableTextProps {
  id: string;
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

export const EditableText: React.FC<EditableTextProps> = ({ 
  id,
  children, 
  as: Component = 'div',
  className
}) => {
  const { isAdmin } = useAdmin();
  const { editedTexts, isEditMode, updateText } = useTextEdit();
  const [isEditing, setIsEditing] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();

  // Get the current text content from either edited texts or children
  const displayText = editedTexts[id] !== undefined ? 
    editedTexts[id] : 
    (typeof children === 'string' ? children : '');

  // Setup the editor when entering edit mode
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      // Set initial text and focus the textarea
      setCurrentText(displayText);
      textareaRef.current.focus();
      textareaRef.current.select();
      console.log(`Editing text with ID: ${id}, current content: ${displayText}`);
    }
  }, [isEditing, displayText, id]);

  // Check authentication status
  const isAuthenticated = !!auth.currentUser;

  // Cancel editing and reset
  const handleCancel = () => {
    setIsEditing(false);
    setCurrentText('');
    console.log(`Cancelled editing text with ID: ${id}`);
  };

  // Save the edited text
  const handleSave = async () => {
    if (currentText.trim() === '') {
      toast.error('לא ניתן לשמור טקסט ריק');
      return;
    }
    
    // Check if the user is authenticated before saving
    if (!isAuthenticated) {
      toast.error('יש להתחבר כדי לשמור טקסטים');
      setIsEditing(false);
      return;
    }

    try {
      setIsSaving(true);
      await updateText(id, currentText);
      console.log(`Saved text with ID: ${id}, new content: ${currentText}`);
    } catch (error) {
      console.error(`Error saving text with ID: ${id}`, error);
      toast.error('שגיאה בשמירת הטקסט');
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  // Start editing
  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent triggering parent click events
    
    // Check if the user is authenticated before editing
    if (!isAuthenticated) {
      toast.error('יש להתחבר כדי לערוך טקסטים');
      return;
    }
    
    setIsEditing(true);
    console.log(`Started editing text with ID: ${id}`);
  };

  // If admin and edit mode is on, show editable content
  if (isAdmin && isEditMode) {
    if (isEditing) {
      return (
        <div className="relative border border-dashed border-law-navy p-2 rounded-md">
          <Textarea
            ref={textareaRef}
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
            className="min-h-[100px] w-full resize-y"
            disabled={isSaving}
          />
          <div className="flex justify-end gap-2 mt-2">
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={handleCancel}
              className="text-red-500 hover:text-red-700 hover:bg-red-100"
              disabled={isSaving}
            >
              <X className="h-4 w-4 mr-1" /> ביטול
            </Button>
            <Button 
              size="sm" 
              onClick={handleSave}
              className="bg-law-navy hover:bg-law-navy/90"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-l-transparent"></span>
                  שומר...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-1" /> שמור
                </>
              )}
            </Button>
          </div>
        </div>
      );
    }

    // Different UI for mobile vs desktop
    if (isMobile) {
      return (
        <Component 
          className={cn(
            className,
            "group relative cursor-pointer border border-dashed border-law-navy/70 bg-law-navy/5 rounded-sm p-2"
          )}
          onClick={handleEdit}
        >
          <div className="flex items-start gap-2">
            <div className="flex-1">{displayText}</div>
            <Button
              size="icon"
              variant="outline"
              className="h-6 w-6 rounded-full shrink-0 border-law-navy text-law-navy"
            >
              <Edit className="h-3 w-3" />
            </Button>
          </div>
        </Component>
      );
    }

    return (
      <HoverCard openDelay={100} closeDelay={100}>
        <HoverCardTrigger asChild>
          <Component 
            className={cn(
              className,
              "group relative cursor-pointer border border-transparent hover:border-dashed hover:border-law-navy/50 hover:bg-law-navy/5 rounded-sm transition-all p-1"
            )}
          >
            {displayText}
            <Button
              size="icon"
              variant="ghost"
              onClick={handleEdit}
              className="absolute left-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity bg-law-navy text-white hover:bg-law-navy/80 rounded-full h-6 w-6"
            >
              <Edit className="h-3 w-3" />
            </Button>
          </Component>
        </HoverCardTrigger>
        <HoverCardContent className="w-auto p-2">
          <span className="text-xs">לחץ לעריכת הטקסט</span>
        </HoverCardContent>
      </HoverCard>
    );
  }

  // For regular view or non-admins, just display the text
  return (
    <Component className={className}>
      {editedTexts[id] !== undefined ? editedTexts[id] : children}
    </Component>
  );
};
