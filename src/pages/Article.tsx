import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Calendar, ArrowRight, Share2, Bookmark, Printer, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import LikeButton from '@/components/LikeButton';
import CommentSection from '@/components/comments/CommentSection';
import { Loader2 } from 'lucide-react';
import { getSanityArticleById, getAllSanityArticles } from '@/services/sanityService';
import { PortableTextRenderer } from '@/components/PortableTextRenderer';
import { MappedArticle } from '@/types/sanity';
import { toast } from 'sonner';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMotion } from '@/hooks/use-motion';

const LEGAL_IMAGES = [
  "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2912&auto=format&fit=crop", // Legal books
  "https://images.unsplash.com/photo-1575505586569-646b2ca898fc?q=80&w=3105&auto=format&fit=crop", // Wooden gavel and law books
  "https://images.unsplash.com/photo-1479142506502-19b3a3b7ff33?q=80&w=2970&auto=format&fit=crop", // Statue of justice
  "https://images.unsplash.com/photo-1542978709-19c95dc3bc7e?q=80&w=3024&auto=format&fit=crop", // Modern law office
  "https://images.unsplash.com/photo-1423592707957-3b212afa6733?q=80&w=3098&auto=format&fit=crop", // Law and justice concept
  "https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=3270&auto=format&fit=crop", // Legal document signing
];

const getFallbackImage = (index = 0) => {
  return LEGAL_IMAGES[index % LEGAL_IMAGES.length];
};

