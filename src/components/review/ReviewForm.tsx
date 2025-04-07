
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { EditableText } from '@/components/EditableText';
import { StarRating } from './StarRating';

interface ReviewFormProps {
  onSubmit: (content: string, rating: number) => Promise<boolean>;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit }) => {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const success = await onSubmit(content, rating);
    
    if (success) {
      setContent('');
      setRating(0);
    }
    
    setIsSubmitting(false);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold">
          <EditableText id="reviews-leave-review">השאר חוות דעת</EditableText>
        </h3>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              <EditableText id="reviews-rating-label">דירוג</EditableText>
            </label>
            <StarRating
              value={rating}
              onChange={setRating}
              onHover={setHoverRating}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              <EditableText id="reviews-content-label">חוות דעת</EditableText>
            </label>
            <Textarea
              placeholder="כתוב את חוות דעתך כאן..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
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
  );
};
