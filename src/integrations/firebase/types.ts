
import { Timestamp, DocumentReference } from "firebase/firestore";

export interface FirebaseArticle {
  id?: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  image_url: string;
  date: string;
  created_at: Timestamp;
  updated_at?: Timestamp | null;
}

export interface FirebaseAppointment {
  id?: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  details: string | null;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: Timestamp;
}

export interface FirebaseComment {
  id?: string;
  article_id: string;
  user_id: string;
  content: string;
  created_at: Timestamp;
}

export interface FirebaseLike {
  id?: string;
  article_id: string;
  user_id: string;
  created_at: Timestamp;
}

export interface FirebaseProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: Timestamp;
  role?: string;  // Added role field to support isAdmin check
}

export interface FirebaseReview {
  id?: string;
  content: string;
  rating: number;
  user_id: string;
  created_at: Timestamp;
  user_profile?: FirebaseProfile;
}

export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  metadata?: {
    creationTime?: string;
    lastSignInTime?: string;
  };
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export interface FirebaseContactMessage {
  id?: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  created_at: Timestamp;
  read: boolean;
}
