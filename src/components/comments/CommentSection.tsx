
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getArticleComments, Comment } from '@/services/articleService';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

interface CommentSectionProps {
  articleId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ articleId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch comments
  const fetchComments = async () => {
    setIsLoading(true);
    const fetchedComments = await getArticleComments(articleId);
    setComments(fetchedComments);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchComments();

    // Set up realtime subscription for comments
    const channel = supabase
      .channel('comments-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'comments',
          filter: `article_id=eq.${articleId}`
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
