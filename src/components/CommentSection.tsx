
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getArticleComments, addComment, Comment } from '@/services/articleService';
import { Loader2 } from 'lucide-react';

interface CommentSectionProps {
  articleId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ articleId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  // Check authentication status
  useEffect(() => {
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

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      const fetchedComments = await getArticleComments(articleId);
      setComments(fetchedComments);
      setIsLoading(false);
    };

    fetchComments();

    // Set up realtime subscription for comments
    const channel = supabase
      .channel('comments-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'comments',
          filter: `article_id=eq.${articleId}`
        }, 
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [articleId]);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="mt-12 pt-6 border-t border-gray-200">
      <h3 className="text-xl font-bold mb-6 text-law-navy">תגובות</h3>
      
      {/* Comment Form */}
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
      
      {/* Comments List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-law-navy" />
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10 border border-gray-200">
                  <AvatarImage src="" alt="" />
                  <AvatarFallback className="bg-law-navy text-white">
                    {comment.user_id.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-law-navy">משתמש</span>
                    <span className="text-sm text-gray-500">{formatDate(comment.created_at)}</span>
                  </div>
                  <p className="text-gray-700 font-heebo">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500 font-heebo">אין תגובות עדיין. היה הראשון להגיב!</p>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
