
import React from 'react';
import { Button } from '@/components/ui/button';
import { getAllArticles } from '@/services/articleService';

export function AboutSection() {
  const [articleCount, setArticleCount] = React.useState(0);

  React.useEffect(() => {
    const fetchArticleCount = async () => {
      const articles = await getAllArticles();
      setArticleCount(articles.length);
    };

    fetchArticleCount();
  }, []);

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
              דני פרץ - משרד עורכי דין מתמחה בטיפול מקצועי מעמיק ויצירתי בתחום המעמד האישי במגוון רחב של נושאים.
            </p>
            <p className="text-law-gray mb-4">
              משרדנו מעניק ללקוח טיפול צמוד תוך גיבוש אסטרטגיה מותאמת למטרותיו של הלקות במשדרגו הלקוח נהנה מטיפול מקיף, תוך זמינות גבוהה, ותמיכה לאורך כל הדרך.
            </p>
            <p className="text-law-gray mb-4">
              דני פרץ - משרד עורכי דין, פועל מתוך ראייה כוללת לטובת לקוחותיו ותוך דבקות במטרה אם באמצעות ייצוגם בערכאות משפטיות ואם באמצעות מו"מ להסכמים אפשריים והוגנים.
            </p>
            <p className="text-law-gray mb-4">
              כל מקרה הוא מקרה פרטי והייעוץ שמקבל הלקוח כולל לא רק היבטים מקצועיים מהתחום המשפטי, אלא משולב גם חשיבה עסקית אסטרטגית עם ראיה עתידית מעבר לסוגיה המשפטית הצרה.
            </p>
            <p className="text-law-gray mb-4">
              דני פרץ- משרד עורכי דין, חרט על דגלו, מקצועיות בלתי מתפשרת, רגישות, יצירתיות, זמינות ושיתוף הלקוח בעת קבלת החלטות.
            </p>
            <p className="text-law-gray mb-4">
              משרדנו הציב וימשיך להציב במשרד סטנדרטים מקצועיים, במשרדנו שואפים לצמיחה התחדשות ושיפור מתמידים ודוגלים בהשקעה מקסימליח בכל מקרה ומקרה, ברמה המשפטית הגבוהה ביותר, עם נשמה יתירה ואנושיות.
            </p>
            <p className="text-law-gray mb-6">
              המוטו במשרד דני פרץ - משרד עורכי דין הינו כי, "לנצח אין פירושו להביט" ניצחון הינו השנת התוצאה הטובה ביותר עבורכם מתוך ראיית הצרכים האישיים של לקוח ולקות. בין באמצעות הסכם הוגן, ובין אם צריך, באמצעות הליכים משפטיים אשר ינקטו על ידי משרדנו לצורך השגת המטרות שהוצבו בתיאום עם הלקות.
            </p>
            <div className="flex flex-wrap justify-start">
              <Button 
                onClick={() => document.getElementById('expertise')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-law-blue hover:bg-law-blue/80 text-white"
              >
                תחומי התמחות
              </Button>
            </div>
          </div>
          
          <div className="relative h-[500px] overflow-hidden rounded-lg shadow-xl animate-on-scroll">
            <img 
              src="/lovable-uploads/1fb2b49f-442a-4d77-b6c0-9578f64c98ca.png" 
              alt="עורך דין דני פרץ" 
              className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-law-navy/40 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
