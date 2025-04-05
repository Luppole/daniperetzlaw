
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
import { getArticleById, Article as ArticleType, getAllArticles } from '@/services/articleService';
import { supabase } from '@/integrations/supabase/client';

const Article = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<ArticleType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState<ArticleType[]>([]);

  useEffect(() => {
    const fetchArticleData = async () => {
      setIsLoading(true);
      if (id) {
        const fetchedArticle = await getArticleById(id);
        setArticle(fetchedArticle);
        
        const allArticles = await getAllArticles();
        const filtered = allArticles.filter(a => a.id !== id);
        setRelatedArticles(filtered);
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

  // Improve the content with better spacing and fewer images
  const enhancedContent = article.content
    .replace(/<h2>/g, '<h2 class="text-2xl font-bold text-law-navy mt-10 mb-6">')
    .replace(/<h3>/g, '<h3 class="text-xl font-semibold text-law-navy mt-8 mb-4">')
    .replace(/<p>/g, '<p class="text-gray-700 leading-relaxed mb-6 text-lg">')
    .replace(/<ul>/g, '<ul class="list-disc list-inside mb-6 ml-6 space-y-2 text-gray-700">')
    .replace(/<li>/g, '<li class="mb-2">')
    // Add an image after every third h2 tag instead of after every h2
    .replace(
      /(<\/h2>)(?:(?!<\/h2>).)*?(<\/h2>)(?:(?!<\/h2>).)*?(<\/h2>)/g, 
      (match, p1, p2, p3) => 
        p1 + p2 + p3 + 
        '<div class="my-10 mx-auto w-4/5 max-w-3xl">' +
        '<img src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2912&auto=format&fit=crop" ' +
        'class="w-full h-auto object-cover rounded-lg shadow-md" alt="Legal concept image" />' +
        '<p class="text-sm text-center text-gray-500 mt-2 italic">תמונה להמחשה בלבד</p>' +
        '</div>'
    );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-20">
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
              onClick={() => navigate('/#articles')}
            >
              מאמרים
            </Button>
            <span className="mx-2">/</span>
            <span className="text-law-navy font-medium truncate max-w-[200px]">{article.title}</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 animate-fade-in">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-law-navy mb-8 leading-tight">{article.title}</h1>
              
              <div className="flex flex-wrap items-center mb-10 text-law-gray text-sm">
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
              
              <div className="mb-12 overflow-hidden rounded-xl shadow-md max-h-[350px]">
                <img 
                  src={article.image_url} 
                  alt={article.title}
                  className="w-full h-auto object-cover transform transition-transform duration-500 hover:scale-105" 
                />
              </div>
              
              <div className="bg-law-light p-8 rounded-lg mb-12 border-r-4 border-law-navy">
                <p className="text-xl font-medium text-law-navy leading-relaxed">{article.summary}</p>
              </div>
              
              <div 
                className="prose prose-lg max-w-none prose-headings:text-law-navy prose-headings:font-bold 
                          prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-8 prose-ul:text-gray-700 
                          prose-li:mb-3 prose-a:text-law-navy prose-a:font-medium prose-a:no-underline 
                          hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: enhancedContent }}
              />
              
              <div className="mt-16 pt-8 border-t border-gray-200">
                <LikeButton articleId={article.id} />
              </div>
              
              <div className="mt-10 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-bold mb-6 text-law-navy">שתף את המאמר</h4>
                <div className="flex gap-4">
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
              
              <CommentSection articleId={article.id} />
              
              <div className="mt-16 grid grid-cols-2 gap-6">
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center py-6"
                  onClick={() => {
                    const prevId = String(parseInt(id || '0') - 1);
                    if (parseInt(prevId) > 0) {
                      navigate(`/article/${prevId}`);
                      window.scrollTo(0, 0);
                    }
                  }}
                  disabled={parseInt(id || '0') <= 1}
                >
                  <ArrowRight className="ml-3 h-5 w-5" />
                  המאמר הקודם
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center py-6"
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
                  <ArrowLeft className="mr-3 h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <Card className="mb-10 p-8 bg-law-light border-none shadow-md hover:shadow-lg transition-shadow animate-fade-in sticky top-24">
                <div className="flex items-center mb-6">
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
                <p className="text-law-gray mb-6 leading-relaxed">עו"ד דני פרץ מתמחה בדיני משפחה, חדלות פרעון ומקרקעין. בעל 15+ שנות ניסיון במתן פתרונות משפטיים מקצועיים ואישיים.</p>
                <Button 
                  className="w-full bg-law-navy hover:bg-law-navy/90 py-6 text-base"
                  onClick={() => navigate('/#contact')}
                >
                  צור קשר
                </Button>
              </Card>
              
              <div className="bg-white rounded-lg shadow-md p-8 mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-xl font-bold text-law-navy mb-8 border-r-4 border-law-navy pr-4">מאמרים נוספים</h3>
                <div className="space-y-6">
                  {relatedArticles.slice(0, 3).map((relatedArticle) => (
                    <div key={relatedArticle.id} className="border-b border-gray-100 pb-6 last:border-0 hover:bg-gray-50 p-3 rounded-lg transition-colors">
                      <h4 className="font-medium text-law-navy mb-3 hover:text-law-navy/70 transition-colors text-lg">
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
                <div className="mt-8">
                  <Button 
                    variant="outline" 
                    className="w-full border-law-navy text-law-navy hover:bg-law-navy hover:text-white transition-all py-5"
                    onClick={() => navigate('/#articles')}
                  >
                    לכל המאמרים
                  </Button>
                </div>
              </div>
              
              <div className="bg-law-navy text-white rounded-lg p-8 shadow-lg animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <h3 className="text-2xl font-bold mb-6">זקוק לייעוץ משפטי?</h3>
                <p className="mb-8 leading-relaxed">אנו מציעים ייעוץ מקצועי בתחומים מגוונים. צור קשר עוד היום לפגישת ייעוץ ראשונית.</p>
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
