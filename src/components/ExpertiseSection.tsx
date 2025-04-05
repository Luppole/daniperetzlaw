
import React from 'react';
import { Building, Home, FileText, Scale, Users, Landmark } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function ExpertiseSection() {
  const expertiseAreas = [
    {
      icon: <Users className="h-14 w-14 text-law-navy mb-4 animate-float" />,
      title: 'דיני משפחה',
      description: 'גירושין, משמורת ילדים, מזונות, הסכמי ממון וייצוג בבית המשפט לענייני משפחה',
      content: 'אנו מספקים ייצוג משפטי מקיף בכל היבטי דיני המשפחה, כולל גירושין, משמורת ילדים, מזונות, הסכמי ממון ועוד. אנו מבינים שמקרים אלה רגישים ומורכבים רגשית, ולכן אנו מתחייבים לספק ייעוץ משפטי ברור וייצוג מסור לאורך כל התהליך.',
      slug: 'family-law'
    },
    {
      icon: <Building className="h-14 w-14 text-law-navy mb-4 animate-float" />,
      title: 'חדלות פרעון',
      description: 'ליווי בהליכי פשיטת רגל, הסדרי חובות וייצוג מול נושים',
      content: 'אנו מסייעים ללקוחותינו לנווט בהליכי חדלות פירעון מורכבים, כולל פשיטת רגל, הסדרי חובות וייצוג מול נושים. המשרד שלנו מציע ייעוץ אסטרטגי ותמיכה משפטית כדי לסייע ללקוחות לשקם את חייהם הפיננסיים ולהתחיל מחדש.',
      slug: 'insolvency'
    },
    {
      icon: <Home className="h-14 w-14 text-law-navy mb-4 animate-float" />,
      title: 'מקרקעין',
      description: 'עסקאות נדל"ן, ליווי ברכישה ומכירה, התחדשות עירונית ותמ"א 38',
      content: 'המשרד שלנו מתמחה בעסקאות נדל"ן, ליווי משפטי ברכישה ומכירה של נכסים, התחדשות עירונית ותמ"א 38. אנו מלווים את לקוחותינו בכל שלבי העסקה, מהמשא ומתן הראשוני ועד להשלמת העסקה ורישום הזכויות, תוך הבטחת האינטרסים המשפטיים שלהם.',
      slug: 'real-estate'
    },
    {
      icon: <Scale className="h-14 w-14 text-law-navy mb-4 animate-float" />,
      title: 'ליטיגציה',
      description: 'ייצוג בבתי משפט אזרחיים, מסחריים ומנהליים',
      content: 'משרדנו מציע ייצוג משפטי מקצועי ומנוסה בבתי משפט אזרחיים, מסחריים ומנהליים. אנו מחויבים להשגת התוצאות הטובות ביותר עבור לקוחותינו באמצעות אסטרטגיה משפטית חכמה, הכנה יסודית והופעה משכנעת בבית המשפט.',
      slug: 'litigation'
    },
    {
      icon: <Landmark className="h-14 w-14 text-law-navy mb-4 animate-float" />,
      title: 'דיני ירושה',
      description: 'צוואות, ירושות, התנגדויות לצו ירושה וייצוג בסכסוכי ירושה',
      content: 'אנו מסייעים ללקוחותינו בתכנון והכנת צוואות, ניהול הליכי ירושה, טיפול בהתנגדויות לצווי ירושה וייצוג בסכסוכי ירושה. המשרד שלנו מבין את הרגישות והמורכבות של ענייני ירושה ומספק ייעוץ משפטי מקיף ותמיכה במהלך התהליך.',
      slug: 'inheritance'
    },
    {
      icon: <FileText className="h-14 w-14 text-law-navy mb-4 animate-float" />,
      title: 'הוצאה לפועל',
      description: 'ייצוג זוכים וחייבים, ביצוע פסקי דין וגביית חובות',
      content: 'המשרד שלנו מתמחה בייצוג זוכים וחייבים בהליכי הוצאה לפועל, ביצוע פסקי דין וגביית חובות. אנו מציעים פתרונות יצירתיים ויעילים שמטרתם לממש את זכויות לקוחותינו או להגן עליהם מפני הליכים לא הוגנים.',
      slug: 'execution'
    }
  ];

  return (
    <section id="expertise" className="section-wrapper animated-gradient parallax">
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
                <CardTitle className="text-2xl font-rubik text-law-navy">
                  {area.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-law-gray text-center text-base">
                  {area.description}
                </CardDescription>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="text-law-navy border-law-navy hover:bg-law-navy hover:text-white transition-all duration-300 btn-pulse">
                      קרא עוד
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl mb-4">{area.title}</DialogTitle>
                      <DialogDescription className="text-lg text-law-gray">
                        {area.content}
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-between mt-6">
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                      >
                        צור קשר בנושא {area.title}
                      </Button>
                      <Link to={`/articles?expertise=${area.slug}`}>
                        <Button>
                          כל המאמרים בנושא {area.title}
                        </Button>
                      </Link>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
