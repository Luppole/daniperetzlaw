
import React, { useState, useEffect } from 'react';
import { ThumbsUp } from 'lucide-react';
import { getArticleLikeCount } from '@/services/articleService';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';

interface LikeCountProps {
  articleId: string;
}

const LikeCount: React.FC<LikeCountProps> = ({ articleId }) => {
  const [likeCount, setLikeCount] = useState(0);
  
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

  return (
    <div className="flex items-center gap-1 text-gray-500">
      <ThumbsUp className="h-4 w-4" />
      <span className="text-sm">{likeCount}</span>
    </div>
  );
};

export default LikeCount;
