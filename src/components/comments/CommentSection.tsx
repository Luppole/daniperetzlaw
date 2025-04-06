
import React, { useState, useEffect } from 'react';
import { getArticleComments } from '@/services/commentService';
import { Comment } from '@/types/comment';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';

interface CommentSectionProps {
  articleId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ articleId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch comments
  const fetchComments = async () => {
    console.log('Fetching comments for article:', articleId);
    setIsLoading(true);
    try {
      const fetchedComments = await getArticleComments(articleId);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();

    // Set up realtime subscription for comments
    const commentsRef = collection(db, 'comments');
    const commentsQuery = query(
      commentsRef, 
      where('article_id', '==', articleId),
      orderBy('created_at', 'desc')
    );
    
    const unsubscribe = onSnapshot(commentsQuery, async () => {
      console.log('Comments updated, refreshing');
      fetchComments();
    }, (error) => {
      console.error('Error in comments snapshot listener:', error);
    });

    return () => {
      unsubscribe();
    };
  }, [articleId]);

  return (
    <div className="mt-12 pt-6 border-t border-gray-200">
      <h3 className="text-xl font-bold mb-6 text-law-navy">תגובות</h3>
      
      {/* Comment Form */}
      <CommentForm articleId={articleId} onCommentAdded={fetchComments} />
      
      {/* Comments List */}
      <CommentList comments={comments} isLoading={isLoading} />
    </div>
  );
};

export default CommentSection;
