import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getArticleComments, addComment, Comment } from '@/services/articleService';
import { Loader2 } from 'lucide-react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';

interface CommentSectionProps {
  articleId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ articleId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch comments and set up listener
  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      const fetchedComments = await getArticleComments(articleId);
      setComments(fetchedComments);
      setIsLoading(false);
    };

    fetchComments();

    // Set up realtime subscription for comments
    const commentsRef = collection(db, 'comments');
    const commentsQuery = query(
      commentsRef, 
      where('article_id', '==', articleId),
      orderBy('created_at', 'desc')
    );
    
    const unsubscribe = onSnapshot(commentsQuery, async () => {
      const freshComments = await getArticleComments(articleId);
      setComments(freshComments);
    });

    return () => {
      unsubscribe();
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
      const result = await addComment(articleId, user.uid, newComment);
      
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
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
            <div key={comment.id} className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10 border border-gray-200 shadow-sm">
                  <AvatarImage src="" alt="" />
                  <AvatarFallback className="bg-law-navy text-white">
                    {comment.user_name ? getInitials(comment.user_name) : 'אנ'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-law-navy">{comment.user_name || 'משתמש אנונימי'}</span>
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
