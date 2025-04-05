
import React from 'react';
import { Calendar, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function ArticlesSection() {
  const navigate = useNavigate();
  
  const articles = [
    {
      id: '1',
      title: 'חידושים בדיני חוזים: פסיקה אחרונה של בית המשפט העליון',
      date: '12 מרץ, 2025',
      summary: 'סקירה מקיפה של פסיקת בית המשפט העליון בנושא דיני חוזים בשנה האחרונה והשלכותיה על עסקאות מסחריות.',
      link: '/article/1'
    },
    {
      id: '2',
      title: 'יתרונות וחסרונות של הסכם ממון לפני נישואין',
      date: '5 פברואר, 2025',
      summary: 'מאמר מקיף על היתרונות, החסרונות והשיקולים לעריכת הסכם ממון לפני נישואין, כולל דוגמאות מהפסיקה.',
      link: '/article/2'
    },
    {
      id: '3',
      title: 'זכויות עובדים בתקופת משבר: מה שחשוב לדעת',
      date: '18 ינואר, 2025',
      summary: 'סקירה של זכויות עובדים בתקופות משבר, כולל התייחסות למשבר הקורונה והשלכותיו על יחסי עובד-מעביד.',
      link: '/article/3'
    }
  ];

  return (
    <section id="articles" className="section-wrapper bg-law-light">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">מאמרים משפטיים</h2>
          <p className="section-subtitle">ידע וחדשות מעולם המשפט</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <Card 
              key={article.id} 
              className="border border-gray-200 hover:shadow-lg transition-shadow flex flex-col h-full transform transition-transform hover:translate-y-[-5px] animate-on-scroll"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <CardHeader>
                <div className="flex items-center mb-3 text-law-gray">
                  <Calendar className="h-4 w-4 ml-2" />
                  <span className="text-sm">{article.date}</span>
                </div>
                <CardTitle className="text-xl font-serif text-law-dark line-clamp-2">
                  {article.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-law-gray line-clamp-4">
                  {article.summary}
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="ghost" 
                  className="text-law-navy hover:bg-law-navy/10 p-0 group"
                  onClick={() => navigate(article.link)}
                >
                  <span className="group-hover:mr-1 transition-all">המשך קריאה</span>
                  <ArrowLeft className="mr-2 h-4 w-4 group-hover:mr-3 transition-all" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            className="border-law-navy text-law-navy hover:bg-law-navy hover:text-white transition-all duration-300 transform hover:scale-105"
            onClick={() => navigate('/articles')}
          >
            לכל המאמרים
          </Button>
        </div>
      </div>
    </section>
  );
}
