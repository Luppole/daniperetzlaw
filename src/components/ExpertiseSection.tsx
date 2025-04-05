
import React from 'react';
import { Building, Home, FileText, Scale, HandHeart, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function ExpertiseSection() {
  const expertiseAreas = [
    {
      icon: <Building className="h-12 w-12 text-law-blue mb-4 animate-float" />,
      title: 'דיני תאגידים',
      description: 'ליווי משפטי לחברות בהקמה, פירוק, מיזוגים ורכישות',
      link: '#'
    },
    {
      icon: <Home className="h-12 w-12 text-law-blue mb-4 animate-float" />,
      title: 'נדל"ן',
      description: 'ייצוג בעסקאות נדל"ן, הסכמי שכירות, התחדשות עירונית',
      link: '#'
    },
    {
      icon: <FileText className="h-12 w-12 text-law-blue mb-4 animate-float" />,
      title: 'דיני חוזים',
      description: 'עריכת חוזים, פתרון סכסוכים חוזיים, ייעוץ משפטי',
      link: '#'
    },
    {
      icon: <Scale className="h-12 w-12 text-law-blue mb-4 animate-float" />,
      title: 'ליטיגציה',
      description: 'ייצוג בבתי משפט אזרחיים, מסחריים ומנהליים',
      link: '#'
    },
    {
      icon: <HandHeart className="h-12 w-12 text-law-blue mb-4 animate-float" />,
      title: 'דיני משפחה',
      description: 'גירושין, צוואות, ירושות והסכמי ממון',
      link: '#'
    },
    {
      icon: <Users className="h-12 w-12 text-law-blue mb-4 animate-float" />,
      title: 'דיני עבודה',
      description: 'ייצוג עובדים ומעסיקים, הסכמי עבודה, תביעות',
      link: '#'
    }
  ];

  return (
    <section id="expertise" className="section-wrapper">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="section-title">תחומי התמחות</h2>
          <p className="section-subtitle">המומחיות שלנו לשירות הלקוחות</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {expertiseAreas.map((area, index) => (
            <Card key={index} className="border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-law-blue/50 hover-lift animate-on-scroll" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardHeader className="text-center">
                <div className="flex justify-center transform transition-transform hover:scale-110 duration-300">
                  {area.icon}
                </div>
                <CardTitle className="text-xl font-rubik text-law-dark">
                  {area.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-law-gray text-center">
                  {area.description}
                </CardDescription>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="outline" className="text-law-blue border-law-blue hover:bg-law-blue hover:text-white transition-all duration-300 transform hover:-translate-y-1 btn-pulse">
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
