
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
