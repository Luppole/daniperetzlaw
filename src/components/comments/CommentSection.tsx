
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Comment } from '@/types/comment';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';
import { Loader2 } from 'lucide-react';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import { getArticleComments } from '@/services/commentService';

interface CommentSectionProps {
  articleId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ articleId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

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

  const handleCommentAdded = async () => {
    const freshComments = await getArticleComments(articleId);
    setComments(freshComments);
  };

  return (
    <div className="mt-12 pt-6 border-t border-gray-200">
      <h3 className="text-xl font-bold mb-6 text-law-navy">תגובות</h3>
      
      {/* Comment Form */}
      <CommentForm articleId={articleId} onCommentAdded={handleCommentAdded} />
      
      {/* Comments List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-law-navy" />
        </div>
      ) : (
        <CommentList comments={comments} />
      )}
    </div>
  );
};

export default CommentSection;
