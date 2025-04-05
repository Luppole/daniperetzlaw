
import React, { useState, useEffect } from 'react';
import { ThumbsUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface LikeCountProps {
  articleId: string;
}

const LikeCount: React.FC<LikeCountProps> = ({ articleId }) => {
  const [likeCount, setLikeCount] = useState(0);
  
  useEffect(() => {
    const getLikeCount = async () => {
      try {
        const { count, error } = await supabase
          .from('likes')
          .select('*', { count: 'exact' })
          .eq('article_id', articleId);

        if (error) {
          throw error;
        }

        setLikeCount(count || 0);
      } catch (error: any) {
        console.error('Error getting like count:', error.message);
      }
    };

    getLikeCount();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('likes-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'likes',
          filter: `article_id=eq.${articleId}`
        }, 
        () => {
          getLikeCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [articleId]);

  return (
    <div className="flex items-center gap-1 text-gray-500">
      <ThumbsUp className="h-4 w-4" />
      <span className="text-sm">{likeCount}</span>
    </div>
  );
};

export default LikeCount;
