
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { addComment } from '@/services/articleService';
import { Loader2 } from 'lucide-react';

interface CommentFormProps {
  articleId: string;
  onCommentAdded: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ articleId, onCommentAdded }) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  // Check authentication status
  React.useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setUser(data.session.user);
      }
    };

    checkAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'התחברות נדרשת',
        description: 'יש להתחבר כדי להוסיף תגובה',
        variant: 'destructive'
      });
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: 'שגיאה',
        description: 'לא ניתן לשלוח תגובה ריקה',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await addComment(articleId, user.id, newComment);
      
      if (result) {
        setNewComment('');
        toast({
          title: 'התגובה נוספה בהצלחה',
          variant: 'default'
        });
        onCommentAdded();
      } else {
        throw new Error('Failed to add comment');
      }
    } catch (error) {
      toast({
        title: 'שגיאה',
        description: 'אירעה שגיאה בהוספת התגובה',
        variant: 'destructive'
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
