
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, Loader2, Send, Trash2, UserCircle, Edit } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';

type Review = {
  id: string;
  content: string;
  rating: number;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  };
};

export function ReviewSection() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    fetchReviews();
    
    // Set up a subscription to listen for changes in reviews
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reviews',
        },
        () => {
          fetchReviews();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles:profiles(full_name, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const typedData = data as Review[];
      setReviews(typedData);
      
      // Calculate average rating
      if (typedData.length > 0) {
        const total = typedData.reduce((sum, review) => sum + review.rating, 0);
        setAverageRating(Math.round((total / typedData.length) * 10) / 10);
      }

      // Check if the current user has already submitted a review
      if (user) {
        const userReview = typedData.find(review => review.user_id === user.id);
        if (userReview) {
          setUserReview(userReview);
          setRating(userReview.rating);
          setNewReview(userReview.content);
        } else {
          setUserReview(null);
          setRating(0);
          setNewReview('');
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('שגיאה בטעינת הביקורות');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      toast.error('עליך להתחבר כדי להוסיף ביקורת');
      navigate('/auth');
      return;
    }

    if (rating === 0) {
      toast.error('יש לבחור דירוג');
      return;
    }

    if (!newReview.trim()) {
      toast.error('יש להוסיף תוכן לביקורת');
      return;
    }

    setIsSending(true);
    try {
      if (userReview && isEditing) {
        // Update existing review
        const { error } = await supabase
          .from('reviews')
          .update({
            content: newReview.trim(),
            rating,
          })
          .eq('id', userReview.id);

        if (error) {
          throw error;
        }

        toast.success('הביקורת עודכנה בהצלחה');
        setIsEditing(false);
      } else {
        // Create new review
        const { error } = await supabase
          .from('reviews')
          .insert({
            content: newReview.trim(),
            rating,
            user_id: user.id,
          });

        if (error) {
          throw error;
        }

        toast.success('הביקורת נשלחה בהצלחה');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('שגיאה בשליחת הביקורת');
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!user) return;

    setIsDeleting(reviewId);
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      setUserReview(null);
      setRating(0);
      setNewReview('');
      setIsEditing(false);
      toast.success('הביקורת נמחקה בהצלחה');
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('שגיאה במחיקת הביקורת');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEditClick = () => {
    if (userReview) {
      setIsEditing(true);
      setRating(userReview.rating);
      setNewReview(userReview.content);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (userReview) {
      setRating(userReview.rating);
      setNewReview(userReview.content);
    } else {
      setRating(0);
      setNewReview('');
    }
  };

  const formatReviewDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: he,
      });
    } catch (error) {
      return 'תאריך לא ידוע';
    }
  };

  const getUserInitials = (name: string | null) => {
    if (!name) return '??';
    
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-law-navy mb-2">ביקורות לקוחות</h2>
      
      <div className="mb-8 flex items-center text-lg text-law-navy">
        <div className="flex mr-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-5 w-5 ${star <= Math.round(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            />
          ))}
        </div>
        <span className="font-bold ml-2">{averageRating}</span>
        <span className="text-gray-500 mr-1">({reviews.length} ביקורות)</span>
      </div>
      
      {/* Add/edit review form */}
      {(!userReview || isEditing) && (
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h3 className="text-xl font-bold text-law-navy mb-4">
            {isEditing ? 'ערוך את הביקורת שלך' : 'הוסף ביקורת'}
          </h3>
          
          <div className="mb-4">
            <p className="mb-2 font-medium">דירוג:</p>
            <div className="flex space-x-1 space-x-reverse">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="review-content" className="block mb-2 font-medium">
              הביקורת שלך:
            </label>
            <Textarea
              id="review-content"
              placeholder="שתף את החוויה שלך..."
              className="resize-none"
              rows={4}
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              disabled={isSending}
            />
          </div>
          
          <div className="flex justify-end space-x-2 space-x-reverse">
            {isEditing && (
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                disabled={isSending}
              >
                ביטול
              </Button>
            )}
            <Button
              className="bg-law-navy hover:bg-law-navy/90"
              onClick={handleSubmitReview}
              disabled={isSending || rating === 0 || !newReview.trim()}
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  שולח...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {isEditing ? 'עדכן ביקורת' : 'שלח ביקורת'}
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* User's existing review (when not editing) */}
      {userReview && !isEditing && (
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-lg mb-8">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-law-navy">הביקורת שלך</h3>
            <div className="flex space-x-2 space-x-reverse">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-law-navy border-law-navy hover:bg-law-navy/10"
                onClick={handleEditClick}
              >
                <Edit className="h-4 w-4 ml-1" />
                ערוך
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-red-500 border-red-200 hover:bg-red-50"
                onClick={() => handleDeleteReview(userReview.id)}
                disabled={isDeleting === userReview.id}
              >
                {isDeleting === userReview.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 ml-1" />
                    מחק
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="flex space-x-1 space-x-reverse mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${
                  star <= userReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          
          <p className="text-gray-700 whitespace-pre-wrap">{userReview.content}</p>
          <p className="text-xs text-gray-500 mt-2">
            {formatReviewDate(userReview.created_at)}
          </p>
        </div>
      )}

      {/* Reviews list */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-law-navy mb-4">כל הביקורות</h3>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-law-navy" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            אין ביקורות עדיין. היה הראשון להוסיף ביקורת!
          </div>
        ) : (
          reviews
            .filter(review => !user || review.user_id !== user.id) // Filter out user's own review
            .map((review) => (
              <div key={review.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start space-x-4 space-x-reverse">
                  <Avatar className="h-10 w-10 border-2 border-law-navy">
                    <AvatarImage src={review.profiles.avatar_url || undefined} />
                    <AvatarFallback className="bg-law-navy text-white">
                      {getUserInitials(review.profiles.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-law-navy">
                          {review.profiles.full_name || 'משתמש'}
                        </div>
                        <div className="flex space-x-1 space-x-reverse mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatReviewDate(review.created_at)}
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-gray-700 whitespace-pre-wrap">{review.content}</p>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
