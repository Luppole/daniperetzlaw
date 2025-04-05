
import { supabase } from '@/integrations/supabase/client';

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  date: string;
  image_url: string;
  created_at: string;
  updated_at?: string;
}

// Fetch a single article by ID
export async function getArticleById(id: string): Promise<Article | null> {
  try {
    // Use generic type to avoid type errors since 'articles' is not in the generated types
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Article;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

// Fetch all articles
export async function getAllArticles(): Promise<Article[]> {
  try {
    // Use generic type to avoid type errors since 'articles' is not in the generated types
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Article[];
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

// Get like count for an article
export async function getArticleLikeCount(articleId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('likes')
      .select('*', { count: 'exact' })
      .eq('article_id', articleId);
    
    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error getting like count:', error);
    return 0;
  }
}

// Insert sample articles into Supabase if they don't exist
export async function ensureArticlesExist(): Promise<void> {
  try {
    // Check if articles already exist
    // Use generic type to avoid type errors since 'articles' is not in the generated types
    const { count, error } = await supabase
      .from('articles')
      .select('*', { count: 'exact' });
    
    if (error) {
      console.error('Error checking articles:', error);
      return;
    }
    
    // If we already have articles, we're done
    if (count && count > 0) {
      console.log(`Found ${count} existing articles`);
      return;
    }
    
    console.log('No articles found, articles should have been created by SQL migration');
  } catch (error) {
    console.error('Error ensuring articles exist:', error);
  }
}
