
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  getDoc, 
  doc, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db, auth } from '@/integrations/firebase/client';
import { Comment } from '@/types/comment';
import { FirebaseComment } from '@/integrations/firebase/types';
import { toast } from 'sonner';

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
    created_at: comment.created_at instanceof Timestamp ? 
      comment.created_at.toDate().toISOString() : 
      new Date().toISOString()
  };
};

// Get comments for an article
export async function getArticleComments(articleId: string): Promise<Comment[]> {
  try {
    console.log(`Fetching comments for article ID: ${articleId}`);
    const commentsRef = collection(db, 'comments');
    const commentsQuery = query(
      commentsRef, 
      where('article_id', '==', articleId),
      orderBy('created_at', 'desc')
    );
    
    const querySnapshot = await getDocs(commentsQuery);
    console.log(`Found ${querySnapshot.docs.length} comments`);
    
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
      toast.error('יש להתחבר כדי להוסיף תגובה');
      throw new Error('Must be logged in to add comments');
    }
    
    // Verify that userId matches the current user
    if (auth.currentUser.uid !== userId) {
      toast.error('שגיאת אימות משתמש');
      throw new Error('User ID does not match the authenticated user');
    }
    
    console.log(`Adding comment for article ID: ${articleId}, user ID: ${userId}`);
    
    const firestoreComment: Omit<FirebaseComment, 'id'> = {
      article_id: articleId,
      user_id: userId,
      content: content,
      created_at: serverTimestamp() as any
    };
    
    console.log('Comment data:', firestoreComment);
    
    const docRef = await addDoc(collection(db, 'comments'), firestoreComment);
    console.log('Comment added with ID:', docRef.id);
    return !!docRef.id;
  } catch (error: any) {
    console.error('Error adding comment:', error);
    throw new Error(`Failed to add comment: ${error.message}`);
  }
}
