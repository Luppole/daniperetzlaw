
import { supabase } from '@/integrations/supabase/client';

// Article type definition
export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  image_url: string;
  date: string;
  created_at: string;
  updated_at?: string;
}

// Comment type definition
export interface Comment {
  id: string;
  article_id: string;
  user_id: string;
  user_name?: string;
  content: string;
  created_at: string;
}

// Function to ensure default articles exist
export async function ensureArticlesExist() {
  const defaultArticles = [
    {
      title: 'Article 1',
      summary: 'Summary 1',
      content: 'Content 1',
      category: 'Category 1',
      author: 'Author 1',
      image_url: 'https://example.com/image1.jpg',
      date: new Date().toISOString().split('T')[0],
    },
    {
      title: 'Article 2',
      summary: 'Summary 2',
      content: 'Content 2',
      category: 'Category 2',
      author: 'Author 2',
      image_url: 'https://example.com/image2.jpg',
      date: new Date().toISOString().split('T')[0],
    },
  ];

  for (const article of defaultArticles) {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('title', article.title);

    if (error) {
      console.error('Error checking article existence:', error);
      continue;
    }

    if (data && data.length === 0) {
      const { error } = await supabase.from('articles').insert([article]);

      if (error) {
        console.error('Error creating article:', error);
      } else {
        console.log(`Article "${article.title}" created successfully`);
      }
    } else {
      console.log(`Article "${article.title}" already exists`);
    }
  }
}

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

    const { error } = await supabase.from('articles').insert(fullArticleData);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error creating article:', error);
    return false;
  }
}

// Get all articles
export async function getAllArticles(): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Article[] || [];
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

// Get article by ID
export async function getArticleById(id: string): Promise<Article | null> {
  try {
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

// Delete an article
export async function deleteArticle(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting article:', error);
    return false;
  }
}

// Update an article
export async function updateArticle(id: string, articleData: Partial<Article>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('articles')
      .update(articleData)
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating article:', error);
    return false;
  }
}

// Add an alias for createArticle for backward compatibility
export const addArticle = createArticle;

// Get comments for an article
export async function getArticleComments(articleId: string): Promise<Comment[]> {
  try {
    const { data, error } = await supabase.rpc<Comment[], {
      article_id_param: string;
    }>(
      'get_article_comments', 
      { article_id_param: articleId },
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

// Add a comment to an article
export async function addComment(articleId: string, userId: string, content: string): Promise<boolean> {
  try {
    const { error } = await supabase.rpc<{}, {
      p_article_id: string;
      p_user_id: string;
      p_content: string;
    }>(
      'add_comment', 
      {
        p_article_id: articleId,
        p_user_id: userId,
        p_content: content
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error adding comment:', error);
    return false;
  }
}

// Get like count for an article
export async function getArticleLikeCount(articleId: string): Promise<number> {
  try {
    const { data, error } = await supabase.rpc<number, {
      article_id_param: string;
    }>(
      'get_article_likes_count', 
      { article_id_param: articleId },
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (error) throw error;
    return data || 0;
  } catch (error) {
    console.error('Error getting like count:', error);
    return 0;
  }
}

// Check if a user has liked an article
export async function hasUserLikedArticle(articleId: string, userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('likes')
      .select('*')
      .eq('article_id', articleId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking if user liked article:', error);
    return false;
  }
}

// Toggle like for an article
export async function toggleArticleLike(articleId: string, userId: string): Promise<boolean> {
  try {
    const { data: existingLike, error: checkError } = await supabase
      .from('likes')
      .select('*')
      .eq('article_id', articleId)
      .eq('user_id', userId)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') throw checkError;

    if (existingLike) {
      const { error: unlikeError } = await supabase
        .from('likes')
        .delete()
        .eq('id', existingLike.id);

      if (unlikeError) throw unlikeError;
    } else {
      const { error: likeError } = await supabase
        .from('likes')
        .insert({
          article_id: articleId,
          user_id: userId
        });

      if (likeError) throw likeError;
    }

    return true;
  } catch (error) {
    console.error('Error toggling like:', error);
    return false;
  }
}
