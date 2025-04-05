import { supabase } from '@/integrations/supabase/client';

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
    // Add the date field
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    const { error } = await supabase.from('articles').insert({
      title: articleData.title,
      summary: articleData.summary,
      content: articleData.content,
      category: articleData.category,
      author: articleData.author,
      image_url: articleData.image_url,
      date: currentDate
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error creating article:', error);
    return false;
  }
}
