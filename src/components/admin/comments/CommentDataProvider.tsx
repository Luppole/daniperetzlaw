
import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, query, orderBy, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';
import { toast } from 'sonner';
import { Timestamp } from 'firebase/firestore';
import { getArticleById } from '@/services/articleService';
import { FirebaseComment } from '@/integrations/firebase/types';
import { CommentWithArticle } from '@/types/comment';

interface CommentDataProviderProps {
  children: (props: {
    comments: CommentWithArticle[];
    isLoading: boolean;
  }) => React.ReactNode;
}

export function CommentDataProvider({ children }: CommentDataProviderProps) {
  const [comments, setComments] = useState<CommentWithArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      // Fetch comments from Firestore
      const commentsRef = collection(db, 'comments');
      const commentsQuery = query(commentsRef, orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(commentsQuery);
      
      if (querySnapshot.empty) {
        setComments([]);
        setIsLoading(false);
        return;
      }
      
      // Process each comment
      const commentsData: CommentWithArticle[] = [];
      
      for (const commentDoc of querySnapshot.docs) {
        const commentData = commentDoc.data() as FirebaseComment;
        
        // Get article title
        let articleTitle = 'מאמר לא מזוהה';
        try {
          const article = await getArticleById(commentData.article_id);
          if (article) {
            articleTitle = article.title;
          }
        } catch (error) {
          console.error('Error fetching article:', error);
        }
        
        // Get user name
        let userName = 'משתמש אנונימי';
        try {
          const userDoc = await getDoc(doc(db, 'profiles', commentData.user_id));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            userName = userData.full_name || userData.displayName || 'משתמש אנונימי';
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
        
        // Format the created_at timestamp
        const createdAt = commentData.created_at instanceof Timestamp 
          ? commentData.created_at.toDate().toISOString()
          : new Date().toISOString();
        
        commentsData.push({
          id: commentDoc.id,
          content: commentData.content,
          user_name: userName,
          user_id: commentData.user_id,
          created_at: createdAt,
          article_id: commentData.article_id,
          article_title: articleTitle,
        });
      }
      
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('שגיאה בטעינת התגובות');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();

    // Set up realtime subscription
    const commentsRef = collection(db, 'comments');
    const commentsQuery = query(commentsRef, orderBy('created_at', 'desc'));
    
    const unsubscribe = onSnapshot(commentsQuery, () => {
      fetchComments();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return <>{children({ comments, isLoading })}</>;
}
