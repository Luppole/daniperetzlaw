
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EditableText } from '@/components/EditableText';
import { StarRating } from './StarRating';
import { Review } from './hooks/useReviews';
import { useAuth } from '@/contexts/AuthContext';

interface ReviewItemProps {
  review: Review;
  onDelete: (id: string) => Promise<boolean>;
}

export const ReviewItem: React.FC<ReviewItemProps> = ({ review, onDelete }) => {
  const { user } = useAuth();
  const canDelete = user && user.uid === review.user_id;
  
  return (
    <Card className="overflow-hidden">
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
              {canDelete && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-500 hover:text-red-700"
                  onClick={() => onDelete(review.id)}
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
  );
};
