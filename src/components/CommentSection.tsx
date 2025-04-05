
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

type Comment = {
  id: string;
  content: string;
  user_id: string;
  article_id: string;
  created_at: string;
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
  };
};

interface CommentSectionProps {
  articleId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ articleId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles:user_id(full_name, avatar_url)
        `)
        .eq('article_id', articleId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Cast the data with proper type handling for the profiles relation
      const typedComments = data.map(comment => ({
        ...comment,
        profiles: comment.profiles as unknown as { full_name: string | null; avatar_url: string | null; }
      })) as Comment[];

      setComments(typedComments);
    } catch (error: any) {
      console.error('Error fetching comments:', error.message);
      toast.error('אירעה שגיאה בטעינת התגובות');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('עליך להתחבר כדי להגיב');
      return;
    }
    if (!newComment.trim()) {
      toast.error('אנא הזן תגובה');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          article_id: articleId,
          content: newComment.trim(),
          user_id: user.id,
        });

      if (error) throw error;

      toast.success('התגובה נוספה בהצלחה');
      setNewComment('');
      fetchComments();
    } catch (error: any) {
      console.error('Error adding comment:', error.message);
      toast.error('אירעה שגיאה בהוספת התגובה');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('התגובה נמחקה בהצלחה');
      fetchComments();
    } catch (error: any) {
      console.error('Error deleting comment:', error.message);
      toast.error('אירעה שגיאה במחיקת התגובה');
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-law-navy">תגובות</h2>

      {user && (
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <h3 className="text-lg font-semibold">הוסף תגובה</h3>
          </CardHeader>
          <form onSubmit={handleSubmitComment}>
            <CardContent>
              <Textarea
                placeholder="כתוב את התגובה שלך כאן..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px]"
              />
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="bg-law-navy hover:bg-law-navy/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    שולח...
                  </>
                ) : 'שלח תגובה'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center my-6">
          <Loader2 className="h-8 w-8 animate-spin text-law-navy" />
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id} className="overflow-hidden">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src={comment.profiles?.avatar_url || undefined} alt={comment.profiles?.full_name || 'משתמש'} />
                    <AvatarFallback>{comment.profiles?.full_name?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="font-medium">{comment.profiles?.full_name || 'משתמש אנונימי'}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: he })}
                        </p>
                      </div>
                      {user && user.id === comment.user_id && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          מחק
                        </Button>
                      )}
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground my-6">אין תגובות עדיין. היה הראשון להגיב!</p>
      )}

      {!user && (
        <div className="text-center my-6 bg-gray-50 p-4 rounded-lg">
          <p className="text-muted-foreground">יש להתחבר כדי להוסיף תגובה</p>
          <Button 
            variant="outline" 
            className="mt-2 border-law-navy text-law-navy hover:bg-law-navy/10"
            onClick={() => window.location.href = '/auth'}
          >
            התחברות / הרשמה
          </Button>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
