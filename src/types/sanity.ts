
// Sanity schema type definitions
export interface SanityImageAsset {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
}

export interface SanityArticle {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  title: string;
  slug: {
    current: string;
  };
  summary: string;
  mainImage: SanityImageAsset;
  body: any[]; // Portable Text content
  category: {
    _ref: string;
    _type: 'reference';
  };
  author: {
    _ref: string;
    _type: 'reference';
    name?: string;
  };
  publishedAt: string;
}

export interface SanityAuthor {
  _id: string;
  name: string;
  image?: SanityImageAsset;
  bio?: any[];
}

export interface SanityCategory {
  _id: string;
  title: string;
  description?: string;
}

// Mapped type that matches our existing Article type
export interface MappedArticle {
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
  slug?: string;
}
