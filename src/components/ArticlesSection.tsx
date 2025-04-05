
import React, { useRef } from 'react';
import { Calendar, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

export function ArticlesSection() {
  const navigate = useNavigate();
  
  // Use intersection observer to trigger animations when elements come into view
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const articles = [
    {
      id: '1',
      title: 'חידושים בדיני חוזים: פסיקה אחרונה של בית המשפט העליון',
      date: '12 מרץ, 2025',
      summary: 'סקירה מקיפה של פסיקת בית המשפט העליון בנושא דיני חוזים בשנה האחרונה והשלכותיה על עסקאות מסחריות.',
      link: '/article/1',
      image: 'https://images.unsplash.com/photo-1589578527966-fdac0f44566c?q=80&w=1287&auto=format&fit=crop'
    },
    {
      id: '2',
      title: 'יתרונות וחסרונות של הסכם ממון לפני נישואין',
      date: '5 פברואר, 2025',
      summary: 'מאמר מקיף על היתרונות, החסרונות והשיקולים לעריכת הסכם ממון לפני נישואין, כולל דוגמאות מהפסיקה.',
      link: '/article/2',
      image: 'https://images.unsplash.com/photo-1565619624098-cf4168a7cd9d?q=80&w=1026&auto=format&fit=crop'
    },
    {
      id: '3',
      title: 'זכויות עובדים בתקופת משבר: מה שחשוב לדעת',
      date: '18 ינואר, 2025',
      summary: 'סקירה של זכויות עובדים בתקופות משבר, כולל התייחסות למשבר הקורונה והשלכותיו על יחסי עובד-מעביד.',
      link: '/article/3',
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1169&auto=format&fit=crop'
    }
  ];

  return (
    <section id="articles" className="section-wrapper bg-law-light py-16">
      <div className="container mx-auto" ref={ref}>
        <div className={`text-center mb-16 transition-all duration-700 transform ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="section-title text-3xl md:text-4xl font-bold font-rubik text-law-navy mb-4 relative inline-block">
            מאמרים משפטיים
          </h2>
          <p className="section-subtitle text-lg text-law-gray transition-opacity duration-700 delay-200 font-heebo" 
             style={{ opacity: inView ? 1 : 0, transitionDelay: '400ms' }}>
            ידע וחדשות מעולם המשפט
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <Card 
              key={article.id} 
              className={`border border-gray-200 hover:shadow-lg transition-all duration-500 flex flex-col h-full transform hover:translate-y-[-5px] hover:border-law-navy/30 ${inView ? 'animate-fade-in' : 'opacity-0'}`}
              style={{ 
                animationDelay: `${(index * 0.15) + 0.5}s`,
                transitionDelay: `${index * 0.1}s`
              }}
            >
              <div className="h-48 overflow-hidden rounded-t-lg">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <CardHeader>
                <div className="flex items-center mb-3 text-law-gray">
                  <Calendar className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:scale-110" />
                  <span className="text-sm font-heebo">{article.date}</span>
                </div>
                <CardTitle className="text-xl font-rubik font-bold text-law-navy line-clamp-2 group">
                  <a 
                    href={article.link}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(article.link);
                      window.scrollTo(0, 0);
                    }}
                    className="hover:text-law-navy/80 transition-colors duration-300"
                  >
                    {article.title}
                  </a>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-law-gray line-clamp-4 font-heebo">
                  {article.summary}
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="ghost" 
                  className="text-law-navy hover:bg-law-navy/10 p-0 group transition-all duration-300 font-heebo"
                  onClick={() => {
                    navigate(article.link);
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
        
        <div className={`text-center mt-12 transition-all duration-700 delay-500 transform ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
             style={{ transitionDelay: '800ms' }}>
          <Button 
            variant="outline" 
            className="border-law-navy text-law-navy hover:bg-law-navy hover:text-white transition-all duration-300 transform hover:scale-105 font-heebo"
            onClick={() => {
              navigate('/articles');
              window.scrollTo(0, 0);
            }}
          >
            לכל המאמרים
          </Button>
        </div>
      </div>
    </section>
  );
}
