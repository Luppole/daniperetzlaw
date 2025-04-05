
import React from 'react';
import { Button } from '@/components/ui/button';
import { Award, BookOpen, Scale, Users } from 'lucide-react';

export function AboutSection() {
  const stats = [
    { icon: <Users className="h-8 w-8 text-law-blue" />, value: '300+', label: 'לקוחות מרוצים' },
    { icon: <Award className="h-8 w-8 text-law-blue" />, value: '15+', label: 'שנות ניסיון' },
    { icon: <Scale className="h-8 w-8 text-law-blue" />, value: '90%', label: 'תיקים שהסתיימו בהצלחה' },
    { icon: <BookOpen className="h-8 w-8 text-law-blue" />, value: '50+', label: 'מאמרים משפטיים' },
  ];

  return (
    <section id="about" className="section-wrapper bg-law-light">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">אודות</h2>
          <p className="section-subtitle">מי אני ומה אני עושה</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="glass-card p-8">
            <h3 className="text-2xl font-bold text-law-dark mb-4">עו"ד דני פרץ</h3>
            <p className="text-law-gray mb-4">
              עו"ד דני פרץ הוא עורך דין עצמאי בעל ניסיון של למעלה מ-15 שנים בתחום המשפט האזרחי והמסחרי. 
              הוא הוכר כאחד מעורכי הדין המובילים בתחומו והוביל מספר תיקים משמעותיים שיצרו תקדימים משפטיים.
            </p>
            <p className="text-law-gray mb-6">
              לאחר שסיים את לימודי המשפטים באוניברסיטת תל אביב בהצטיינות, עבד במשרדי עורכי דין מהמובילים בארץ
              לפני שפתח את הפרקטיקה העצמאית שלו בשנת 2010, תוך מתן דגש על ייעוץ אישי ומותאם לכל לקוח.
            </p>
            <div className="flex flex-wrap justify-start">
              <Button 
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-law-blue hover:bg-law-blue/80 text-white"
              >
                קרא עוד
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="glass-card p-6 text-center">
                <div className="flex justify-center mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-law-dark mb-1">{stat.value}</div>
                <div className="text-law-gray">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
