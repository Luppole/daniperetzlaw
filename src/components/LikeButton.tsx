
import React, { useState, useEffect } from 'react';
import { ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getArticleLikeCount, toggleArticleLike, hasUserLikedArticle } from '@/services/articleService';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';

interface LikeButtonProps {
  articleId: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ articleId }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Check if user has liked the article
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (user) {
        const hasLiked = await hasUserLikedArticle(articleId, user.uid);
        setLiked(hasLiked);
      }
    };

    checkLikeStatus();
  }, [articleId, user]);

  // Get like count and listen for changes
  useEffect(() => {
    const getLikeCount = async () => {
      const count = await getArticleLikeCount(articleId);
      setLikeCount(count);
    };

    getLikeCount();
    
    // Set up realtime subscription for likes
    const likesRef = collection(db, 'likes');
    const likesQuery = query(likesRef, where('article_id', '==', articleId));
    
    const unsubscribe = onSnapshot(likesQuery, (snapshot) => {
      setLikeCount(snapshot.size);
    });

    return () => {
      unsubscribe();
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
      const result = await toggleArticleLike(articleId, user.uid);
      setLiked(!liked); // Toggle the liked state
      
      toast({
        title: liked ? 'הסרת לייק' : 'סימנת לייק',
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
