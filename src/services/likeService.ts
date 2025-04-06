
import { supabase } from '@/integrations/supabase/client';

// Get like count for an article
export async function getArticleLikeCount(articleId: string): Promise<number> {
  try {
    // Use the any type to bypass TypeScript checking for RPC calls
    const { data, error } = await (supabase.rpc as any)(
      'get_article_likes_count', 
      { article_id_param: articleId }
    );

    if (error) throw error;
    return (data as number) || 0;
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
