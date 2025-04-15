
import { sanityClient, urlFor } from '@/integrations/sanity/client';
import { SanityArticle, MappedArticle, SanityCategory, SanityAuthor } from '@/types/sanity';
import { Article } from '@/types/article';

// Map Sanity article to our internal Article format
export function mapSanityArticleToArticle(sanityArticle: SanityArticle, author?: SanityAuthor, category?: SanityCategory): MappedArticle {
  return {
    id: sanityArticle._id,
    title: sanityArticle.title,
    summary: sanityArticle.summary,
    content: JSON.stringify(sanityArticle.body), // Store as JSON string to be rendered with PortableText
    category: category?.title || 'כללי',
    author: author?.name || 'מחבר לא ידוע',
    image_url: sanityArticle.mainImage ? urlFor(sanityArticle.mainImage).url() : '',
    date: new Date(sanityArticle.publishedAt || sanityArticle._createdAt).toISOString().split('T')[0],
    created_at: sanityArticle._createdAt,
    updated_at: sanityArticle._updatedAt,
    slug: sanityArticle.slug?.current,
  };
}

// Fetch all articles from Sanity
export async function getAllSanityArticles(): Promise<MappedArticle[]> {
  try {
    const query = `
      *[_type == "article"] {
        _id,
        _createdAt,
        _updatedAt,
        title,
        slug,
        summary,
        mainImage,
        body,
        category->,
        author->,
        publishedAt
      } | order(publishedAt desc)
    `;
    
    const sanityArticles = await sanityClient.fetch<(SanityArticle & {
      category: SanityCategory,
      author: SanityAuthor
    })[]>(query);
    
    return sanityArticles.map(article => mapSanityArticleToArticle(
      article, 
      article.author, 
      article.category
    ));
  } catch (error) {
    console.error('Error fetching articles from Sanity:', error);
    
    // Fallback to Firebase if Sanity fetch fails
    try {
      const { getAllArticles } = await import('./articleService');
      return await getAllArticles();
    } catch (fallbackError) {
      console.error('Fallback to Firebase also failed:', fallbackError);
      return [];
    }
  }
}

// Get a single article by ID or slug
export async function getSanityArticleById(idOrSlug: string): Promise<MappedArticle | null> {
  try {
    const query = `
      *[_type == "article" && (_id == $idOrSlug || slug.current == $idOrSlug)][0] {
        _id,
        _createdAt,
        _updatedAt,
        title,
        slug,
        summary,
        mainImage,
        body,
        "category": category->,
        "author": author->,
        publishedAt
      }
    `;
    
    const article = await sanityClient.fetch<SanityArticle & {
      category: SanityCategory,
      author: SanityAuthor
    }>(query, { idOrSlug });
    
    if (!article) return null;
    
    return mapSanityArticleToArticle(article, article.author, article.category);
  } catch (error) {
    console.error(`Error fetching article with ID or slug ${idOrSlug} from Sanity:`, error);
    
    // Fallback to Firebase if Sanity fetch fails
    try {
      const { getArticleById } = await import('./articleService');
      return await getArticleById(idOrSlug);
    } catch (fallbackError) {
      console.error('Fallback to Firebase also failed:', fallbackError);
      return null;
    }
  }
}

// Get articles by category
export async function getArticlesByCategory(categoryId: string): Promise<MappedArticle[]> {
  try {
    const query = `
      *[_type == "article" && category._ref == $categoryId] {
        _id,
        _createdAt,
        _updatedAt,
        title,
        slug,
        summary,
        mainImage,
        body,
        "category": category->,
        "author": author->,
        publishedAt
      } | order(publishedAt desc)
    `;
    
    const articles = await sanityClient.fetch<(SanityArticle & {
      category: SanityCategory,
      author: SanityAuthor
    })[]>(query, { categoryId });
    
    return articles.map(article => mapSanityArticleToArticle(
      article, 
      article.author, 
      article.category
    ));
  } catch (error) {
    console.error(`Error fetching articles for category ${categoryId} from Sanity:`, error);
    return [];
  }
}

// Get all categories
export async function getAllCategories(): Promise<SanityCategory[]> {
  try {
    const query = `*[_type == "category"] { _id, title, description }`;
    return await sanityClient.fetch<SanityCategory[]>(query);
  } catch (error) {
    console.error('Error fetching categories from Sanity:', error);
    return [];
  }
}
