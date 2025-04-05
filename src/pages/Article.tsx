
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Calendar, ArrowRight, Share2, Bookmark, Printer, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import LikeButton from '@/components/LikeButton';
import CommentSection from '@/components/CommentSection';
import { Loader2 } from 'lucide-react';
import { getArticleById, Article as ArticleType } from '@/services/articleService';

const Article = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<ArticleType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState<ArticleType[]>([]);

  // Fetch article and related articles
  useEffect(() => {
    const fetchArticleData = async () => {
      setIsLoading(true);
      if (id) {
        // Fetch current article
        const fetchedArticle = await getArticleById(id);
        setArticle(fetchedArticle);
        
        // Fetch related articles (all except current)
        const { data: allArticles, error } = await supabase
          .from('articles')
          .select('*')
          .neq('id', id);
        
        if (!error && allArticles) {
          setRelatedArticles(allArticles);
        }
      }
      setIsLoading(false);
    };

    fetchArticleData();
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
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
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-law-navy mb-4">המאמר לא נמצא</h1>
            <p className="text-law-gray mb-8">המאמר שחיפשת אינו קיים או שהוסר</p>
            <Button 
              onClick={() => navigate('/#articles')} 
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
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
              onClick={() => navigate('/#articles')}
            >
              מאמרים
            </Button>
            <span className="mx-2">/</span>
            <span className="text-law-navy font-medium truncate max-w-[200px]">{article.title}</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 animate-fade-in">
              <h1 className="text-3xl md:text-4xl font-bold text-law-navy mb-6">{article.title}</h1>
              
              {/* Article Meta */}
              <div className="flex flex-wrap items-center mb-8 text-law-gray text-sm">
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
              
              {/* Article Image */}
              <div className="mb-8 overflow-hidden rounded-lg shadow-md">
                <img 
                  src={article.image_url} 
                  alt={article.title}
                  className="w-full h-auto object-cover transform transition-transform duration-500 hover:scale-105" 
                />
              </div>
              
              {/* Article Summary */}
              <div className="bg-law-light p-6 rounded-lg mb-8 border-r-4 border-law-navy">
                <p className="text-lg font-medium text-law-navy">{article.summary}</p>
              </div>
              
              {/* Article Content */}
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
              
              {/* Like Button */}
              <div className="mt-8">
                <LikeButton articleId={article.id} />
              </div>
              
              {/* Share Buttons */}
              <div className="mt-10 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-bold mb-4 text-law-navy">שתף את המאמר</h4>
                <div className="flex space-x-3 space-x-reverse">
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Share2 className="ml-2 h-4 w-4" />
                    שתף
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Bookmark className="ml-2 h-4 w-4" />
                    שמור
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Printer className="ml-2 h-4 w-4" />
                    הדפס
                  </Button>
                </div>
              </div>
              
              {/* Comment Section */}
              <CommentSection articleId={article.id} />
              
              {/* Navigation between articles */}
              <div className="mt-10 grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center"
                  onClick={() => {
                    const prevId = String(parseInt(id || '0') - 1);
                    if (parseInt(prevId) > 0) {
                      navigate(`/article/${prevId}`);
                      window.scrollTo(0, 0);
                    }
                  }}
                  disabled={parseInt(id || '0') <= 1}
                >
                  <ArrowRight className="ml-2 h-4 w-4" />
                  המאמר הקודם
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center"
                  onClick={() => {
                    const nextId = String(parseInt(id || '0') + 1);
                    if (relatedArticles.some(article => article.id === nextId)) {
                      navigate(`/article/${nextId}`);
                      window.scrollTo(0, 0);
                    }
                  }}
                  disabled={!relatedArticles.some(article => article.id === String(parseInt(id || '0') + 1))}
                >
                  המאמר הבא
                  <ArrowLeft className="mr-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Author Card */}
              <Card className="mb-8 p-6 bg-law-light border-none shadow-md hover:shadow-lg transition-shadow animate-fade-in">
                <div className="flex items-center mb-4">
                  <div className="h-16 w-16 rounded-full overflow-hidden ml-4">
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
                <p className="text-law-gray mb-4">עו"ד דני פרץ מתמחה בדיני משפחה, חדלות פרעון ומקרקעין. בעל 15+ שנות ניסיון במתן פתרונות משפטיים מקצועיים ואישיים.</p>
                <Button 
                  className="w-full bg-law-navy hover:bg-law-navy/90"
                  onClick={() => navigate('/#contact')}
                >
                  צור קשר
                </Button>
              </Card>
              
              {/* Related Articles */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-xl font-bold text-law-navy mb-6 border-r-4 border-law-navy pr-4">מאמרים נוספים</h3>
                <div className="space-y-4">
                  {relatedArticles.slice(0, 3).map((relatedArticle) => (
                    <div key={relatedArticle.id} className="border-b border-gray-100 pb-4 last:border-0">
                      <h4 className="font-medium text-law-navy mb-2 hover:text-law-navy/70 transition-colors">
                        <a 
                          href={`/article/${relatedArticle.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/article/${relatedArticle.id}`);
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
                <div className="mt-6">
                  <Button 
                    variant="outline" 
                    className="w-full border-law-navy text-law-navy hover:bg-law-navy hover:text-white transition-all"
                    onClick={() => navigate('/#articles')}
                  >
                    לכל המאמרים
                  </Button>
                </div>
              </div>
              
              {/* Call to Action */}
              <div className="bg-law-navy text-white rounded-lg p-6 shadow-lg animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <h3 className="text-xl font-bold mb-4">זקוק לייעוץ משפטי?</h3>
                <p className="mb-6">אנו מציעים ייעוץ מקצועי בתחומים מגוונים. צור קשר עוד היום לפגישת ייעוץ ראשונית.</p>
                <Button 
                  className="w-full bg-white text-law-navy hover:bg-law-silver hover:text-law-navy"
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
