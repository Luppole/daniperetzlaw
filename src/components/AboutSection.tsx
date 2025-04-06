
import React from 'react';
import { Button } from '@/components/ui/button';

export function AboutSection() {
  return (
    <section id="about" className="section-wrapper bg-law-light">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="section-title">אודות</h2>
          <p className="section-subtitle">מי אני ומה אני עושה</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="glass-card p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-law-dark mb-6 border-b border-law-blue/20 pb-3">עו"ד דני פרץ</h3>
              
              <div className="space-y-4 text-law-gray">
                <p>
                  דני פרץ - משרד עורכי דין מתמחה בטיפול מקצועי מעמיק ויצירתי בתחום המעמד האישי במגוון רחב של נושאים.
                </p>
                <p>
                  משרדנו מעניק ללקוח טיפול צמוד תוך גיבוש אסטרטגיה מותאמת למטרותיו של הלקות במשדרגו הלקוח נהנה מטיפול מקיף, תוך זמינות גבוהה, ותמיכה לאורך כל הדרך.
                </p>
                <p>
                  דני פרץ - משרד עורכי דין, פועל מתוך ראייה כוללת לטובת לקוחותיו ותוך דבקות במטרה אם באמצעות ייצוגם בערכאות משפטיות ואם באמצעות מו"מ להסכמים אפשריים והוגנים.
                </p>
                <p>
                  כל מקרה הוא מקרה פרטי והייעוץ שמקבל הלקוח כולל לא רק היבטים מקצועיים מהתחום המשפטי, אלא משולב גם חשיבה עסקית אסטרטגית עם ראיה עתידית מעבר לסוגיה המשפטית הצרה.
                </p>
              </div>
              
              <div className="mt-6 pt-4 border-t border-law-blue/20">
                <div className="space-y-4 text-law-gray">
                  <p>
                    דני פרץ- משרד עורכי דין, חרט על דגלו, מקצועיות בלתי מתפשרת, רגישות, יצירתיות, זמינות ושיתוף הלקוח בעת קבלת החלטות.
                  </p>
                  <p>
                    משרדנו הציב וימשיך להציב במשרד סטנדרטים מקצועיים, במשרדנו שואפים לצמיחה התחדשות ושיפור מתמידים ודוגלים בהשקעה מקסימליח בכל מקרה ומקרה, ברמה המשפטית הגבוהה ביותר, עם נשמה יתירה ואנושיות.
                  </p>
                  <p>
                    המוטו במשרד דני פרץ - משרד עורכי דין הינו כי, "לנצח אין פירושו להביט" ניצחון הינו השנת התוצאה הטובה ביותר עבורכם מתוך ראיית הצרכים האישיים של לקוח ולקות. בין באמצעות הסכם הוגן, ובין אם צריך, באמצעות הליכים משפטיים אשר ינקטו על ידי משרדנו לצורך השגת המטרות שהוצבו בתיאום עם הלקות.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-start mt-6">
                <Button 
                  onClick={() => document.getElementById('expertise')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-law-blue hover:bg-law-blue/80 text-white"
                >
                  תחומי התמחות
                </Button>
              </div>
            </div>
          </div>
          
          <div className="order-1 md:order-2 flex flex-col space-y-6">
            <div className="relative overflow-hidden rounded-lg shadow-2xl animate-on-scroll bg-white p-3">
              <img 
                src="/lovable-uploads/c54d0449-5cfd-4dca-9651-968dd859ac77.png" 
                alt="עורך דין דני פרץ" 
                className="w-full h-full object-contain object-center transition-transform duration-700 hover:scale-105"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-law-navy text-white p-4 rounded-lg text-center shadow-md">
                <div className="text-3xl font-bold">6+</div>
                <div className="text-sm">שנות ניסיון</div>
              </div>
              <div className="bg-law-blue text-white p-4 rounded-lg text-center shadow-md">
                <div className="text-3xl font-bold">250+</div>
                <div className="text-sm">תיקים טופלו</div>
              </div>
              <div className="bg-law-dark text-white p-4 rounded-lg text-center shadow-md">
                <div className="text-3xl font-bold">98%</div>
                <div className="text-sm">שביעות רצון</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
