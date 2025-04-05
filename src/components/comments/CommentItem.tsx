
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Comment } from '@/services/articleService';

interface CommentItemProps {
  comment: Comment;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
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
            <span className="font-medium text-law-navy text-lg">{comment.user_name || 'משתמש אנונימי'}</span>
            <span className="text-sm text-gray-500">{formatDate(comment.created_at)}</span>
          </div>
          <p className="text-gray-700 font-heebo text-lg leading-relaxed">{comment.content}</p>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
