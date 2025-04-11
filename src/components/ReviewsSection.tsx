import React, { useState, useRef, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { EditableText } from '@/components/EditableText';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { ReviewsSchemaMarkup } from './ReviewsSchemaMarkup';
import '../styles/reviews.css';

// For carousel functionality
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Sample reviews data - in a real app, this would come from Firebase
const initialReviews = [
  {
    id: '1',
    text: 'עו״ד דני עזר לי מאוד בתיק מורכב של דיני משפחה. הוא היה מקצועי, אכפתי ותמיד זמין לענות על שאלות. ממליץ בחום!',
    name: 'דני כ.',
    location: 'תל אביב',
    rating: 5,
  },
  {
    id: '2',
    text: 'קיבלתי ייעוץ מעולה בנושא משכנתא וחוזה הדירה שלי. החסכון הכספי היה משמעותי בזכות העצות המקצועיות.',
    name: 'רונית ל.',
    location: 'חיפה',
    rating: 5,
  },
  {
    id: '3',
    text: 'התרשמתי מאוד מהמקצועיות והיחס האישי. עו״ד פרץ הצליח לפתור בעיה משפטית שהטרידה אותי במשך שנים. תודה!',
    name: 'יוסי מ.',
    location: 'ירושלים',
    rating: 5,
  },
  {
    id: '4',
    text: 'מומלץ בחום! ליווי מקצועי ואדיב לכל אורך התהליך המשפטי.',
    name: 'מיכל ש.',
    location: 'רמת גן',
    rating: 5,
  },
];

// Form schema for review submission
const reviewFormSchema = z.object({
  name: z.string().min(2, { message: 'נא להזין שם תקין' }),
  location: z.string().min(2, { message: 'נא להזין מיקום תקין' }),
  rating: z.number().min(1, { message: 'נא לבחור דירוג' }).max(5),
  text: z.string().min(10, { message: 'נא להזין לפחות 10 תווים' }),
  consent: z.boolean().refine(val => val === true, {
    message: 'יש לאשר את פרסום חוות הדעת כדי להמשיך',
  }),
});

// Star Rating Component
const StarRating = ({ rating, interactive = false, onRatingChange = () => {} }) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onRatingChange(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          className={`focus:outline-none ${interactive ? 'cursor-pointer' : 'cursor-default'}`}
          disabled={!interactive}
          aria-label={`${star} stars`}
        >
          <Star
            className={`h-6 w-6 ${
              star <= (interactive ? hoverRating || rating : rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

// Review Card Component
const ReviewCard = ({ review }) => {
  return (
    <Card className="h-full shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] border border-gray-100 bg-white">
      <CardContent className="p-6 h-full flex flex-col">
        <div className="mb-4">
          <StarRating rating={review.rating} />
        </div>
        <blockquote className="text-lg font-rubik italic text-gray-700 mb-6 flex-grow">
          "{review.text}"
        </blockquote>
        <footer className="mt-auto">
          <div className="font-medium">{review.name}</div>
          <div className="text-sm text-gray-500">{review.location}</div>
        </footer>
      </CardContent>
    </Card>
  );
};

// Review Form Component
const ReviewForm = ({ onClose }) => {
  const { user } = useAuth();
  const [selectedRating, setSelectedRating] = useState(0);
  
  const form = useForm({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      name: '',
      location: '',
      rating: 0,
      text: '',
      consent: false,
    },
  });

  const handleRatingChange = (newRating) => {
    setSelectedRating(newRating);
    form.setValue('rating', newRating);
  };

  const onSubmit = async (data) => {
    try {
      // In a real implementation, this would send the review to Firebase
      console.log('Submitting review:', data);
      
      // Show success message
      toast.success('חוות הדעת נשלחה בהצלחה ותפורסם לאחר אישור');
      
      // Reset form and close dialog
      form.reset();
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('אירעה שגיאה בשליחת חוות הדעת. אנא נסה שוב מאוחר יותר.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>שם</FormLabel>
              <FormControl>
                <Input placeholder="שם פרטי ואות ראשונה של שם משפחה" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>עיר</FormLabel>
              <FormControl>
                <Input placeholder="העיר שלך" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>דירוג</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <StarRating 
                    rating={selectedRating} 
                    interactive={true} 
                    onRatingChange={handleRatingChange}
                  />
                  <input type="hidden" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>חוות דעת</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="שתף את החוויה שלך עם עו״ד דני פרץ"
                  className="min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="consent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rtl:space-x-reverse">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  אני מסכים/ה לפרסום חוות הדעת שלי באתר זה
                </FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 rtl:space-x-reverse">
          <Button type="button" variant="outline" onClick={onClose}>
            ביטול
          </Button>
          <Button type="submit" className="bg-law-navy hover:bg-law-navy/90">
            שלח
          </Button>
        </div>
      </form>
    </Form>
  );
};

// Main Reviews Section Component
export const ReviewsSection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reviews, setReviews] = useState(initialReviews);
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const sectionRef = useRef(null);

  // Calculate average rating
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  // Animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.reviews-animate');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section ref={sectionRef} id="reviews" className="py-16 md:py-24 bg-gray-50">
      {/* Add Schema.org markup for SEO */}
      <ReviewsSchemaMarkup reviews={reviews} averageRating={averageRating} />
      
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 reviews-animate opacity-0 transition-all duration-700">
          <div className="flex justify-center mb-4 stars-float">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-8 w-8 fill-yellow-400 text-yellow-400 mx-1" />
            ))}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-law-navy">
            <EditableText id="reviews-section-title">★★★★★ דירוג 5.0 מלקוחות</EditableText>
          </h2>
          <p className="text-xl text-gray-600">
            <EditableText id="reviews-section-subtitle">סיפורים אמיתיים מאנשים שעזרנו להם</EditableText>
          </p>
        </div>

        {/* Reviews Display - Carousel for Mobile, Grid for Desktop */}
        <div className="reviews-animate opacity-0 transition-all duration-700 delay-300">
          {isMobile ? (
            <Carousel className="w-full" opts={{ loop: true, align: "center" }}>
              <CarouselContent>
                {reviews.map((review) => (
                  <CarouselItem key={review.id} className="md:basis-1/2 lg:basis-1/3 p-2">
                    <ReviewCard review={review} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center mt-6">
                <CarouselPrevious className="static translate-y-0 transform-none mx-2" />
                <CarouselNext className="static translate-y-0 transform-none mx-2" />
              </div>
            </Carousel>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>

        {/* "Share Your Experience" Button */}
        <div className="mt-14 text-center reviews-animate opacity-0 transition-all duration-700 delay-600">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-law-navy hover:bg-law-navy/90 text-white px-8 py-6 rounded-md text-lg shadow-md hover:shadow-lg transition-all">
                <EditableText id="reviews-share-button">שתף את החוויה שלך</EditableText>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="text-2xl text-law-navy">
                  <EditableText id="reviews-form-title">שתף את החוויה שלך</EditableText>
                </DialogTitle>
              </DialogHeader>
              <ReviewForm onClose={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Trust Signals */}
        <div className="mt-20 reviews-animate opacity-0 transition-all duration-700 delay-900">
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="flex items-center bg-white px-6 py-3 rounded-md shadow-sm">
              <img src="/placeholder.svg" alt="לשכת עורכי הדין" className="h-12 w-auto" />
              <span className="mr-3 text-gray-700 font-medium">חבר לשכת עורכי הדין</span>
            </div>
            <div className="flex items-center bg-white px-6 py-3 rounded-md shadow-sm">
              <img src="/placeholder.svg" alt="Google Reviews" className="h-12 w-auto" />
              <div className="mr-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">מדורג 5.0 ב-Google</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
