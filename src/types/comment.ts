
// Comment type definition
export interface Comment {
  id: string;
  article_id: string;
  user_id: string;
  user_name?: string;
  content: string;
  created_at: string;
}
