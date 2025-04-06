
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  serverTimestamp,
  getCountFromServer 
} from 'firebase/firestore';
import { db, auth } from '@/integrations/firebase/client';

// Get like count for an article
export async function getArticleLikeCount(articleId: string): Promise<number> {
  try {
    const likesRef = collection(db, 'likes');
    const q = query(likesRef, where('article_id', '==', articleId));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  } catch (error: any) {
    console.error('Error getting like count:', error.message);
    return 0;
  }
}

// Check if a user has liked an article
export async function hasUserLikedArticle(articleId: string, userId: string): Promise<boolean> {
  try {
    if (!userId) return false;
    
    const likesRef = collection(db, 'likes');
    const likesQuery = query(
      likesRef, 
      where('article_id', '==', articleId),
      where('user_id', '==', userId)
    );
    
    const querySnapshot = await getDocs(likesQuery);
    return !querySnapshot.empty;
  } catch (error: any) {
    console.error('Error checking if user liked article:', error.message);
    return false;
  }
}

// Toggle like for an article
export async function toggleArticleLike(articleId: string, userId: string): Promise<boolean> {
  try {
    // Verify user is authenticated
    if (!auth.currentUser) {
      throw new Error('Must be logged in to like articles');
    }
    
    if (!userId) {
      throw new Error('User ID is required');
    }
    
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
  } catch (error: any) {
    console.error('Error toggling like:', error.message);
    throw new Error(`Failed to toggle like: ${error.message}`);
  }
}
