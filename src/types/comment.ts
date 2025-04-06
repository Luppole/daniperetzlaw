
import { Timestamp } from 'firebase/firestore';

export interface Comment {
  id: string;
  article_id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
}

export interface CommentWithArticle extends Comment {
  article_title: string;
}
