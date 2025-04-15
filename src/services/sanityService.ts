
import { sanityClient, urlFor } from '@/integrations/sanity/client';
import { SanityArticle, MappedArticle, SanityCategory, SanityAuthor } from '@/types/sanity';
import { Article } from '@/types/article';
import { PortableText } from '@portabletext/react';

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

// Create a component for rendering Portable Text content
export function PortableTextRenderer({ content }: { content: any }) {
  try {
    // If content is a string (from JSON.stringify), parse it
    const contentData = typeof content === 'string' ? JSON.parse(content) : content;
    
    return (
      <PortableText
        value={contentData}
        components={{
          block: {
            // Add custom styling for different block types
            normal: ({ children }) => <p className="mb-4 whitespace-pre-line">{children}</p>,
            h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
            h2: ({ children }) => <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>,
            h3: ({ children }) => <h3 className="text-xl font-bold mt-5 mb-2">{children}</h3>,
            blockquote: ({ children }) => (
              <blockquote className="border-r-4 border-law-navy pr-4 py-2 my-4 bg-gray-50 italic">
                {children}
              </blockquote>
            ),
          },
          marks: {
            link: ({ children, value }) => (
              <a href={value.href} className="text-law-navy underline hover:text-law-navy/80" target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            ),
          },
          list: {
            bullet: ({ children }) => <ul className="list-disc list-inside mb-4 pl-4">{children}</ul>,
            number: ({ children }) => <ol className="list-decimal list-inside mb-4 pl-4">{children}</ol>,
          },
          listItem: {
            bullet: ({ children }) => <li className="mb-2 whitespace-pre-line">{children}</li>,
            number: ({ children }) => <li className="mb-2 whitespace-pre-line">{children}</li>,
          },
        }}
      />
    );
  } catch (error) {
    console.error('Error rendering Portable Text:', error);
    // Fallback to simple text display if there's an error
    return <div className="whitespace-pre-line">{typeof content === 'string' ? content : 'Error displaying content'}</div>;
  }
}
