
import React, { useState } from 'react';
import { deleteComment } from '@/services/commentService';
import { toast } from 'sonner';
import { CommentWithArticle } from '@/types/comment';
import { CommentDataProvider } from './comments/CommentDataProvider';
import { CommentTable } from './comments/CommentTable';
import { CommentTableSkeleton } from './comments/CommentTableSkeleton';
import { DeleteCommentDialog } from './comments/DeleteCommentDialog';
import { useAdmin } from '@/contexts/AdminContext';
import { db } from '@/integrations/firebase/client';
import { doc, deleteDoc } from 'firebase/firestore';

export function AdminComments() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<CommentWithArticle | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { isAdmin } = useAdmin();

  const confirmDelete = (comment: CommentWithArticle) => {
    setCommentToDelete(comment);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!commentToDelete) return;
    
    setIsDeleting(true);
    try {
      // Admin bypass: directly delete from Firestore instead of using the service function
      // This is necessary because the security rules will allow admins to delete any comment
      if (isAdmin) {
        await deleteDoc(doc(db, 'comments', commentToDelete.id));
        toast.success('התגובה נמחקה בהצלחה');
        setDeleteDialogOpen(false);
      } else {
        // For regular users, use the service function which checks ownership
        const success = await deleteComment(commentToDelete.id);
        if (success) {
          setDeleteDialogOpen(false);
        }
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('שגיאה במחיקת התגובה');
    } finally {
      setIsDeleting(false);
      setCommentToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-law-navy">ניהול תגובות</h2>
      </div>

      <CommentDataProvider>
        {({ comments, isLoading }) => (
          <>
            {isLoading ? (
              <CommentTableSkeleton />
            ) : comments.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">אין תגובות להצגה</p>
              </div>
            ) : (
              <CommentTable 
                comments={comments} 
                onDelete={confirmDelete} 
              />
            )}
          </>
        )}
      </CommentDataProvider>

      {/* Delete Confirmation Dialog */}
      <DeleteCommentDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
