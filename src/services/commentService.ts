
import { supabase } from '@/integrations/supabase/client';
import { Comment } from '@/types/comment';

// Get comments for an article
export async function getArticleComments(articleId: string): Promise<Comment[]> {
  try {
    // First try the RPC function
    try {
      // Cast to any to bypass TypeScript's type checking for RPC functions
      const { data, error } = await (supabase.rpc as any)('get_article_comments', { 
        article_id_param: articleId 
      });

      if (!error && data) {
        return data as Comment[];
      }
    } catch (rpcError) {
      console.log('RPC function not available, falling back to direct query');
    }

    // Fallback to direct query
    const { data, error } = await supabase
      .from('comments')
      .select(`
        id,
        article_id,
        user_id,
        content,
        created_at,
        profiles:user_id (full_name)
      `)
      .eq('article_id', articleId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Process the data to match the Comment interface
    // Use type assertion to fix the TypeScript error
    return (data?.map(item => ({
      id: item.id,
      article_id: item.article_id,
      user_id: item.user_id,
      user_name: (item.profiles as { full_name?: string } | null)?.full_name || 'Anonymous User',
      content: item.content,
      created_at: item.created_at
    })) as Comment[]) || [];
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

// Add a comment to an article
export async function addComment(articleId: string, userId: string, content: string): Promise<boolean> {
  try {
    // First try the RPC function
    try {
      // Cast to any to bypass TypeScript's type checking for RPC functions
      const { error } = await (supabase.rpc as any)('add_comment', {
        p_article_id: articleId,
        p_user_id: userId,
        p_content: content
      });

      if (!error) {
        return true;
      }
    } catch (rpcError) {
      console.log('RPC function not available, falling back to direct insert');
    }

    // Fallback to direct insert
    const { error } = await supabase.from('comments').insert([{
      article_id: articleId,
      user_id: userId,
      content: content
    }]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error adding comment:', error);
    return false;
  }
}
