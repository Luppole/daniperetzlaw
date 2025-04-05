
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

export interface Comment {
  id: string;
  article_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

// Fetch a single article by ID
export async function getArticleById(id: string): Promise<Article | null> {
  try {
    // Use generic type parameter and 'from' method to avoid type errors
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as unknown as Article;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

// Fetch all articles
export async function getAllArticles(): Promise<Article[]> {
  try {
    // Use generic type parameter and 'from' method to avoid type errors
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as unknown as Article[];
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

// Toggle like for an article
export async function toggleArticleLike(articleId: string, userId: string): Promise<boolean> {
  try {
    // Check if the user has already liked the article
    const { data: existingLike, error: checkError } = await supabase
      .from('likes')
      .select('*')
      .eq('article_id', articleId)
      .eq('user_id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // Error other than "no rows returned"
      throw checkError;
    }

    if (existingLike) {
      // User already liked the article, so unlike it
      const { error: deleteError } = await supabase
        .from('likes')
        .delete()
        .eq('article_id', articleId)
        .eq('user_id', userId);

      if (deleteError) throw deleteError;
      return false; // Unliked
    } else {
      // User hasn't liked the article yet, so like it
      const { error: insertError } = await supabase
        .from('likes')
        .insert({ article_id: articleId, user_id: userId });

      if (insertError) throw insertError;
      return true; // Liked
    }
  } catch (error) {
    console.error('Error toggling article like:', error);
    return false;
  }
}

// Check if user has liked an article
export async function hasUserLikedArticle(articleId: string, userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('likes')
      .select('*')
      .eq('article_id', articleId)
      .eq('user_id', userId);

    if (error) throw error;
    return data && data.length > 0;
  } catch (error) {
    console.error('Error checking if user liked article:', error);
    return false;
  }
}

// Get comments for an article
export async function getArticleComments(articleId: string): Promise<Comment[]> {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('article_id', articleId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as unknown as Comment[];
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

// Add a new comment to an article
export async function addComment(articleId: string, userId: string, content: string): Promise<Comment | null> {
  try {
    const { data, error } = await supabase
      .from('comments')
      .insert({ article_id: articleId, user_id: userId, content })
      .select()
      .single();

    if (error) throw error;
    return data as unknown as Comment;
  } catch (error) {
    console.error('Error adding comment:', error);
    return null;
  }
}

// Insert sample articles into Supabase if they don't exist
export async function ensureArticlesExist(): Promise<void> {
  try {
    // Check if articles already exist
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
