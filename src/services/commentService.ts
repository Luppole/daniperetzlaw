
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
  Timestamp,
  deleteDoc
} from 'firebase/firestore';
import { db, auth } from '@/integrations/firebase/client';
import { Comment } from '@/types/comment';
import { FirebaseComment } from '@/integrations/firebase/types';
import { toast } from 'sonner';
import { useAdmin } from '@/contexts/AdminContext';

// Helper function to convert Firestore document to Comment type
const convertFirestoreCommentToComment = async (
  comment: FirebaseComment & { id: string }
): Promise<Comment> => {
  let userName = 'משתמש אנונימי';
  
  try {
    // Get user profile data
    const userDoc = await getDoc(doc(db, 'profiles', comment.user_id));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      // Prioritize full_name from profiles, then displayName from auth
      userName = userData.full_name || userData.displayName || 'משתמש אנונימי';
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

// Delete a comment
export async function deleteComment(commentId: string): Promise<boolean> {
  try {
    // Verify the user is logged in
    if (!auth.currentUser) {
      toast.error('יש להתחבר כדי למחוק תגובה');
      throw new Error('Must be logged in to delete comments');
    }
    
    // First, get the comment to check ownership
    const commentRef = doc(db, 'comments', commentId);
    const commentDoc = await getDoc(commentRef);
    
    if (!commentDoc.exists()) {
      toast.error('התגובה לא נמצאה');
      return false;
    }
    
    const commentData = commentDoc.data() as FirebaseComment;
    
    // Check if current user is the owner of the comment or an admin
    // Note: This client-side check is supplementary to Firestore security rules
    if (commentData.user_id !== auth.currentUser.uid) {
      // For admins, we'll bypass this check in the component and let Firestore rules take care of it
      console.log('User is not the owner of this comment - will check admin status in the component');
    }
    
    await deleteDoc(commentRef);
    toast.success('התגובה נמחקה בהצלחה');
    return true;
  } catch (error: any) {
    console.error('Error deleting comment:', error);
    toast.error('שגיאה במחיקת התגובה');
    
    // Log more detailed error info for debugging
    if (error.code) {
      console.error('Firebase error code:', error.code);
    }
    
    return false;
  }
}
