
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  getDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth } from '@/integrations/firebase/client';
import { Comment } from '@/types/comment';
import { FirebaseComment } from '@/integrations/firebase/types';

// Helper function to convert Firestore document to Comment type
const convertFirestoreCommentToComment = async (
  comment: FirebaseComment & { id: string }
): Promise<Comment> => {
  let userName = 'Anonymous User';
  
  try {
    // Get user profile data
    const userDoc = await getDoc(doc(db, 'profiles', comment.user_id));
    if (userDoc.exists()) {
      userName = userDoc.data().full_name || 'Anonymous User';
    }
  } catch (error: any) {
    console.error('Error fetching user profile:', error.message);
  }
  
  return {
    id: comment.id,
    article_id: comment.article_id,
    user_id: comment.user_id,
    user_name: userName,
    content: comment.content,
    created_at: comment.created_at.toDate().toISOString()
  };
};

// Get comments for an article
export async function getArticleComments(articleId: string): Promise<Comment[]> {
  try {
    const commentsRef = collection(db, 'comments');
    const commentsQuery = query(
      commentsRef, 
      where('article_id', '==', articleId),
      orderBy('created_at', 'desc')
    );
    
    const querySnapshot = await getDocs(commentsQuery);
    
    const comments: Comment[] = [];
    for (const doc of querySnapshot.docs) {
      const data = doc.data() as FirebaseComment;
      const comment = await convertFirestoreCommentToComment({
        ...data,
        id: doc.id
      });
      comments.push(comment);
    }
    
    return comments;
  } catch (error: any) {
    console.error('Error fetching comments:', error.message);
    return [];
  }
}

// Add a comment to an article
export async function addComment(articleId: string, userId: string, content: string): Promise<boolean> {
  try {
    // Verify the user is logged in
    if (!auth.currentUser) {
      throw new Error('Must be logged in to add comments');
    }
    
    const firestoreComment: Omit<FirebaseComment, 'id'> = {
      article_id: articleId,
      user_id: userId,
      content: content,
      created_at: serverTimestamp() as any
    };
    
    const docRef = await addDoc(collection(db, 'comments'), firestoreComment);
    return !!docRef.id;
  } catch (error: any) {
    console.error('Error adding comment:', error.message);
    throw new Error(`Failed to add comment: ${error.message}`);
  }
}