const Article = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<MappedArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState<MappedArticle[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const { animate } = useMotion();

  useEffect(() => {
    const fetchArticleData = async () => {
      setIsLoading(true);
      setImageError(false);
      if (id) {
        console.log('Fetching article with ID or slug:', id);
        const fetchedArticle = await getSanityArticleById(id);
        
        if (fetchedArticle) {
          setArticle(fetchedArticle);
          
          const allArticles = await getAllSanityArticles();
          const filtered = allArticles
            .filter(a => a.id !== fetchedArticle.id)
            .map((article, index) => {
              if (!article.image_url || article.image_url.includes('placeholder')) {
                return {
                  ...article,
                  image_url: getFallbackImage(index)
                };
              }
              return article;
            });
          setRelatedArticles(filtered);
          
          const savedArticles = JSON.parse(localStorage.getItem('savedArticles') || '[]');
          setIsSaved(savedArticles.some((item: string) => item === fetchedArticle.id));
        } else {
          toast.error('המאמר לא נמצא');
        }
      }
      setIsLoading(false);
      setPageLoaded(true);
    };

    fetchArticleData();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (pageLoaded && article) {
      const h1Element = document.querySelector('h1');
      if (h1Element) {
        animate(h1Element, {
          opacity: [0, 1],
          y: [30, 0]
        }, { delay: 0.2 });
      }
      
      const metaElement = document.querySelector('.article-meta');
      if (metaElement) {
        animate(metaElement, {
          opacity: [0, 1],
          y: [20, 0]
        }, { delay: 0.3 });
      }
      
      const imageElement = document.querySelector('.article-image');
      if (imageElement) {
        animate(imageElement, {
          opacity: [0, 1],
          scale: [0.95, 1]
        }, { delay: 0.4 });
      }
      
      const summaryElement = document.querySelector('.article-summary');
      if (summaryElement) {
        animate(summaryElement, {
          opacity: [0, 1],
          x: [-20, 0]
        }, { delay: 0.5 });
      }
      
      const contentElement = document.querySelector('.article-content');
      if (contentElement) {
        animate(contentElement, {
          opacity: [0, 1],
          y: [20, 0]
        }, { delay: 0.6 });
      }
      
      const sidebarElement = document.querySelector('.article-sidebar');
      if (sidebarElement) {
        animate(sidebarElement, {
          opacity: [0, 1],
          x: [30, 0]
        }, { delay: 0.7 });
      }
    }
  }, [pageLoaded, article, animate]);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleShare = () => {
    if (navigator.share && article) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href,
      })
      .then(() => {
        toast.success('המאמר שותף בהצלחה');
      })
      .catch((error) => {
        console.error('Error sharing:', error);
        handleManualShare();
      });
    } else {
      handleManualShare();
    }
  };

  const handleManualShare = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        toast.success('הקישור הועתק ללוח');
      })
      .catch((error) => {
        console.error('Failed to copy:', error);
        toast.error('לא ניתן להעתיק את הקישור');
      });
  };

  const handleSave = () => {
    if (!article?.id) return;
    
    const savedArticles = JSON.parse(localStorage.getItem('savedArticles') || '[]');
    
    if (isSaved) {
      const updatedSavedArticles = savedArticles.filter((articleId: string) => articleId !== article.id);
      localStorage.setItem('savedArticles', JSON.stringify(updatedSavedArticles));
      setIsSaved(false);
      toast.success('המאמר הוסר מהמאמרים השמורים');
    } else {
      savedArticles.push(article.id);
      localStorage.setItem('savedArticles', JSON.stringify(savedArticles));
      setIsSaved(true);
      toast.success('המאמר נשמר בהצלחה');
    }
  };

  const handlePrint = () => {
    window.print();
    toast.success('מדפיס מאמר...');
  };

  const handleShareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleShareToWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(article?.title || '')} - ${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  };

  const handleShareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(article?.title || '')}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleShareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center pt-24">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-law-navy" />
            <p className="text-law-gray">טוען את המאמר...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center pt-24">
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-law-navy mb-4">המאמר לא נמצא</h1>
            <p className="text-law-gray mb-8">המאמר שחיפשת אינו קיים או שהוסר</p>
            <Button 
              onClick={() => navigate('/articles')} 
              className="bg-law-navy hover:bg-law-navy/80"
            >
              חזרה למאמרים
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const articleImage = imageError || !article.image_url ? getFallbackImage() : article.image_url;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-28">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8 flex items-center text-sm text-law-gray">
            <Button 
              variant="ghost" 
              className="p-0 hover:bg-transparent hover:text-law-navy flex items-center"
              onClick={() => navigate('/')}
            >
              דף הבית
            </Button>
            <span className="mx-2">/</span>
            <Button 
              variant="ghost" 
              className="p-0 hover:bg-transparent hover:text-law-navy flex items-center"
              onClick={() => navigate('/articles')}
            >
              מאמרים
            </Button>
            <span className="mx-2">/</span>
            <span className="text-law-navy font-medium truncate max-w-[200px]">{article?.title || 'טוען...'}</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-law-navy mb-14 leading-tight opacity-0">
                {article.title}
              </h1>
              
              <div className="flex flex-wrap items-center mb-16 text-law-gray text-sm article-meta opacity-0">
                <div className="flex items-center ml-6 mb-2">
                  <Calendar className="h-4 w-4 ml-1" />
                  <span>{article.date}</span>
                </div>
                <div className="ml-6 mb-2">
                  <span>מאת: {article.author}</span>
                </div>
                <div className="mb-2">
                  <span>קטגוריה: {article.category}</span>
                </div>
              </div>
              
              <div className="mb-20 overflow-hidden rounded-xl shadow-md max-h-[450px] article-image opacity-0">
                <img 
                  src={articleImage} 
                  alt={article.title}
                  onError={handleImageError}
                  className="w-full h-auto object-cover transform transition-transform duration-500 hover:scale-105" 
                />
              </div>
              
              <div className="bg-law-light p-12 rounded-lg mb-24 border-r-4 border-law-navy article-summary opacity-0">
                <p className="text-xl font-medium text-law-navy leading-relaxed">{article.summary}</p>
              </div>
              
              <div className="article-content opacity-0 prose prose-lg max-w-none prose-headings:text-law-navy prose-headings:font-bold 
                           prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-14 prose-ul:text-gray-700 
                           prose-li:mb-6 prose-a:text-law-navy prose-a:font-medium prose-a:no-underline 
                           hover:prose-a:underline">
                <PortableTextRenderer content={article.content} />
              </div>
              
              <div className="mt-28 pt-10 border-t border-gray-200">
                <LikeButton articleId={article.id} />
              </div>
              
              <div className="mt-16 pt-10 border-t border-gray-200">
                <h4 className="text-lg font-bold mb-6 text-law-navy">שתף את המאמר</h4>
                <div className="flex gap-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Share2 className="ml-2 h-4 w-4" />
                        שתף
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleShareToWhatsApp}>WhatsApp</DropdownMenuItem>
                      <DropdownMenuItem onClick={handleShareToFacebook}>Facebook</DropdownMenuItem>
                      <DropdownMenuItem onClick={handleShareToTwitter}>Twitter</DropdownMenuItem>
                      <DropdownMenuItem onClick={handleShareToLinkedIn}>LinkedIn</DropdownMenuItem>
                      <DropdownMenuItem onClick={handleManualShare}>העתק קישור</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`flex items-center ${isSaved ? 'bg-law-light text-law-navy' : ''}`} 
                    onClick={handleSave}
                  >
                    <Bookmark className={`ml-2 h-4 w-4 ${isSaved ? 'fill-law-navy' : ''}`} />
                    {isSaved ? 'שמור' : 'שמור'}
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center" onClick={handlePrint}>
                    <Printer className="ml-2 h-4 w-4" />
                    הדפס
                  </Button>
                </div>
              </div>
              
              <CommentSection articleId={article.id} />
              
              <div className="mt-24 grid grid-cols-2 gap-8">
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center py-6"
                  onClick={() => {
                    if (relatedArticles.length > 0) {
                      const prevArticle = relatedArticles[relatedArticles.length - 1];
                      navigate(prevArticle.slug ? `/articles/${prevArticle.slug}` : `/articles/${prevArticle.id}`);
                      window.scrollTo(0, 0);
                    }
                  }}
                  disabled={relatedArticles.length === 0}
                >
                  <ArrowRight className="ml-3 h-5 w-5" />
                  המאמר הקודם
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center py-6"
                  onClick={() => {
                    if (relatedArticles.length > 0) {
                      const nextArticle = relatedArticles[0];
                      navigate(nextArticle.slug ? `/articles/${nextArticle.slug}` : `/articles/${nextArticle.id}`);
                      window.scrollTo(0, 0);
                    }
                  }}
                  disabled={relatedArticles.length === 0}
                >
                  המאמר הבא
                  <ArrowLeft className="mr-3 h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div className="lg:col-span-1 article-sidebar opacity-0">
              <Card className="mb-12 p-8 bg-law-light border-none shadow-md hover:shadow-lg transition-shadow relative">
                <div className="flex items-center mb-8">
                  <div className="h-16 w-16 rounded-full overflow-hidden ml-4 border-2 border-white shadow-md">
                    <img 
                      src="/lovable-uploads/41432968-0b99-4cba-9e29-f6fdea6a4272.png" 
                      alt="דני פרץ"
                      className="h-full w-full object-cover" 
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-law-navy text-lg">דני פרץ</h4>
                    <p className="text-law-gray text-sm">עורך דין</p>
                  </div>
                </div>
                <p className="text-law-gray mb-8 leading-relaxed">עו"ד דני פרץ מתמחה בדיני משפחה, חדלות פרעון ומקרקעין. בעל 15+ שנות ניסיון במתן פתרונות משפטיים מקצועיים ואישיים.</p>
                <Button 
                  className="w-full bg-law-navy hover:bg-law-navy/90 py-6 text-base"
                  onClick={() => navigate('/#contact')}
                >
                  צור קשר
                </Button>
              </Card>
              
              <div className="bg-white rounded-lg shadow-md p-8 mb-12">
                <h3 className="text-xl font-bold text-law-navy mb-8 border-r-4 border-law-navy pr-4">מאמרים נוספים</h3>
                <div className="space-y-8">
                  {relatedArticles.slice(0, 3).map((relatedArticle, index) => (
                    <div 
                      key={relatedArticle.id} 
                      className="border-b border-gray-100 pb-8 last:border-0 hover:bg-gray-50 p-4 rounded-lg transition-colors"
                      ref={(el) => {
                        if (el && pageLoaded) {
                          animate(el, {
                            opacity: [0, 1],
                            y: [10, 0],
                            delay: 0.8 + (index * 0.1)
                          });
                        }
                      }}
                      style={{ opacity: 0 }}
                    >
                      <h4 className="font-medium text-law-navy mb-4 hover:text-law-navy/70 transition-colors text-lg">
                        <a 
                          href={relatedArticle.slug ? `/articles/${relatedArticle.slug}` : `/articles/${relatedArticle.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(relatedArticle.slug ? `/articles/${relatedArticle.slug}` : `/articles/${relatedArticle.id}`);
                            window.scrollTo(0, 0);
                          }}
                          className="hover-link"
                        >
                          {relatedArticle.title}
                        </a>
                      </h4>
                      <div className="flex items-center text-sm text-law-gray">
                        <Calendar className="h-3 w-3 ml-1" />
                        <span>{relatedArticle.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div 
                  className="mt-10"
                  ref={(el) => {
                    if (el && pageLoaded) {
                      animate(el, {
                        opacity: [0, 1],
                        y: [10, 0],
                        delay: 1.2
                      });
                    }
                  }}
                  style={{ opacity: 0 }}
                >
                  <Button 
                    variant="outline" 
                    className="w-full border-law-navy text-law-navy hover:bg-law-navy hover:text-white transition-all py-5"
                    onClick={() => navigate('/articles')}
                  >
                    לכל המאמרים
                  </Button>
                </div>
              </div>
              
              <div 
                className="bg-law-navy text-white rounded-lg p-8 shadow-lg"
                ref={(el) => {
                  if (el && pageLoaded) {
                    animate(el, {
                      opacity: [0, 1],
                      y: [20, 0],
                      delay: 1.3
                    });
                  }
                }}
                style={{ opacity: 0 }}
              >
                <h3 className="text-2xl font-bold mb-8">זקוק לייעוץ משפטי?</h3>
                <p className="mb-10 leading-relaxed">אנו מציעים ייעוץ מקצועי בתחומים מגוונים. צור קשר עוד היום לפגישת ייעוץ ראשונית.</p>
                <Button 
                  className="w-full bg-white text-law-navy hover:bg-law-silver hover:text-law-navy py-6 text-lg"
                  onClick={() => navigate('/#contact')}
                >
                  קבע פגישת ייעוץ
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Article;
