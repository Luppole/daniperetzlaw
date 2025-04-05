
import React, { useState, useEffect } from 'react';
import { ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getArticleLikeCount, toggleArticleLike, hasUserLikedArticle } from '@/services/articleService';

interface LikeButtonProps {
  articleId: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ articleId }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setUser(data.session.user);
      }
    };

    checkAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Check if user has liked the article
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (user) {
        const hasLiked = await hasUserLikedArticle(articleId, user.id);
        setLiked(hasLiked);
      }
    };

    checkLikeStatus();
  }, [articleId, user]);

  // Get like count
  useEffect(() => {
    const getLikeCount = async () => {
      const count = await getArticleLikeCount(articleId);
      setLikeCount(count);
    };

    getLikeCount();
    
    // Set up realtime subscription for likes
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

  const handleLike = async () => {
    if (!user) {
      toast({
        title: 'התחברות נדרשת',
        description: 'יש להתחבר כדי לסמן לייק',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const isLiked = await toggleArticleLike(articleId, user.id);
      setLiked(isLiked);
      
      toast({
        title: isLiked ? 'סימנת לייק' : 'הסרת לייק',
        variant: 'default'
      });
    } catch (error) {
      toast({
        title: 'שגיאה',
        description: 'אירעה שגיאה בסימון הלייק',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center">
      <Button 
        variant="outline" 
        size="lg" 
        className={`flex items-center gap-2 transition-colors ${
          liked ? 'text-white bg-law-navy border-law-navy hover:bg-law-navy/90' : 
                 'text-law-navy border-law-navy hover:bg-law-navy/10'
        }`}
        onClick={handleLike}
        disabled={isLoading}
      >
        <ThumbsUp className={`h-5 w-5 ${liked ? 'fill-white' : ''}`} />
        <span className="font-heebo">
          {liked ? 'סימנת לייק' : 'לייק'} 
          {likeCount > 0 && ` (${likeCount})`}
        </span>
      </Button>
    </div>
  );
};

export default LikeButton;
