
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Comment } from '@/types/comment';
import CommentItem from './CommentItem';

interface CommentListProps {
  comments: Comment[];
  isLoading: boolean;
}

const CommentList: React.FC<CommentListProps> = ({ comments, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-law-navy" />
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100">
        <p className="text-gray-500 font-heebo text-lg">אין תגובות עדיין. היה הראשון להגיב!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentList;
