
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Heart, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Database } from '@/integrations/supabase/types';

type LikeButtonProps = {
  articleId: string;
};

export function LikeButton({ articleId }: LikeButtonProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchLikes();
    
    // Set up a subscription to listen for changes in likes
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'likes',
          filter: `article_id=eq.${articleId}`,
        },
        () => {
          fetchLikes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [articleId, user]);

  const fetchLikes = async () => {
    try {
      // Get total count of likes for this article
      const { count, error: countError } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('article_id', articleId);
      
      if (countError) throw countError;
      setLikeCount(count || 0);
      
      // Check if current user has liked the article
      if (user) {
        const { data, error } = await supabase
          .from('likes')
          .select('*')
          .eq('article_id', articleId)
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) throw error;
        setLiked(!!data);
      } else {
        setLiked(false);
      }
    } catch (error) {
      console.error('Error fetching likes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikeToggle = async () => {
    if (!user) {
      toast.error('עליך להתחבר כדי לתת לייק');
      navigate('/auth');
      return;
    }

    setIsProcessing(true);
    try {
      if (liked) {
        // Remove like
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('article_id', articleId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Add like
        const { error } = await supabase
          .from('likes')
          .insert({
            article_id: articleId,
            user_id: user.id,
          });

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('שגיאה בעדכון הלייק');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <Button variant="outline" size="sm" disabled className="min-w-[80px]">
        <Loader2 className="h-4 w-4 animate-spin ml-2" />
        טוען...
      </Button>
    );
  }

  return (
    <Button
      variant={liked ? "default" : "outline"}
      size="sm"
      className={liked ? "bg-red-500 hover:bg-red-600 border-red-500" : "text-red-500 border-red-200 hover:bg-red-50"}
      onClick={handleLikeToggle}
      disabled={isProcessing}
    >
      {isProcessing ? (
        <Loader2 className="h-4 w-4 animate-spin ml-2" />
      ) : (
        <Heart className={`h-4 w-4 ml-2 ${liked ? "fill-white" : "fill-red-500"}`} />
      )}
      {likeCount > 0 && likeCount}
    </Button>
  );
}
