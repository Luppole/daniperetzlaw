
import React from 'react';
import { Building, Home, FileText, Scale, Users, Landmark } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function ExpertiseSection() {
  const expertiseAreas = [
    {
      icon: <Users className="h-12 w-12 text-law-navy mb-4 animate-float" />,
      title: 'דיני משפחה',
      description: 'גירושין, משמורת ילדים, מזונות, הסכמי ממון וייצוג בבית המשפט לענייני משפחה',
      link: '#'
    },
    {
      icon: <Building className="h-12 w-12 text-law-navy mb-4 animate-float" />,
      title: 'חדלות פרעון',
      description: 'ליווי בהליכי פשיטת רגל, הסדרי חובות וייצוג מול נושים',
      link: '#'
    },
    {
      icon: <Home className="h-12 w-12 text-law-navy mb-4 animate-float" />,
      title: 'מקרקעין',
      description: 'עסקאות נדל"ן, ליווי ברכישה ומכירה, התחדשות עירונית ותמ"א 38',
      link: '#'
    },
    {
      icon: <Scale className="h-12 w-12 text-law-navy mb-4 animate-float" />,
      title: 'ליטיגציה',
      description: 'ייצוג בבתי משפט אזרחיים, מסחריים ומנהליים',
      link: '#'
    },
    {
      icon: <Landmark className="h-12 w-12 text-law-navy mb-4 animate-float" />,
      title: 'דיני ירושה',
      description: 'צוואות, ירושות, התנגדויות לצו ירושה וייצוג בסכסוכי ירושה',
      link: '#'
    },
    {
      icon: <FileText className="h-12 w-12 text-law-navy mb-4 animate-float" />,
      title: 'הוצאה לפועל',
      description: 'ייצוג זוכים וחייבים, ביצוע פסקי דין וגביית חובות',
      link: '#'
    }
  ];

  return (
    <section id="expertise" className="section-wrapper">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="section-title text-law-navy">תחומי התמחות</h2>
          <p className="section-subtitle">הניסיון והמקצועיות שלנו לשירותכם</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {expertiseAreas.map((area, index) => (
            <Card 
              key={index} 
              className="border border-gray-200 hover:border-law-navy/30 transition-all duration-500 hover:shadow-lg animate-on-scroll hover:-translate-y-2" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="text-center">
                <div className="flex justify-center transform transition-transform hover:scale-110 duration-300">
                  {area.icon}
                </div>
                <CardTitle className="text-xl font-rubik text-law-navy">
                  {area.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-law-gray text-center">
                  {area.description}
                </CardDescription>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="outline" className="text-law-navy border-law-navy hover:bg-law-navy hover:text-white transition-all duration-300 btn-pulse">
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
