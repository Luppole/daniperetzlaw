
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';
import { FirebaseArticle } from '@/integrations/firebase/types';
import { Article } from '@/types/article';
import { ensureArticlesExist } from './articleInitService';

// Re-export types and functions from modular services
export type { Article } from '@/types/article';
export type { Comment } from '@/types/comment';
export * from './articleInitService';
export * from './commentService';
export * from './likeService';

// Helper function to convert Firestore document to Article type
const convertFirestoreArticleToArticle = (doc: FirebaseArticle & { id: string }): Article => {
  return {
    id: doc.id,
    title: doc.title,
    summary: doc.summary,
    content: doc.content,
    category: doc.category,
    author: doc.author,
    image_url: doc.image_url,
    date: doc.date,
    created_at: doc.created_at.toDate().toISOString(),
    updated_at: doc.updated_at ? doc.updated_at.toDate().toISOString() : undefined
  };
};

// Create a new article
export async function createArticle(articleData: {
  title: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  image_url: string;
}): Promise<boolean> {
  try {
    const currentDate = new Date().toISOString().split('T')[0];
    
    const firestoreArticle: Omit<FirebaseArticle, 'id'> = {
      ...articleData,
      date: currentDate,
      created_at: serverTimestamp() as any,
      updated_at: null
    };

    const docRef = await addDoc(collection(db, 'articles'), firestoreArticle);
    return !!docRef.id;
  } catch (error) {
    console.error('Error creating article:', error);
    return false;
  }
}

// Get all articles
export async function getAllArticles(): Promise<Article[]> {
  try {
    const articlesRef = collection(db, 'articles');
    const articlesQuery = query(articlesRef, orderBy('created_at', 'desc'));
    const querySnapshot = await getDocs(articlesQuery);
    
    // Use a Map with article ID as key to ensure uniqueness
    const articlesMap = new Map<string, Article>();
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as FirebaseArticle;
      if (!articlesMap.has(doc.id)) {
        articlesMap.set(doc.id, convertFirestoreArticleToArticle({
          ...data,
          id: doc.id
        }));
      }
    });
    
    return Array.from(articlesMap.values());
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

// Get article by ID
export async function getArticleById(id: string): Promise<Article | null> {
  try {
    const docRef = doc(db, 'articles', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as FirebaseArticle;
      return convertFirestoreArticleToArticle({
        ...data,
        id: docSnap.id
      });
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

// Delete an article
export async function deleteArticle(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'articles', id));
    return true;
  } catch (error) {
    console.error('Error deleting article:', error);
    return false;
  }
}

// Update an article
export async function updateArticle(id: string, articleData: Partial<Article>): Promise<boolean> {
  try {
    const articleRef = doc(db, 'articles', id);
    
    // Remove properties that should not be updated directly
    const { id: _, created_at, updated_at, ...updateData } = articleData;
    
    // Add server timestamp for updated_at
    const firestoreData = {
      ...updateData,
      updated_at: serverTimestamp()
    };
    
    await updateDoc(articleRef, firestoreData);
    return true;
  } catch (error) {
    console.error('Error updating article:', error);
    return false;
  }
}

// Add an alias for createArticle for backward compatibility
export const addArticle = createArticle;
