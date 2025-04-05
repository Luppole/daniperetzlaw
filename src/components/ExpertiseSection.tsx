
import React from 'react';
import { Building, Home, FileText, Scale, Users, Landmark } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function ExpertiseSection() {
  const navigate = useNavigate();
  
  const handleExpertiseClick = (area: string) => {
    // Navigate to a dedicated page for each expertise area
    navigate(`/expertise/${area.toLowerCase().replace(/\s+/g, '-')}`);
  };
  
  const expertiseAreas = [
    {
      id: 'family-law',
      icon: <Users className="h-12 w-12 text-law-navy mb-4 animate-float" />,
      title: 'דיני משפחה',
      description: 'גירושין, משמורת ילדים, מזונות, הסכמי ממון וייצוג בבית המשפט לענייני משפחה',
    },
    {
      id: 'bankruptcy',
      icon: <Building className="h-12 w-12 text-law-navy mb-4 animate-float" />,
      title: 'חדלות פרעון',
      description: 'ליווי בהליכי פשיטת רגל, הסדרי חובות וייצוג מול נושים',
    },
    {
      id: 'real-estate',
      icon: <Home className="h-12 w-12 text-law-navy mb-4 animate-float" />,
      title: 'מקרקעין',
      description: 'עסקאות נדל"ן, ליווי ברכישה ומכירה, התחדשות עירונית ותמ"א 38',
    },
    {
      id: 'litigation',
      icon: <Scale className="h-12 w-12 text-law-navy mb-4 animate-float" />,
      title: 'ליטיגציה',
      description: 'ייצוג בבתי משפט אזרחיים, מסחריים ומנהליים',
    },
    {
      id: 'inheritance',
      icon: <Landmark className="h-12 w-12 text-law-navy mb-4 animate-float" />,
      title: 'דיני ירושה',
      description: 'צוואות, ירושות, התנגדויות לצו ירושה וייצוג בסכסוכי ירושה',
    },
    {
      id: 'execution',
      icon: <FileText className="h-12 w-12 text-law-navy mb-4 animate-float" />,
      title: 'הוצאה לפועל',
      description: 'ייצוג זוכים וחייבים, ביצוע פסקי דין וגביית חובות',
    }
  ];

  return (
    <section id="expertise" className="section-wrapper relative overflow-hidden">
      {/* Dynamic background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-law-light/30 pointer-events-none"></div>
      <div className="absolute -right-32 -top-32 w-64 h-64 bg-law-navy/5 rounded-full filter blur-3xl"></div>
      <div className="absolute -left-32 bottom-0 w-96 h-96 bg-law-navy/5 rounded-full filter blur-3xl"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="section-title text-law-navy text-4xl md:text-5xl lg:text-6xl mb-6 font-bold">תחומי התמחות</h2>
          <p className="section-subtitle text-xl md:text-2xl">הניסיון והמקצועיות שלנו לשירותכם</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {expertiseAreas.map((area, index) => (
            <Card 
              key={area.id} 
              className="border border-gray-200 hover:border-law-navy/30 transition-all duration-500 hover:shadow-lg animate-on-scroll hover:-translate-y-2 bg-white/80 backdrop-blur-sm"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center transform transition-transform hover:scale-110 duration-300">
                  {area.icon}
                </div>
                <CardTitle className="text-2xl font-rubik text-law-navy">
                  {area.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <CardDescription className="text-law-gray text-center text-base">
                  {area.description}
                </CardDescription>
              </CardContent>
              <CardFooter className="flex justify-center pb-6">
                <Button 
                  variant="outline" 
                  className="text-law-navy border-law-navy hover:bg-law-navy hover:text-white transition-all duration-300 btn-pulse"
                  onClick={() => navigate(`/articles?category=${area.id}`)}
                >
                  קרא עוד
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
