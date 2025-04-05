
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
  user_name?: string; // Added user_name field
}

// Fetch a single article by ID
export async function getArticleById(id: string): Promise<Article | null> {
  try {
    // Use a type assertion to overcome the TypeScript constraint
    // while we wait for the types to be correctly regenerated
    const result = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (result.error) throw result.error;
    return result.data as unknown as Article;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

// Fetch all articles
export async function getAllArticles(): Promise<Article[]> {
  try {
    // Use a type assertion to overcome the TypeScript constraint
    const result = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (result.error) throw result.error;
    return result.data as unknown as Article[];
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
      .maybeSingle();

    if (checkError) {
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
    console.log('Fetching comments for article ID:', articleId);
    
    // Direct join with profiles table
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        profiles:user_id (
          full_name
        )
      `)
      .eq('article_id', articleId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
    
    // Transform the data to include user_name
    return (data || []).map(comment => ({
      ...comment,
      user_name: comment.profiles?.full_name || 'משתמש אנונימי'
    })) as Comment[];
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

// Add a new comment to an article
export async function addComment(articleId: string, userId: string, content: string): Promise<Comment | null> {
  try {
    console.log('Adding comment with:', { articleId, userId, content });
    
    const { data, error } = await supabase
      .from('comments')
      .insert({ 
        article_id: articleId, 
        user_id: userId, 
        content 
      })
      .select()
      .single();

    if (error) {
      console.error('Insert comment error:', error);
      throw error;
    }
    
    if (!data) {
      console.error('No data returned after comment insert');
      return null;
    }
    
    // Get the user's name from profiles
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .maybeSingle();
      
    if (profileError) {
      console.error('Error fetching profile:', profileError);
    }
    
    return {
      ...(data as unknown as Comment),
      user_name: profileData?.full_name || 'משתמש אנונימי'
    };
  } catch (error) {
    console.error('Error adding comment:', error);
    return null;
  }
}

// Ensure articles exist in the database
export async function ensureArticlesExist(): Promise<void> {
  try {
    // Check if articles already exist
    // Use a type assertion to overcome the TypeScript constraint
    const result = await supabase
      .from('articles')
      .select('*', { count: 'exact' });
    
    if (result.error) {
      console.error('Error checking articles:', result.error);
      return;
    }
    
    // If we already have articles, we're done
    if (result.count && result.count > 0) {
      console.log(`Found ${result.count} existing articles`);
      return;
    }
    
    console.log('No articles found. Articles should be created via SQL migration.');
  } catch (error) {
    console.error('Error ensuring articles exist:', error);
  }
}
