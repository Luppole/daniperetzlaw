
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where,
  orderBy, 
  serverTimestamp,
  getDoc,
  doc
} from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';
import { FirebaseReview, FirebaseProfile } from '@/integrations/firebase/types';
import { useAuth } from '@/contexts/AuthContext';

export type Review = {
  id: string;
  content: string;
  rating: number;
  user_id: string;
  created_at: string;
  user_profile?: {
    full_name: string | null;
    avatar_url: string | null;
  };
};

export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const { user } = useAuth();

  const convertFirestoreReviewToReview = async (
    review: FirebaseReview & { id: string }
  ): Promise<Review> => {
    let userProfile = {
      full_name: null,
      avatar_url: null
    };
    
    try {
      const userDoc = await getDoc(doc(db, 'profiles', review.user_id));
      if (userDoc.exists()) {
        const profileData = userDoc.data() as FirebaseProfile;
        userProfile = {
          full_name: profileData.full_name,
          avatar_url: profileData.avatar_url
        };
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
    
    return {
      id: review.id,
      content: review.content,
      rating: review.rating,
      user_id: review.user_id,
      created_at: review.created_at.toDate().toISOString(),
      user_profile: userProfile
    };
  };

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const reviewsRef = collection(db, 'reviews');
      const reviewsQuery = query(reviewsRef, orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(reviewsQuery);
      
      const fetchedReviews: Review[] = [];
      for (const doc of querySnapshot.docs) {
        const data = doc.data() as FirebaseReview;
        const review = await convertFirestoreReviewToReview({
          ...data,
          id: doc.id
        });
        fetchedReviews.push(review);
      }
      
      setReviews(fetchedReviews);
    } catch (error: any) {
      console.error('Error fetching reviews:', error.message);
      toast.error('אירעה שגיאה בטעינת חוות הדעת');
    } finally {
      setIsLoading(false);
    }
  };

  const addReview = async (content: string, rating: number) => {
    if (!user) {
      toast.error('עליך להתחבר כדי לפרסם חוות דעת');
      return false;
    }
    if (!content.trim()) {
      toast.error('אנא כתוב חוות דעת');
      return false;
    }
    if (rating === 0) {
      toast.error('אנא דרג בין 1-5 כוכבים');
      return false;
    }

    try {
      await addDoc(collection(db, 'reviews'), {
        content: content.trim(),
        rating: rating,
        user_id: user.uid,
        created_at: serverTimestamp()
      });

      toast.success('חוות הדעת נוספה בהצלחה');
      await fetchReviews();
      return true;
    } catch (error: any) {
      console.error('Error adding review:', error.message);
      toast.error('אירעה שגיאה בהוספת חוות הדעת');
      return false;
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!user) return false;

    try {
      await deleteDoc(doc(db, 'reviews', reviewId));
      toast.success('חוות הדעת נמחקה בהצלחה');
      await fetchReviews();
      return true;
    } catch (error: any) {
      console.error('Error deleting review:', error.message);
      toast.error('אירעה שגיאה במחיקת חוות הדעת');
      return false;
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    if (user) {
      const hasReviewed = reviews.some(review => review.user_id === user.uid);
      setUserHasReviewed(hasReviewed);
    } else {
      setUserHasReviewed(false);
    }
  }, [user, reviews]);

  return {
    reviews,
    isLoading,
    userHasReviewed,
    fetchReviews,
    addReview,
    deleteReview
  };
};
