
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { StarIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

type Review = {
  id: string;
  content: string;
  rating: number;
  user_id: string;
  created_at: string;
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
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

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles:user_id(full_name, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Cast the data with proper type handling for the profiles relation
      const typedReviews = data.map(review => ({
        ...review,
        profiles: review.profiles as unknown as { full_name: string | null; avatar_url: string | null; }
      })) as Review[];

      setReviews(typedReviews);
    } catch (error: any) {
      console.error('Error fetching reviews:', error.message);
      toast.error('אירעה שגיאה בטעינת חוות הדעת');
    } finally {
      setIsLoading(false);
    }
  };

  const checkUserReview = () => {
    if (!user) return;
    const hasReviewed = reviews.some(review => review.user_id === user.id);
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
      const { error } = await supabase
        .from('reviews')
        .insert({
          content: newReview.trim(),
          rating: rating,
          user_id: user.id
        });

      if (error) throw error;

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
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId)
        .eq('user_id', user.id);

      if (error) throw error;

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
      <h2 className="text-2xl font-bold mb-4 text-law-navy">חוות דעת</h2>

      {user && !userHasReviewed && (
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <h3 className="text-lg font-semibold">השאר חוות דעת</h3>
          </CardHeader>
          <form onSubmit={handleSubmitReview}>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">דירוג</label>
                <StarRating
                  value={rating}
                  onChange={handleUpdateRating}
                  onHover={setHoverRating}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">חוות דעת</label>
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
                    שולח...
                  </>
                ) : 'פרסם חוות דעת'}
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
                    <AvatarImage src={review.profiles?.avatar_url || undefined} alt={review.profiles?.full_name || 'משתמש'} />
                    <AvatarFallback>{review.profiles?.full_name?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="font-medium">{review.profiles?.full_name || 'משתמש אנונימי'}</p>
                        <div className="flex items-center gap-2">
                          <StarRating value={review.rating} />
                          <span className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(review.created_at), { addSuffix: true, locale: he })}
                          </span>
                        </div>
                      </div>
                      {user && user.id === review.user_id && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteReview(review.id)}
                        >
                          מחק
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
        <p className="text-center text-muted-foreground my-6">אין חוות דעת עדיין. היה הראשון לכתוב חוות דעת!</p>
      )}

      {!user && (
        <div className="text-center my-6 bg-gray-50 p-4 rounded-lg">
          <p className="text-muted-foreground">יש להתחבר כדי להוסיף חוות דעת</p>
          <Button 
            variant="outline" 
            className="mt-2 border-law-navy text-law-navy hover:bg-law-navy/10"
            onClick={() => window.location.href = '/auth'}
          >
            התחברות / הרשמה
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
