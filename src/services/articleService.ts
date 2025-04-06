
import { Article } from '@/types/article';
import { supabase } from '@/integrations/supabase/client';
import { ensureArticlesExist } from './articleInitService';

// Re-export types and functions from modular services
export type { Article } from '@/types/article';
export type { Comment } from '@/types/comment';
export * from './articleInitService';
export * from './commentService';
export * from './likeService';

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
    
    const fullArticleData = {
      ...articleData,
      date: currentDate
    };

    const response = await supabase.from('articles').insert(fullArticleData);

    if (response.error) throw response.error;
    return true;
  } catch (error) {
    console.error('Error creating article:', error);
    return false;
  }
}

// Get all articles
export async function getAllArticles(): Promise<Article[]> {
  try {
    const response = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (response.error) throw response.error;
    return response.data as Article[] || [];
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

// Get article by ID
export async function getArticleById(id: string): Promise<Article | null> {
  try {
    const response = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();

    if (response.error) throw response.error;
    return response.data as Article;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

// Delete an article
export async function deleteArticle(id: string): Promise<boolean> {
  try {
    const response = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (response.error) throw response.error;
    return true;
  } catch (error) {
    console.error('Error deleting article:', error);
    return false;
  }
}

// Update an article
export async function updateArticle(id: string, articleData: Partial<Article>): Promise<boolean> {
  try {
    const response = await supabase
      .from('articles')
      .update(articleData)
      .eq('id', id);

    if (response.error) throw response.error;
    return true;
  } catch (error) {
    console.error('Error updating article:', error);
    return false;
  }
}

// Add an alias for createArticle for backward compatibility
export const addArticle = createArticle;
