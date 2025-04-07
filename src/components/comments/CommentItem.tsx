
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Comment } from '@/types/comment';
import { useAuth } from '@/contexts/AuthContext';
import { deleteComment } from '@/services/commentService';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface CommentItemProps {
  comment: Comment;
  onDelete?: () => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onDelete }) => {
  const { user } = useAuth();
  const isOwner = user && user.uid === comment.user_id;
  
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
  
  const handleDelete = async () => {
    if (!isOwner) return;
    
    try {
      const success = await deleteComment(comment.id);
      if (success && onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('שגיאה במחיקת התגובה');
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition-colors duration-200 border border-gray-100 shadow-sm">
      <div className="flex items-start gap-4">
        <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
          <AvatarImage src="" alt="" />
          <AvatarFallback className="bg-law-navy text-white text-lg">
            {comment.user_name ? getInitials(comment.user_name) : 'אנ'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-3">
            <span className="font-medium text-law-navy text-lg">{comment.user_name}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{formatDate(comment.created_at)}</span>
              {isOwner && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 w-7 p-0"
                  onClick={handleDelete}
                  title="מחק תגובה"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <p className="text-gray-700 font-heebo text-lg leading-relaxed">{comment.content}</p>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
