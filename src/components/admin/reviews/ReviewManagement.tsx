
import React, { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';
import { Loader2, Star, Trash2, Plus, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

interface Review {
  id: string;
  author: string;
  content: string;
  rating: number;
  created_at: Date;
  approved: boolean;
}

const ReviewManagement: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { user } = useAuth();

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const reviewsRef = collection(db, 'reviews');
      const reviewsQuery = query(reviewsRef, orderBy('created_at', 'desc'));
      const snapshot = await getDocs(reviewsQuery);
      
      const fetchedReviews: Review[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        fetchedReviews.push({
          id: doc.id,
          author: data.author,
          content: data.content,
          rating: data.rating,
          created_at: data.created_at?.toDate() || new Date(),
          approved: data.approved ?? false
        });
      });
      
      setReviews(fetchedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('שגיאה בטעינת חוות הדעת');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleAddReview = async () => {
    if (!author.trim()) {
      toast.error('נא להזין שם מחבר');
      return;
    }
    
    if (!content.trim()) {
      toast.error('נא להזין תוכן חוות דעת');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        author: author.trim(),
        content: content.trim(),
        rating,
        created_at: serverTimestamp(),
        approved: true,
        added_by: user?.uid
      });
      
      toast.success('חוות הדעת נוספה בהצלחה');
      setAuthor('');
      setContent('');
      setRating(5);
      setIsAddDialogOpen(false);
      fetchReviews();
    } catch (error) {
      console.error('Error adding review:', error);
      toast.error('שגיאה בהוספת חוות הדעת');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await deleteDoc(doc(db, 'reviews', reviewId));
      toast.success('חוות הדעת נמחקה בהצלחה');
      fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('שגיאה במחיקת חוות הדעת');
    }
  };

  const handleToggleApproval = async (reviewId: string, currentApproval: boolean) => {
    try {
      await updateDoc(doc(db, 'reviews', reviewId), {
        approved: !currentApproval
      });
      toast.success(currentApproval ? 'חוות הדעת בוטלה' : 'חוות הדעת אושרה');
      fetchReviews();
    } catch (error) {
      console.error('Error updating review approval:', error);
      toast.error('שגיאה בעדכון אישור חוות הדעת');
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const StarRating = ({ value, onChange }: { value: number, onChange?: (rating: number) => void }) => {
    const [hover, setHover] = useState(0);
    
    return (
      <div className="flex space-x-1 flex-row-reverse">
        {[...Array(5)].map((_, i) => {
          const ratingValue = i + 1;
          return (
            <button
              type="button"
              key={ratingValue}
              onClick={() => onChange && onChange(ratingValue)}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(0)}
              className={`focus:outline-none ${!onChange ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <Star 
                className={`h-6 w-6 ${
                  ratingValue <= (hover || value) 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'text-gray-300'
                }`}
              />
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-law-navy">ניהול חוות דעת</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="ml-2 h-4 w-4" /> הוסף חוות דעת
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-right">הוספת חוות דעת חדשה</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-right block text-sm font-medium mb-1">שם המחבר</label>
                <Input 
                  value={author} 
                  onChange={(e) => setAuthor(e.target.value)} 
                  placeholder="שם המחבר"
                  className="text-right"
                />
              </div>
              <div>
                <label className="text-right block text-sm font-medium mb-1">דירוג</label>
                <div className="flex justify-end">
                  <StarRating value={rating} onChange={setRating} />
                </div>
              </div>
              <div>
                <label className="text-right block text-sm font-medium mb-1">תוכן חוות הדעת</label>
                <Textarea 
                  value={content} 
                  onChange={(e) => setContent(e.target.value)} 
                  placeholder="תוכן חוות הדעת"
                  rows={5}
                  className="text-right"
                />
              </div>
            </div>
            <DialogFooter className="sm:justify-start">
              <Button type="button" variant="secondary" onClick={() => setIsAddDialogOpen(false)}>
                ביטול
              </Button>
              <Button 
                onClick={handleAddReview} 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    שומר...
                  </>
                ) : 'הוסף חוות דעת'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-law-navy" />
        </div>
      ) : reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <Card key={review.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center text-base font-medium">
                  <div className="flex items-center">
                    {review.author}
                    <Badge className={`mr-2 ${review.approved ? 'bg-green-500' : 'bg-gray-400'}`}>
                      {review.approved ? 'מאושר' : 'לא מאושר'}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500">{formatDate(review.created_at)}</div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-3">
                  <StarRating value={review.rating} />
                </div>
                <p className="text-gray-700">{review.content}</p>
              </CardContent>
              <CardFooter className="flex justify-end pt-0 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleApproval(review.id, review.approved)}
                  className={review.approved ? 'text-orange-500' : 'text-green-500'}
                >
                  <CheckCircle2 className="h-4 w-4 ml-2" />
                  {review.approved ? 'בטל אישור' : 'אשר'}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 ml-2" />
                      מחק
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-right">האם למחוק חוות דעת זו?</AlertDialogTitle>
                      <AlertDialogDescription className="text-right">
                        פעולה זו לא ניתנת לביטול. חוות הדעת תימחק לצמיתות.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>ביטול</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteReview(review.id)}>
                        מחק
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">אין חוות דעת עדיין. הוסף את חוות הדעת הראשונה!</p>
        </div>
      )}
    </div>
  );
};

export default ReviewManagement;
