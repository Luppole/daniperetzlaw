
import React, { useEffect, useState } from 'react';
import { Calendar, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import LikeCount from '@/components/LikeCount';
import { MappedArticle } from '@/types/sanity';
import { getAllSanityArticles } from '@/services/sanityService';
import { Loader2 } from 'lucide-react';
import { EditableText } from '@/components/EditableText';
import { animate } from '@/hooks/use-motion';

// Legal-themed high-quality images
const LEGAL_IMAGES = [
  "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2912&auto=format&fit=crop", // Legal books
  "https://images.unsplash.com/photo-1575505586569-646b2ca898fc?q=80&w=3105&auto=format&fit=crop", // Wooden gavel and law books
  "https://images.unsplash.com/photo-1479142506502-19b3a3b7ff33?q=80&w=2970&auto=format&fit=crop", // Statue of justice
  "https://images.unsplash.com/photo-1542978709-19c95dc3bc7e?q=80&w=3024&auto=format&fit=crop", // Modern law office
  "https://images.unsplash.com/photo-1423592707957-3b212afa6733?q=80&w=3098&auto=format&fit=crop", // Law and justice concept
  "https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=3270&auto=format&fit=crop", // Legal document signing
];

export function ArticlesSection() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<MappedArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const articlesData = await getAllSanityArticles();
        
        const enhancedArticles = articlesData.slice(0, 3).map((article, index) => {
          if (!article.image_url || article.image_url.includes('placeholder')) {
            return {
              ...article,
              image_url: LEGAL_IMAGES[index % LEGAL_IMAGES.length]
            };
          }
          return article;
        });
        
        setArticles(enhancedArticles);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArticles();
  }, []);

  useEffect(() => {
    // Apply Motion animations when section is in view
    if (inView && articles.length > 0) {
      // Animate title
      const titleElement = document.querySelector('.section-title');
      if (titleElement) {
        animate(titleElement, {
          opacity: [0, 1],
          y: [30, 0]
        }, { delay: 0.2 });
      }
      
      // Animate subtitle
      const subtitleElement = document.querySelector('.section-subtitle');
      if (subtitleElement) {
        animate(subtitleElement, {
          opacity: [0, 1],
          y: [20, 0]
        }, { delay: 0.4 });
      }
      
      // Animate article cards with staggered delay
      articles.forEach((_, index) => {
        const cardElement = document.querySelector(`.article-card-${index}`);
        if (cardElement) {
          animate(cardElement, {
            opacity: [0, 1],
            y: [30, 0],
            scale: [0.95, 1]
          }, { delay: 0.5 + (index * 0.15) });
        }
      });
    }
  }, [inView, articles.length]);

  const handleImageError = (articleId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [articleId]: true
    }));
  };

  const getImageForArticle = (article: MappedArticle, index: number) => {
    if (imageErrors[article.id] || !article.image_url || article.image_url.includes('placeholder')) {
      return LEGAL_IMAGES[index % LEGAL_IMAGES.length];
    }
    return article.image_url;
  };

  return (
    <section id="articles" className="section-wrapper bg-law-light py-20">
      <div className="container mx-auto" ref={ref}>
        <div className="text-center mb-20">
          <h2 className="section-title text-3xl md:text-4xl font-bold font-rubik text-law-navy mb-6 relative inline-block opacity-0">
            <EditableText id="articles-title">מאמרים משפטיים</EditableText>
          </h2>
          <p className="section-subtitle text-lg text-law-gray font-heebo opacity-0">
            <EditableText id="articles-subtitle">ידע וחדשות מעולם המשפט</EditableText>
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-law-navy" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {articles.map((article, index) => (
              <Card 
                key={article.id} 
                className={`article-card-${index} border border-gray-200 hover:shadow-lg transition-all duration-500 flex flex-col h-full transform hover:translate-y-[-5px] hover:border-law-navy/30 opacity-0`}
              >
                <div className="h-52 overflow-hidden rounded-t-lg">
                  <img 
                    src={getImageForArticle(article, index)} 
                    alt={article.title}
                    onError={() => handleImageError(article.id)}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <CardHeader className="pt-6 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-law-gray">
                      <Calendar className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:scale-110" />
                      <span className="text-sm font-heebo">{article.date}</span>
                    </div>
                    <LikeCount articleId={article.id} />
                  </div>
                  <CardTitle className="text-xl font-rubik font-bold text-law-navy line-clamp-2 group">
                    <a 
                      href={article.slug ? `/articles/${article.slug}` : `/articles/${article.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(article.slug ? `/articles/${article.slug}` : `/articles/${article.id}`);
                        window.scrollTo(0, 0);
                      }}
                      className="hover:text-law-navy/80 transition-colors duration-300"
                    >
                      {article.title}
                    </a>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow pt-2 pb-4">
                  <CardDescription className="text-law-gray line-clamp-4 font-heebo text-base">
                    {article.summary}
                  </CardDescription>
                </CardContent>
                <CardFooter className="pt-2 pb-6">
                  <Button 
                    variant="ghost" 
                    className="text-law-navy hover:bg-law-navy/10 p-0 group transition-all duration-300 font-heebo"
                    onClick={() => {
                      navigate(article.slug ? `/articles/${article.slug}` : `/articles/${article.id}`);
                      window.scrollTo(0, 0);
                    }}
                  >
                    <span className="inline-block transform transition-all duration-300 group-hover:translate-x-[-4px]">המשך קריאה</span>
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:mr-3 transform transition-all duration-300 group-hover:translate-x-[-4px]" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        
        <div 
          className="text-center mt-16 opacity-0"
          style={{ transform: 'translateY(20px)' }}
          ref={(el) => {
            if (el && inView) {
              animate(el, {
                opacity: [0, 1],
                y: [20, 0]
              }, { delay: 0.8 });
            }
          }}
        >
          <Button 
            variant="outline" 
            className="border-law-navy text-law-navy hover:bg-law-navy hover:text-white transition-all duration-300 transform hover:scale-105 font-heebo py-6 px-8"
            onClick={() => {
              navigate('/articles');
              window.scrollTo(0, 0);
            }}
          >
            <EditableText id="articles-view-all">לכל המאמרים</EditableText>
          </Button>
        </div>
      </div>
    </section>
  );
}
