
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, Trash2, UserCircle } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';

type Comment = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  };
};

type CommentSectionProps = {
  articleId: string;
};

export function CommentSection({ articleId }: CommentSectionProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
    
    // Set up a subscription to listen for new comments
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `article_id=eq.${articleId}`,
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

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles:profiles(full_name, avatar_url)
        `)
        .eq('article_id', articleId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setComments(data as Comment[]);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('שגיאה בטעינת התגובות');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      toast.error('עליך להתחבר כדי להוסיף תגובה');
      navigate('/auth');
      return;
    }

    if (!newComment.trim()) {
      toast.error('לא ניתן לשלוח תגובה ריקה');
      return;
    }

    setIsSending(true);
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          article_id: articleId,
          content: newComment.trim(),
          user_id: user.id,
        });

      if (error) {
        throw error;
      }

      setNewComment('');
      toast.success('התגובה נשלחה בהצלחה');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('שגיאה בשליחת התגובה');
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user) return;

    setIsDeleting(commentId);
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      toast.success('התגובה נמחקה בהצלחה');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('שגיאה במחיקת התגובה');
    } finally {
      setIsDeleting(null);
    }
  };

  const formatCommentDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: he,
      });
    } catch (error) {
      return 'תאריך לא ידוע';
    }
  };

  const getUserInitials = (name: string | null) => {
    if (!name) return '??';
    
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="w-full">
      <h3 className="text-2xl font-bold text-law-navy mb-6">תגובות</h3>
      
      {/* Add new comment */}
      <div className="mb-8">
        <div className="flex items-start space-x-4 space-x-reverse">
          {user ? (
            <Avatar className="h-10 w-10 border-2 border-law-navy">
              <AvatarImage src={user.user_metadata.avatar_url} />
              <AvatarFallback className="bg-law-navy text-white">
                {getUserInitials(user.user_metadata.full_name || user.email)}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-500">
              <UserCircle className="h-6 w-6" />
            </div>
          )}
          <div className="flex-1">
            <Textarea
              placeholder={user ? "כתוב תגובה..." : "התחבר כדי להגיב"}
              className="mb-2 resize-none"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={!user || isSending}
            />
            <div className="flex justify-end">
              <Button
                className="bg-law-navy hover:bg-law-navy/90"
                onClick={handleAddComment}
                disabled={!user || isSending || !newComment.trim()}
              >
                {isSending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    שולח...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    שלח תגובה
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-law-navy" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            אין תגובות עדיין. היה הראשון להגיב!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start space-x-4 space-x-reverse">
                <Avatar className="h-10 w-10 border-2 border-law-navy">
                  <AvatarImage src={comment.profiles.avatar_url || undefined} />
                  <AvatarFallback className="bg-law-navy text-white">
                    {getUserInitials(comment.profiles.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-law-navy">
                        {comment.profiles.full_name || 'משתמש'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatCommentDate(comment.created_at)}
                      </div>
                    </div>
                    {user && user.id === comment.user_id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteComment(comment.id)}
                        disabled={isDeleting === comment.id}
                      >
                        {isDeleting === comment.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                  <p className="mt-1 text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
