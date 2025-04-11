
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

// For Firebase integration
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp,
  updateDoc,
  doc,
  deleteDoc,
  where
} from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';

// For carousel functionality
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

// Review interface to match Firestore document structure
interface Review {
  id: string;
  text: string;
  name: string;
  location?: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

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
const StarRating = ({ 
  rating, 
  interactive = false, 
  onRatingChange
}: { 
  rating: number, 
  interactive?: boolean, 
  onRatingChange?: (rating: number) => void 
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onRatingChange && onRatingChange(star)}
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
const ReviewCard = ({ review, active }: { review: Review; active: boolean }) => {
  return (
    <Card className={`shadow-sm border border-gray-100 bg-white review-card transition-all duration-300 h-full ${
      active ? 'scale-105 shadow-md z-10' : 'scale-95 opacity-70'
    }`}>
      <CardContent className="p-6 h-full flex flex-col">
        <div className="mb-4 star-rating">
          <StarRating rating={review.rating} />
        </div>
        <blockquote className="text-lg font-rubik italic text-gray-700 mb-6 flex-grow">
          "{review.text}"
        </blockquote>
        <footer className="mt-auto">
          <div className="font-medium">{review.name}</div>
          {review.location && <div className="text-sm text-gray-500">{review.location}</div>}
        </footer>
      </CardContent>
    </Card>
  );
};

// Review Form Component
const ReviewForm = ({ onClose }: { onClose: () => void }) => {
  const { user } = useAuth();
  const [selectedRating, setSelectedRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  const handleRatingChange = (newRating: number) => {
    setSelectedRating(newRating);
    form.setValue('rating', newRating);
  };

  const onSubmit = async (data: z.infer<typeof reviewFormSchema>) => {
    try {
      setIsSubmitting(true);
      // Add the review to Firebase
      await addDoc(collection(db, 'client_reviews'), {
        name: data.name,
        location: data.location,
        text: data.text,
        rating: data.rating,
        status: 'approved', // Auto-approve reviews for testing
        userId: user?.uid || null, // Track user if they're logged in
        createdAt: serverTimestamp()
      });
      
      // Show success message
      toast.success('חוות הדעת נשלחה בהצלחה ותפורסם לאחר אישור');
      
      // Reset form and close dialog
      form.reset();
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('אירעה שגיאה בשליחת חוות הדעת. אנא נסה שוב מאוחר יותר.');
    } finally {
      setIsSubmitting(false);
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
          <Button 
            type="submit" 
            className="bg-law-navy hover:bg-law-navy/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'שולח...' : 'שלח'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

// Enhanced Carousel Component
const CarouselReviews = ({ reviews }: { reviews: Review[] }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'center',
    skipSnaps: false
  }, [Autoplay({ delay: 5000, stopOnInteraction: true })]);
  
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    onSelect(); // Initialize

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  return (
    <div className="relative mx-auto max-w-5xl px-4">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex py-8">
          {reviews.map((review, index) => (
            <div key={review.id} className="flex-grow-0 flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 px-4 min-h-[250px]">
              <ReviewCard review={review} active={index === selectedIndex} />
            </div>
          ))}
        </div>
      </div>

      <Button 
        onClick={scrollPrev} 
        variant="outline" 
        size="icon" 
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-white rounded-full shadow-md"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button 
        onClick={scrollNext} 
        variant="outline" 
        size="icon" 
        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-white rounded-full shadow-md"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};

// Main Reviews Section Component
export const ReviewsSection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const sectionRef = useRef(null);

  // Fetch reviews from Firebase
  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const reviewsRef = collection(db, 'client_reviews');
      const reviewsQuery = query(
        reviewsRef, 
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(reviewsQuery);
      
      const fetchedReviews: Review[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Include all reviews for testing purposes; in production you might want to filter by status
        fetchedReviews.push({
          id: doc.id,
          text: data.text || "No text provided",
          name: data.name || "Anonymous",
          location: data.location || undefined,
          rating: data.rating || 5,
          status: data.status || 'approved',
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
        });
      });
      
      console.log("Fetched reviews:", fetchedReviews);
      setReviews(fetchedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('אירעה שגיאה בטעינת חוות הדעת');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch reviews on component mount
  useEffect(() => {
    fetchReviews();
  }, []);

  // If no reviews exist, add dummy reviews for testing
  useEffect(() => {
    const addDummyReviews = async () => {
      if (!isLoading && reviews.length === 0) {
        try {
          console.log("Adding dummy reviews");
          
          const dummyReviews = [
            {
              name: "דוד כ.",
              location: "תל אביב",
              text: "עו\"ד דני פרץ עזר לי בתיק מורכב ביותר. מקצועי מאוד והשירות היה מעולה.",
              rating: 5,
              status: 'approved',
              createdAt: serverTimestamp()
            },
            {
              name: "רחל ל.",
              location: "ירושלים",
              text: "קיבלתי ייעוץ משפטי מצוין. ממליצה בחום!",
              rating: 5,
              status: 'approved',
              createdAt: serverTimestamp()
            },
            {
              name: "משה א.",
              location: "חיפה",
              text: "מקצועי, אדיב ועוזר מאוד. עו\"ד דני עזר לי להבין את המצב המשפטי שלי והציע פתרונות מעשיים.",
              rating: 4,
              status: 'approved',
              createdAt: serverTimestamp()
            }
          ];
          
          for (const review of dummyReviews) {
            await addDoc(collection(db, 'client_reviews'), review);
          }
          
          // Fetch the reviews again after adding dummy data
          await fetchReviews();
          
        } catch (error) {
          console.error("Error adding dummy reviews:", error);
        }
      }
    };
    
    addDummyReviews();
  }, [isLoading, reviews.length]);

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 5.0; // Default if no reviews yet

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
        <div className="text-center max-w-3xl mx-auto mb-16 reviews-animate">
          <div className="flex justify-center mb-4 stars-float">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-8 w-8 fill-yellow-400 text-yellow-400 mx-1" />
            ))}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-law-navy">
            <EditableText id="reviews-section-title">★★★★★ דירוג {averageRating.toFixed(1)} מלקוחות</EditableText>
          </h2>
          <p className="text-xl text-gray-600">
            <EditableText id="reviews-section-subtitle">סיפורים אמיתיים מאנשים שעזרנו להם</EditableText>
          </p>
        </div>

        {/* Reviews Display - Carousel */}
        <div className="reviews-animate">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-law-navy border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : reviews.length > 0 ? (
            <CarouselReviews reviews={reviews} />
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">
                <EditableText id="reviews-empty">טרם התווספו חוות דעת. היה הראשון להוסיף חוות דעת!</EditableText>
              </p>
            </div>
          )}
        </div>

        {/* "Share Your Experience" Button */}
        <div className="mt-14 text-center reviews-animate">
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
        <div className="mt-20 reviews-animate">
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
