
import { supabase } from '@/integrations/supabase/client';
import { Comment } from '@/types/comment';

// Get comments for an article
export async function getArticleComments(articleId: string): Promise<Comment[]> {
  try {
    // Use the any type to bypass TypeScript checking for RPC calls
    const { data, error } = await (supabase.rpc as any)(
      'get_article_comments', 
      { article_id_param: articleId }
    );

    if (error) throw error;
    return (data as Comment[]) || [];
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

// Add a comment to an article
export async function addComment(articleId: string, userId: string, content: string): Promise<boolean> {
  try {
    // Use the any type to bypass TypeScript checking for RPC calls
    const { error } = await (supabase.rpc as any)(
      'add_comment', 
      {
        p_article_id: articleId,
        p_user_id: userId,
        p_content: content
      }
    );

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error adding comment:', error);
    return false;
  }
}
