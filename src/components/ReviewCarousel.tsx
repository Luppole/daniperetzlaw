
import React, { useEffect, useState } from 'react';
import { StarIcon } from 'lucide-react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { EditableText } from '@/components/EditableText';
import { AnimatePresence, motion } from 'framer-motion';

type Review = {
  id: string;
  author: string;
  content: string;
  rating: number;
  authorImageUrl?: string;
};

const ReviewCarousel: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const reviewsRef = collection(db, 'reviews');
    const reviewsQuery = query(
      reviewsRef, 
      where('approved', '==', true),
      orderBy('created_at', 'desc')
    );

    const unsubscribe = onSnapshot(reviewsQuery, (snapshot) => {
      const fetchedReviews: Review[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        fetchedReviews.push({
          id: doc.id,
          author: data.user_profile?.full_name || data.author || 'לקוח מרוצה',
          content: data.content,
          rating: data.rating || 5,
          authorImageUrl: data.user_profile?.avatar_url || data.authorImageUrl,
        });
      });
      setReviews(fetchedReviews);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <StarIcon
          key={i}
          className={`h-5 w-5 ${
            i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
        />
      ));
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="mt-20 mb-24">
        <h2 className="text-3xl font-bold text-center mb-8 text-law-navy">
          <EditableText id="reviews-carousel-title">חוות דעת</EditableText>
        </h2>
        <div className="flex justify-center">
          <div className="w-full max-w-3xl">
            <div className="grid grid-cols-1 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                    <Skeleton className="h-20 w-full mt-4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section id="reviews" className="mt-20 mb-24 overflow-hidden px-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-law-navy">
        <EditableText id="reviews-carousel-title">חוות דעת</EditableText>
      </h2>
      <div className="mx-auto max-w-5xl">
        <Carousel
          opts={{
            align: "center",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {reviews.map((review) => (
              <CarouselItem key={review.id} className="md:basis-1/2 lg:basis-1/3 pl-4 py-6">
                <motion.div 
                  className="h-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="border border-gray-100 shadow-md h-full hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                          <AvatarImage src={review.authorImageUrl} alt={review.author} />
                          <AvatarFallback className="bg-law-navy text-white">
                            {getInitials(review.author)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-law-navy">{review.author}</p>
                          <div className="flex mt-1">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 mt-3 flex-grow">
                        "{review.content}"
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute -bottom-5 left-0 right-0 flex justify-center gap-2 py-4">
            <CarouselPrevious className="relative inset-auto translate-y-0 mr-2" />
            <CarouselNext className="relative inset-auto translate-y-0 ml-2" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default ReviewCarousel;
