
import React, { useEffect, useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, Loader2, Trash2 } from 'lucide-react';
import { collection, getDocs, doc, query, orderBy, getDoc } from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { getArticleById } from '@/services/articleService';
import { FirebaseComment } from '@/integrations/firebase/types';
import { deleteComment } from '@/services/commentService';
import { Timestamp, onSnapshot } from 'firebase/firestore';

type CommentWithArticle = {
  id: string;
  content: string;
  user_name: string;
  user_id: string;
  created_at: string;
  article_id: string;
  article_title: string;
};

export function AdminComments() {
  const [comments, setComments] = useState<CommentWithArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<CommentWithArticle | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      // Fetch comments from Firestore
      const commentsRef = collection(db, 'comments');
      const commentsQuery = query(commentsRef, orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(commentsQuery);
      
      if (querySnapshot.empty) {
        setComments([]);
        setIsLoading(false);
        return;
      }
      
      // Process each comment
      const commentsData: CommentWithArticle[] = [];
      
      for (const commentDoc of querySnapshot.docs) {
        const commentData = commentDoc.data() as FirebaseComment;
        
        // Get article title
        let articleTitle = 'מאמר לא מזוהה';
        try {
          const article = await getArticleById(commentData.article_id);
          if (article) {
            articleTitle = article.title;
          }
        } catch (error) {
          console.error('Error fetching article:', error);
        }
        
        // Get user name
        let userName = 'משתמש אנונימי';
        try {
          const userDoc = await getDoc(doc(db, 'profiles', commentData.user_id));
          if (userDoc.exists()) {
            userName = userDoc.data().full_name || 'משתמש אנונימי';
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
        
        // Format the created_at timestamp
        const createdAt = commentData.created_at instanceof Timestamp 
          ? commentData.created_at.toDate().toISOString()
          : new Date().toISOString();
        
        commentsData.push({
          id: commentDoc.id,
          content: commentData.content,
          user_name: userName,
          user_id: commentData.user_id,
          created_at: createdAt,
          article_id: commentData.article_id,
          article_title: articleTitle,
        });
      }
      
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('שגיאה בטעינת התגובות');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();

    // Set up realtime subscription
    const commentsRef = collection(db, 'comments');
    const commentsQuery = query(commentsRef, orderBy('created_at', 'desc'));
    
    const unsubscribe = onSnapshot(commentsQuery, () => {
      fetchComments();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleDelete = async () => {
    if (!commentToDelete) return;
    
    setIsDeleting(true);
    try {
      const success = await deleteComment(commentToDelete.id);
      
      if (success) {
        setComments(comments.filter(comment => comment.id !== commentToDelete.id));
        setDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('שגיאה במחיקת התגובה');
    } finally {
      setIsDeleting(false);
      setCommentToDelete(null);
    }
  };

  const confirmDelete = (comment: CommentWithArticle) => {
    setCommentToDelete(comment);
    setDeleteDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd בMMM yyyy, HH:mm', { locale: he });
    } catch (error) {
      return dateString;
    }
  };

  const truncateContent = (content: string, maxLength = 50) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-law-navy">ניהול תגובות</h2>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">אין תגובות להצגה</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>מאמר</TableHead>
                <TableHead>תגובה</TableHead>
                <TableHead>משתמש</TableHead>
                <TableHead>תאריך</TableHead>
                <TableHead className="text-left">פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell>
                    <Badge variant="outline" className="bg-gray-50 hover:bg-gray-100">
                      {truncateContent(comment.article_title, 20)}
                    </Badge>
                  </TableCell>
                  <TableCell>{truncateContent(comment.content)}</TableCell>
                  <TableCell>{comment.user_name}</TableCell>
                  <TableCell>{formatDate(comment.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => window.open(`/article/${comment.article_id}`, '_blank')}
                        title="צפה במאמר"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => confirmDelete(comment)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        title="מחק תגובה"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>האם אתה בטוח שברצונך למחוק את התגובה?</DialogTitle>
            <DialogDescription>
              פעולה זו לא ניתנת לביטול. התגובה תימחק לצמיתות מהמערכת.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              ביטול
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  מוחק...
                </>
              ) : 'מחק'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
