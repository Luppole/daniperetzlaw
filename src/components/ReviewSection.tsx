
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { StarIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { EditableText } from '@/components/EditableText';
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

type Review = {
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

const ReviewSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const { user } = useAuth();

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

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    if (user) {
      checkUserReview();
    } else {
      setUserHasReviewed(false);
    }
  }, [user, reviews]);

  const checkUserReview = () => {
    if (!user) return;
    const hasReviewed = reviews.some(review => review.user_id === user.uid);
    setUserHasReviewed(hasReviewed);
  };

  const handleUpdateRating = (value: number) => {
    setRating(value);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('עליך להתחבר כדי לפרסם חוות דעת');
      return;
    }
    if (!newReview.trim()) {
      toast.error('אנא כתוב חוות דעת');
      return;
    }
    if (rating === 0) {
      toast.error('אנא דרג בין 1-5 כוכבים');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        content: newReview.trim(),
        rating: rating,
        user_id: user.uid,
        created_at: serverTimestamp()
      });

      toast.success('חוות הדעת נוספה בהצלחה');
      setNewReview('');
      setRating(0);
      fetchReviews();
    } catch (error: any) {
      console.error('Error adding review:', error.message);
      toast.error('אירעה שגיאה בהוספת חוות הדעת');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!user) return;

    try {
      await deleteDoc(doc(db, 'reviews', reviewId));
      toast.success('חוות הדעת נמחקה בהצלחה');
      fetchReviews();
      setUserHasReviewed(false);
    } catch (error: any) {
      console.error('Error deleting review:', error.message);
      toast.error('אירעה שגיאה במחיקת חוות הדעת');
    }
  };

  const StarRating = ({ value, onChange, onHover }: { value: number, onChange?: (value: number) => void, onHover?: (value: number) => void }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange && onChange(star)}
            onMouseEnter={() => onHover && onHover(star)}
            onMouseLeave={() => onHover && onHover(0)}
            className="focus:outline-none"
          >
            <StarIcon
              className={`h-6 w-6 ${
                star <= (hoverRating || value) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-12 mb-8">
      <h2 className="text-2xl font-bold mb-4 text-law-navy">
        <EditableText id="reviews-title">חוות דעת</EditableText>
      </h2>

      {user && !userHasReviewed && (
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <h3 className="text-lg font-semibold">
              <EditableText id="reviews-leave-review">השאר חוות דעת</EditableText>
            </h3>
          </CardHeader>
          <form onSubmit={handleSubmitReview}>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <EditableText id="reviews-rating-label">דירוג</EditableText>
                </label>
                <StarRating
                  value={rating}
                  onChange={handleUpdateRating}
                  onHover={setHoverRating}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  <EditableText id="reviews-content-label">חוות דעת</EditableText>
                </label>
                <Textarea
                  placeholder="כתוב את חוות דעתך כאן..."
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="bg-law-navy hover:bg-law-navy/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <EditableText id="reviews-submitting">שולח...</EditableText>
                  </>
                ) : <EditableText id="reviews-submit">פרסם חוות דעת</EditableText>}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center my-6">
          <Loader2 className="h-8 w-8 animate-spin text-law-navy" />
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="overflow-hidden">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src={review.user_profile?.avatar_url || undefined} alt={review.user_profile?.full_name || 'משתמש'} />
                    <AvatarFallback>{review.user_profile?.full_name?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="font-medium">{review.user_profile?.full_name || 'משתמש אנונימי'}</p>
                        <div className="flex items-center gap-2">
                          <StarRating value={review.rating} />
                          <span className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(review.created_at), { addSuffix: true, locale: he })}
                          </span>
                        </div>
                      </div>
                      {user && user.uid === review.user_id && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteReview(review.id)}
                        >
                          <EditableText id="reviews-delete">מחק</EditableText>
                        </Button>
                      )}
                    </div>
                    <p className="text-gray-700 mt-2">{review.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground my-6">
          <EditableText id="reviews-empty">אין חוות דעת עדיין. היה הראשון לכתוב חוות דעת!</EditableText>
        </p>
      )}

      {!user && (
        <div className="text-center my-6 bg-gray-50 p-4 rounded-lg">
          <p className="text-muted-foreground">
            <EditableText id="reviews-login-required">יש להתחבר כדי להוסיף חוות דעת</EditableText>
          </p>
          <Button 
            variant="outline" 
            className="mt-2 border-law-navy text-law-navy hover:bg-law-navy/10"
            onClick={() => window.location.href = '/auth'}
          >
            <EditableText id="reviews-login-button">התחברות / הרשמה</EditableText>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
