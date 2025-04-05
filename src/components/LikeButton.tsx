
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

interface LikeButtonProps {
  articleId: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ articleId }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    getLikeStatus();
    getLikeCount();
  }, [articleId, user]);

  const getLikeStatus = async () => {
    if (!user) {
      setIsLiked(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('likes')
        .select('*')
        .eq('article_id', articleId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      setIsLiked(!!data);
    } catch (error: any) {
      console.error('Error checking like status:', error.message);
    }
  };

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

  const handleLikeToggle = async () => {
    if (!user) {
      toast.error('עליך להתחבר כדי לתת לייק');
      return;
    }

    setIsLoading(true);
    try {
      if (isLiked) {
        // Remove like
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('article_id', articleId)
          .eq('user_id', user.id);

        if (error) throw error;
        
        setIsLiked(false);
        setLikeCount(prev => Math.max(0, prev - 1));
      } else {
        // Add like
        const { error } = await supabase
          .from('likes')
          .insert({
            article_id: articleId,
            user_id: user.id
          });

        if (error) throw error;
        
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
      }
    } catch (error: any) {
      console.error('Error toggling like:', error.message);
      toast.error('אירעה שגיאה בעת עדכון הלייק');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleLikeToggle}
        disabled={isLoading}
        className={`flex items-center gap-1 ${
          isLiked
            ? 'bg-blue-50 text-blue-600 border-blue-200'
            : 'text-gray-500'
        }`}
      >
        <ThumbsUp
          className={`h-4 w-4 ${isLiked ? 'fill-blue-600' : ''}`}
        />
        <span>{isLiked ? 'אהבתי' : 'אהבתי'}</span>
      </Button>
      <span className="text-sm text-gray-500">{likeCount}</span>
    </div>
  );
};

export default LikeButton;
