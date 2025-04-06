
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { auth } from '@/integrations/firebase/client';
import { addComment } from '@/services/commentService';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface CommentFormProps {
  articleId: string;
  onCommentAdded: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ articleId, onCommentAdded }) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast('התחברות נדרשת', {
        description: 'יש להתחבר כדי להוסיף תגובה',
        action: {
          label: 'התחבר',
          onClick: () => window.location.href = '/auth',
        },
      });
      return;
    }

    if (!newComment.trim()) {
      toast('שגיאה', {
        description: 'לא ניתן לשלוח תגובה ריקה',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Submitting comment for article:', articleId, 'User ID:', user.uid);
      const result = await addComment(articleId, user.uid, newComment);
      
      if (result) {
        setNewComment('');
        toast('התגובה נוספה בהצלחה');
        // Make sure we call this to refresh the comments list
        onCommentAdded();
      } else {
        throw new Error('Failed to add comment');
      }
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast('שגיאה', {
        description: `אירעה שגיאה בהוספת התגובה: ${error.message}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmitComment} className="mb-8">
      <Textarea
        placeholder={user ? "הוסף את התגובה שלך..." : "יש להתחבר כדי להוסיף תגובה"}
        className="mb-3 min-h-[100px] font-heebo"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        disabled={!user || isSubmitting}
      />
      <div className="flex justify-end">
        <Button 
          type="submit" 
          className="bg-law-navy hover:bg-law-navy/90 font-heebo"
          disabled={!user || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              שולח...
            </>
          ) : 'שלח תגובה'}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
