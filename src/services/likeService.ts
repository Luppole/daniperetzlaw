
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';

// Get like count for an article
export async function getArticleLikeCount(articleId: string): Promise<number> {
  try {
    const likesRef = collection(db, 'likes');
    const likesQuery = query(likesRef, where('article_id', '==', articleId));
    const querySnapshot = await getDocs(likesQuery);
    
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting like count:', error);
    return 0;
  }
}

// Check if a user has liked an article
export async function hasUserLikedArticle(articleId: string, userId: string): Promise<boolean> {
  try {
    const likesRef = collection(db, 'likes');
    const likesQuery = query(
      likesRef, 
      where('article_id', '==', articleId),
      where('user_id', '==', userId)
    );
    
    const querySnapshot = await getDocs(likesQuery);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking if user liked article:', error);
    return false;
  }
}

// Toggle like for an article
export async function toggleArticleLike(articleId: string, userId: string): Promise<boolean> {
  try {
    const likesRef = collection(db, 'likes');
    const likesQuery = query(
      likesRef, 
      where('article_id', '==', articleId),
      where('user_id', '==', userId)
    );
    
    const querySnapshot = await getDocs(likesQuery);
    
    if (!querySnapshot.empty) {
      // User already liked the article, so unlike it
      const likeDoc = querySnapshot.docs[0];
      await deleteDoc(likeDoc.ref);
      return false; // Return false to indicate the article is now unliked
    } else {
      // User hasn't liked the article yet, so like it
      await addDoc(collection(db, 'likes'), {
        article_id: articleId,
        user_id: userId,
        created_at: serverTimestamp()
      });
      return true; // Return true to indicate the article is now liked
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return false;
  }
}
