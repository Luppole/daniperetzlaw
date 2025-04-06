
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Calendar, ArrowLeft, Search, Filter, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import LikeCount from '@/components/LikeCount';
import { getAllArticles, Article as ArticleType, ensureArticlesExist } from '@/services/articleService';
import { Loader2 } from 'lucide-react';

const Articles = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [articles, setArticles] = useState<ArticleType[]>([]);
  
  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      // Ensure we have some sample articles to display
      await ensureArticlesExist();
      
      // Fetch all articles
      const articlesData = await getAllArticles();
      setArticles(articlesData);
      setIsLoading(false);
    };
    
    fetchArticles();
    window.scrollTo(0, 0);
  }, []);

  // Filter articles based on search query and category
  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchQuery === '' || 
      article.title.includes(searchQuery) ||
      article.summary.includes(searchQuery);
    
    const matchesCategory = selectedCategory === '' || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Categories for filter - extract from articles
  const categories = [...new Set(articles.map(article => article.category))];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold font-rubik text-law-navy mb-4 relative inline-block">
              מאמרים משפטיים
              <span className="absolute bottom-0 left-0 w-0 h-1 bg-law-navy transform origin-right transition-all duration-700 animate-[scale-in_0.7s_ease-out_forwards] hover:w-full" style={{ animationDelay: '0.3s' }}></span>
            </h1>
            <p className="text-lg text-law-gray max-w-2xl mx-auto font-heebo opacity-0 animate-[fade-in_0.5s_ease-out_forwards]" style={{ animationDelay: '0.5s' }}>
              מידע מקצועי עדכני וניתוח משפטי מעמיק בנושאים שונים מעולם המשפט
            </p>
          </div>
          
          {/* Search and Filter */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-12 opacity-0 animate-[fade-in_0.5s_ease-out_forwards] transform translate-y-4 transition-all duration-500" style={{ animationDelay: '0.6s' }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-grow">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-law-gray transition-all duration-300 group-hover:text-law-navy" size={18} />
                <div className="group">
                  <Input 
                    type="search"
                    placeholder="חיפוש מאמרים..."
                    className="pr-10 w-full focus:ring-2 focus:ring-law-navy/30 transition-all duration-300 font-heebo"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <Filter size={18} className="ml-2 text-law-gray" />
                <Button 
                  variant={selectedCategory === '' ? "default" : "outline"}
                  className={selectedCategory === '' ? "bg-law-navy text-white transition-all duration-300 hover:bg-law-navy/90 font-heebo" : "border-law-navy text-law-navy transition-all duration-300 hover:bg-law-navy/10 font-heebo"}
                  onClick={() => setSelectedCategory('')}
                >
                  הכל
                </Button>
                {categories.map(category => (
                  <Button 
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className={selectedCategory === category ? "bg-law-navy text-white transition-all duration-300 hover:bg-law-navy/90 font-heebo" : "border-law-navy text-law-navy transition-all duration-300 hover:bg-law-navy/10 font-heebo"}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Articles Grid */}
          {isLoading ? (
            <div className="flex justify-center my-12">
              <Loader2 className="h-12 w-12 animate-spin text-law-navy" />
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article, index) => (
                <Card 
                  key={article.id} 
                  className="border border-gray-200 hover:shadow-xl transition-all duration-500 flex flex-col h-full transform opacity-0 translate-y-4 hover:-translate-y-2 hover:border-law-navy/30"
                  style={{ 
                    animation: 'fade-in 0.5s ease-out forwards, slide-up 0.5s ease-out forwards',
                    animationDelay: `${0.7 + index * 0.1}s` 
                  }}
                >
                  <div className="h-48 overflow-hidden rounded-t-lg relative group">
                    <div className="absolute inset-0 bg-law-navy/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
                      <Book className="text-white h-12 w-12 transform scale-0 group-hover:scale-100 transition-transform duration-300" />
                    </div>
                    <img 
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-white bg-law-navy px-3 py-1 rounded-full transform transition-all duration-300 hover:translate-x-1 font-heebo">
                        {article.category}
                      </span>
                      <div className="flex items-center text-law-gray text-sm font-heebo">
                        <Calendar className="h-3 w-3 ml-1" />
                        <span>{article.date}</span>
                      </div>
                    </div>
                    <CardTitle className="text-xl font-rubik font-bold text-law-navy line-clamp-2 transition-colors duration-300">
                      <a 
                        href={`/articles/${article.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/articles/${article.id}`);
                          window.scrollTo(0, 0);
                        }}
                        className="hover:text-law-navy/80 focus:outline-none focus:text-law-navy/70"
                      >
                        {article.title}
                      </a>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription className="text-law-gray line-clamp-3 font-heebo">
                      {article.summary}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <Button 
                      variant="ghost" 
                      className="text-law-navy hover:bg-law-navy/10 p-0 group transition-all duration-300 font-heebo"
                      onClick={() => navigate(`/articles/${article.id}`)}
                    >
                      <span className="inline-block transform transition-all duration-300 group-hover:translate-x-[-4px]">המשך קריאה</span>
                      <ArrowLeft className="mr-2 h-4 w-4 transform transition-all duration-300 group-hover:translate-x-[-4px]" />
                    </Button>
                    <LikeCount articleId={article.id} />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-law-light rounded-lg opacity-0 animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <h3 className="text-2xl font-bold font-rubik text-law-navy mb-4">לא נמצאו תוצאות</h3>
              <p className="text-law-gray mb-6 font-heebo">לא נמצאו מאמרים התואמים את החיפוש שלך</p>
              <Button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                }} 
                className="bg-law-navy hover:bg-law-navy/90 transition-all duration-300 transform hover:scale-105 font-heebo"
              >
                הצג את כל המאמרים
              </Button>
            </div>
          )}
          
          {/* Call to Action */}
          <div className="bg-law-navy text-white rounded-lg p-8 mt-16 shadow-lg flex flex-col md:flex-row items-center justify-between opacity-0 animate-[fade-in_0.7s_ease-out_forwards] transform translate-y-4" style={{ animationDelay: '1s' }}>
            <div className="mb-6 md:mb-0 text-center md:text-right">
              <h3 className="text-2xl font-bold font-rubik mb-2">מעוניין בייעוץ משפטי?</h3>
              <p className="text-law-silver max-w-xl font-heebo">צור קשר עוד היום לקביעת פגישת ייעוץ עם עו"ד דני פרץ בנושאים משפטיים מגוונים</p>
            </div>
            <Button 
              className="bg-white text-law-navy hover:bg-law-silver hover:text-law-navy transform transition-all duration-300 hover:scale-105 hover:shadow-xl font-heebo"
              onClick={() => navigate('/#contact')}
            >
              צור קשר עכשיו
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default Articles;
