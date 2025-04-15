
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Calendar, ArrowLeft, Search, Filter, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import LikeCount from '@/components/LikeCount';
import { getAllSanityArticles } from '@/services/sanityService';
import { MappedArticle } from '@/types/sanity';
import { Loader2 } from 'lucide-react';
import { animate } from 'motion';

const Articles = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [articles, setArticles] = useState<MappedArticle[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [pageLoaded, setPageLoaded] = useState(false);
  
  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        // Fetch articles from Sanity (with fallback to Firebase)
        const articlesData = await getAllSanityArticles();
        setArticles(articlesData);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(articlesData.map(article => article.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setIsLoading(false);
        setPageLoaded(true);
      }
    };
    
    fetchArticles();
    window.scrollTo(0, 0);
  }, []);

  // Apply Motion animations when page loads
  useEffect(() => {
    if (pageLoaded) {
      // Animate header section
      const pageTitle = document.querySelector('.page-title');
      if (pageTitle) {
        animate(pageTitle, {
          opacity: [0, 1],
          y: [30, 0]
        }, {
          delay: 0.2
        });
      }
      
      const pageDescription = document.querySelector('.page-description');
      if (pageDescription) {
        animate(pageDescription, {
          opacity: [0, 1],
          y: [20, 0]
        }, {
          delay: 0.4
        });
      }
      
      // Animate search section
      const searchFilterContainer = document.querySelector('.search-filter-container');
      if (searchFilterContainer) {
        animate(searchFilterContainer, {
          opacity: [0, 1],
          y: [20, 0],
          scale: [0.98, 1]
        }, {
          delay: 0.6
        });
      }
      
      // Animate articles with staggered delay
      if (!isLoading) {
        articles.forEach((_, index) => {
          const articleElement = document.querySelector(`.article-card-${index}`);
          if (articleElement) {
            animate(articleElement, {
              opacity: [0, 1],
              y: [30, 0]
            }, {
              delay: 0.7 + (index * 0.1 > 1.5 ? 1.5 : index * 0.1) // Cap the max delay
            });
          }
        });
        
        // Animate CTA section
        const ctaSection = document.querySelector('.cta-section');
        if (ctaSection) {
          animate(ctaSection, {
            opacity: [0, 1],
            y: [20, 0]
          }, {
            delay: 1.2
          });
        }
      }
    }
  }, [pageLoaded, isLoading, articles.length]);

  // Filter articles based on search query and category
  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="page-title text-4xl md:text-5xl font-bold font-rubik text-law-navy mb-4 relative inline-block opacity-0">
              מאמרים משפטיים
              <span className="absolute bottom-0 left-0 w-0 h-1 bg-law-navy transform origin-right transition-all duration-700"></span>
            </h1>
            <p className="page-description text-lg text-law-gray max-w-2xl mx-auto font-heebo opacity-0">
              מידע מקצועי עדכני וניתוח משפטי מעמיק בנושאים שונים מעולם המשפט
            </p>
          </div>
          
          {/* Search and Filter */}
          <div className="search-filter-container bg-white shadow-md rounded-lg p-6 mb-12 opacity-0">
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
                  className={`article-card-${index} border border-gray-200 hover:shadow-xl transition-all duration-500 flex flex-col h-full transform hover:-translate-y-2 hover:border-law-navy/30 opacity-0`}
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
                        href={article.slug ? `/articles/${article.slug}` : `/articles/${article.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(article.slug ? `/articles/${article.slug}` : `/articles/${article.id}`);
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
                      onClick={() => navigate(article.slug ? `/articles/${article.slug}` : `/articles/${article.id}`)}
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
            <div className="text-center py-16 bg-law-light rounded-lg opacity-0" ref={(el) => {
              if (el && pageLoaded) {
                motion(el, {
                  opacity: [0, 1],
                  delay: 0.8
                });
              }
            }}>
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
          <div className="cta-section bg-law-navy text-white rounded-lg p-8 mt-16 shadow-lg flex flex-col md:flex-row items-center justify-between opacity-0">
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
