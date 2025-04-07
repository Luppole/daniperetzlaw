
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { EditableText } from '@/components/EditableText';
import { useAuth } from '@/contexts/AuthContext';
import { useReviews } from './review/hooks/useReviews';
import { ReviewForm } from './review/ReviewForm';
import { ReviewItem } from './review/ReviewItem';

const ReviewSection: React.FC = () => {
  const { user } = useAuth();
  const { 
    reviews, 
    isLoading, 
    userHasReviewed, 
    addReview, 
    deleteReview 
  } = useReviews();

  return (
    <div className="mt-12 mb-8">
      <h2 className="text-2xl font-bold mb-4 text-law-navy">
        <EditableText id="reviews-title">חוות דעת</EditableText>
      </h2>

      {user && !userHasReviewed && (
        <ReviewForm onSubmit={addReview} />
      )}

      {isLoading ? (
        <div className="flex justify-center my-6">
          <Loader2 className="h-8 w-8 animate-spin text-law-navy" />
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewItem 
              key={review.id} 
              review={review} 
              onDelete={deleteReview} 
            />
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
