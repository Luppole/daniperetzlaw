
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Calendar, ArrowRight, Share2, Bookmark, Printer, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Article = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Sample article data (in real app, this would come from an API/database)
  const articleData = {
    '1': {
      title: 'חידושים בדיני חוזים: פסיקה אחרונה של בית המשפט העליון',
      date: '12 מרץ, 2025',
      author: 'דני פרץ',
      category: 'דיני חוזים',
      image: '/lovable-uploads/41432968-0b99-4cba-9e29-f6fdea6a4272.png',
      summary: 'סקירה מקיפה של פסיקת בית המשפט העליון בנושא דיני חוזים בשנה האחרונה והשלכותיה על עסקאות מסחריות.',
      content: `
        <p class="mb-4">בשנה האחרונה, בית המשפט העליון הוציא מספר פסקי דין משמעותיים בתחום דיני החוזים, אשר משפיעים באופן ישיר על אופן ניהול עסקאות מסחריות במשק הישראלי. פסיקות אלו מהוות אבני דרך בהתפתחות דיני החוזים ומשקפות מגמות חדשות בגישת בתי המשפט לסוגיות חוזיות.</p>

        <h3 class="text-xl font-bold mb-3 mt-6">פרשנות חוזים והסתמכות על נסיבות חיצוניות</h3>
        <p class="mb-4">בפסק דין ע"א 1234/21 (פלוני נ' אלמוני), בית המשפט העליון הרחיב את היכולת להסתמך על נסיבות חיצוניות בפרשנות חוזים. לפי הפסיקה החדשה, גם כאשר לשון החוזה ברורה, ניתן להביא ראיות לנסיבות חיצוניות המצביעות על כוונה שונה של הצדדים, במקרים מסוימים. זאת, תוך סטייה מסוימת מהלכת אפרופים המפורסמת, והדגשת החשיבות של הכתוב בחוזה.</p>

        <h3 class="text-xl font-bold mb-3 mt-6">תום לב במשא ומתן</h3>
        <p class="mb-4">בע"א 5678/22 (חברה א' נ' חברה ב'), הרחיב בית המשפט העליון את חובת תום הלב במשא ומתן לחוזה. נקבע כי הסתרת מידע מהותי במהלך המשא ומתן, גם אם לא נשאלה שאלה ישירה לגביו, עלולה להיחשב כחוסר תום לב המצדיק פיצויים או אף ביטול החוזה בנסיבות מסוימות.</p>

        <h3 class="text-xl font-bold mb-3 mt-6">סעדים בגין הפרת חוזה</h3>
        <p class="mb-4">בפסק דין ע"א 9101/23 (פיתוח נדל"ן בע"מ נ' משקיעים בע"מ), קבע בית המשפט העליון אמות מידה חדשות לפסיקת פיצויים בגין הפרת חוזה. נקבע כי בתי המשפט רשאים לשקול שיקולי צדק והגינות בקביעת גובה הפיצויים, גם אם הדבר עשוי לסטות מהנוסחה המקובלת של החזרת הנפגע למצב בו היה אלמלא ההפרה.</p>

        <h3 class="text-xl font-bold mb-3 mt-6">תניות פטור וסיכול חוזה</h3>
        <p class="mb-4">לאור משברים עולמיים כמו מגפת הקורונה, בית המשפט העליון נדרש בע"א 1213/24 (יזמות בע"מ נ' קבלנות בע"מ) לשאלת יישום דוקטרינת הסיכול בחוזים. נקבע כי יש לפרש בצמצום את דוקטרינת הסיכול, אך בו-זמנית הורחבה האפשרות לפרש תניות "כוח עליון" בחוזים באופן שיכסה אירועים חריגים בקנה מידה עולמי.</p>

        <h3 class="text-xl font-bold mb-3 mt-6">השלכות מעשיות</h3>
        <p class="mb-4">פסקי הדין החדשים מחייבים עסקים וגורמים מסחריים לבחון מחדש את אופן ניסוח החוזים שלהם. מומלץ לשים דגש מיוחד על:</p>
        <ul class="list-disc mr-6 mb-4 space-y-2">
          <li>ניסוח ברור וממצה של תנאי החוזה</li>
          <li>תיעוד מפורט של שלב המשא ומתן, כולל מידע שנמסר</li>
          <li>בחינה מחודשת של תניות פטור ו"כוח עליון"</li>
          <li>התייחסות מפורשת לסעדים במקרה של הפרה</li>
        </ul>

        <h3 class="text-xl font-bold mb-3 mt-6">סיכום</h3>
        <p class="mb-4">פסיקות בית המשפט העליון בשנה האחרונה משקפות מגמה של איזון בין עקרון חופש החוזים לבין שיקולי הגינות וצדק. עסקים נדרשים להתאים את התנהלותם המשפטית לאור פסיקות אלו, ולבחון מחדש את אסטרטגיית ניהול החוזים שלהם.</p>
      `
    },
    '2': {
      title: 'יתרונות וחסרונות של הסכם ממון לפני נישואין',
      date: '5 פברואר, 2025',
      author: 'דני פרץ',
      category: 'דיני משפחה',
      image: '/lovable-uploads/41432968-0b99-4cba-9e29-f6fdea6a4272.png',
      summary: 'מאמר מקיף על היתרונות, החסרונות והשיקולים לעריכת הסכם ממון לפני נישואין, כולל דוגמאות מהפסיקה.',
      content: `
        <p class="mb-4">הסכם ממון לפני נישואין הוא מסמך משפטי המסדיר את יחסי הרכוש בין בני זוג במקרה של פרידה או גירושין. בעידן שבו יחסי משפחה מורכבים יותר, ושיעורי הגירושין גבוהים יחסית, יותר ויותר זוגות שוקלים חתימה על הסכם ממון טרם נישואיהם.</p>

        <h3 class="text-xl font-bold mb-3 mt-6">יתרונות הסכם ממון</h3>
        <p class="mb-4">חתימה על הסכם ממון לפני נישואין מציעה מספר יתרונות משמעותיים:</p>
        <ul class="list-disc mr-6 mb-4 space-y-2">
          <li>ודאות משפטית - ההסכם מגדיר מראש את חלוקת הרכוש במקרה של פרידה, ומונע אי-ודאות וסכסוכים עתידיים</li>
          <li>הגנה על נכסים קיימים - ההסכם מאפשר להגן על נכסים שנצברו לפני הנישואין, כמו גם על ירושות ומתנות</li>
          <li>הגנה על עסקים - בעלי עסקים יכולים להגן על העסק שלהם במקרה של גירושין</li>
          <li>שקיפות פיננסית - עריכת ההסכם מחייבת את בני הזוג לנהל שיחה כנה על נושאים כלכליים</li>
          <li>חלוקת חובות - ההסכם יכול להגדיר מראש כיצד יחולקו חובות במקרה של פרידה</li>
        </ul>

        <h3 class="text-xl font-bold mb-3 mt-6">חסרונות אפשריים</h3>
        <p class="mb-4">לצד היתרונות, יש לקחת בחשבון גם את החסרונות הפוטנציאליים:</p>
        <ul class="list-disc mr-6 mb-4 space-y-2">
          <li>חשש מפגיעה רגשית - העלאת נושא הסכם הממון עלולה להתפרש כחוסר אמון</li>
          <li>עלויות משפטיות - עריכת הסכם ממון מחייבת ייעוץ משפטי נפרד לכל אחד מבני הזוג</li>
          <li>חוסר יכולת לצפות את העתיד - קשה לחזות את כל התרחישים האפשריים בעת עריכת ההסכם</li>
          <li>סיכון לפגיעה בצד החלש - ללא ייעוץ משפטי נאות, עלול להיווצר מצב שבו צד אחד מקופח</li>
        </ul>

        <h3 class="text-xl font-bold mb-3 mt-6">גישת בתי המשפט בישראל</h3>
        <p class="mb-4">בתי המשפט בישראל מכבדים ככלל הסכמי ממון שנערכו כדין, אך בוחנים אותם בקפידה. בפסק דין בע"מ 9126/05 (פלונית נ' פלוני), בית המשפט העליון קבע כי הסכם ממון צריך להיות הוגן וסביר, ושאין לאכוף הסכם שנערך בחוסר תום לב או תוך ניצול מצוקה של אחד הצדדים.</p>

        <h3 class="text-xl font-bold mb-3 mt-6">שיקולים לעריכת הסכם ממון</h3>
        <p class="mb-4">לפני החלטה על עריכת הסכם ממון, מומלץ לשקול את הגורמים הבאים:</p>
        <ul class="list-disc mr-6 mb-4 space-y-2">
          <li>פערים כלכליים משמעותיים בין בני הזוג</li>
          <li>קיומם של נכסים משמעותיים לפני הנישואין</li>
          <li>קיומו של עסק משפחתי</li>
          <li>נישואין שניים, במיוחד כאשר יש ילדים מנישואין קודמים</li>
          <li>צפי לירושות משמעותיות</li>
        </ul>

        <h3 class="text-xl font-bold mb-3 mt-6">עצות מעשיות</h3>
        <p class="mb-4">אם החלטתם לערוך הסכם ממון, הנה מספר עצות שיסייעו בתהליך:</p>
        <ul class="list-disc mr-6 mb-4 space-y-2">
          <li>התחילו את התהליך זמן רב לפני החתונה, כדי למנוע לחץ</li>
          <li>כל צד צריך להיות מיוצג על ידי עורך דין נפרד</li>
          <li>נהלו שיחה פתוחה וכנה על ציפיות כלכליות</li>
          <li>שקלו גם הסדרים לתקופת הנישואין, לא רק למקרה של פרידה</li>
          <li>בחנו את ההסכם מחדש לאחר אירועים משמעותיים (לידת ילדים, רכישת נכסים, וכו')</li>
        </ul>

        <h3 class="text-xl font-bold mb-3 mt-6">סיכום</h3>
        <p class="mb-4">הסכם ממון אינו רק "פוליסת ביטוח" למקרה של פרידה, אלא כלי שיכול לסייע בבניית יסודות פיננסיים יציבים לנישואין. עם זאת, חשוב לגשת לתהליך ברגישות, הוגנות ותוך קבלת ייעוץ משפטי מקצועי.</p>
      `
    },
    '3': {
      title: 'זכויות עובדים בתקופת משבר: מה שחשוב לדעת',
      date: '18 ינואר, 2025',
      author: 'דני פרץ',
      category: 'דיני עבודה',
      image: '/lovable-uploads/41432968-0b99-4cba-9e29-f6fdea6a4272.png',
      summary: 'סקירה של זכויות עובדים בתקופות משבר, כולל התייחסות למשבר הקורונה והשלכותיו על יחסי עובד-מעביד.',
      content: `
        <p class="mb-4">מגפת הקורונה חידדה סוגיות רבות בתחום דיני העבודה, והציפה שאלות משפטיות מורכבות באשר לזכויות עובדים בתקופות משבר. מאמר זה סוקר את זכויות העובדים בעתות משבר, ומספק מידע חיוני הן לעובדים והן למעסיקים.</p>

        <h3 class="text-xl font-bold mb-3 mt-6">חל"ת (חופשה ללא תשלום)</h3>
        <p class="mb-4">אחד האמצעים הנפוצים בתקופת משבר הוא הוצאת עובדים לחל"ת. חשוב להדגיש:</p>
        <ul class="list-disc mr-6 mb-4 space-y-2">
          <li>חל"ת דורש הסכמה - מעסיק אינו יכול להוציא עובד לחל"ת באופן חד צדדי, אלא אם הדבר מוסדר בהסכם קיבוצי או בחוזה העבודה</li>
          <li>שמירת זכויות ותק - תקופת החל"ת נחשבת לעניין ותק וזכויות תלויות ותק</li>
          <li>זכאות לדמי אבטלה - עובד בחל"ת עשוי להיות זכאי לדמי אבטלה בתנאים מסוימים</li>
          <li>המשכיות ביטוחים - המעסיק מחויב להמשיך ולשלם את חלקו בביטוח הפנסיוני במשך החודשים הראשונים של החל"ת</li>
        </ul>

        <h3 class="text-xl font-bold mb-3 mt-6">פיטורים בתקופת משבר</h3>
        <p class="mb-4">גם בתקופת משבר, פיטורי עובדים כפופים לדיני העבודה:</p>
        <ul class="list-disc mr-6 mb-4 space-y-2">
          <li>חובת שימוע - גם במשבר, חובה לקיים הליך שימוע לפני החלטה על פיטורים</li>
          <li>איסור אפליה - אין לפטר עובדים על בסיס שיקולים מפלים (גיל, מין, הריון, וכו')</li>
          <li>הגנה מיוחדת - עובדים מסוימים (נשים בהריון, חיילי מילואים, וכו') זכאים להגנה מוגברת מפני פיטורים</li>
          <li>פיצויי פיטורים - עובדים זכאים לפיצויי פיטורים גם בתקופת משבר</li>
        </ul>

        <h3 class="text-xl font-bold mb-3 mt-6">שינויים בתנאי העבודה</h3>
        <p class="mb-4">משבר עשוי להוביל לצורך בשינויים בתנאי העבודה:</p>
        <ul class="list-disc mr-6 mb-4 space-y-2">
          <li>הסכמה לשינויים - ככלל, שינוי מהותי בתנאי העבודה דורש הסכמת העובד</li>
          <li>הפחתת שכר - הפחתת שכר ללא הסכמת העובד עלולה להיחשב להרעה מוחשית בתנאים, המזכה בפיצויי פיטורים</li>
          <li>שינוי היקף משרה - הקטנת היקף משרה ללא הסכמה עלולה להיחשב לפיטורים חלקיים</li>
          <li>עבודה מרחוק - הסדרי עבודה מרחוק צריכים להיקבע בהסכמה, תוך הסדרת זכויות וחובות הצדדים</li>
        </ul>

        <h3 class="text-xl font-bold mb-3 mt-6">זכויות בתקופת בידוד או מחלה</h3>
        <p class="mb-4">בעקבות מגפת הקורונה, התעוררו שאלות באשר לזכויות עובדים בבידוד או בעת מחלה:</p>
        <ul class="list-disc mr-6 mb-4 space-y-2">
          <li>היעדרות עקב בידוד - בישראל, נקבע כי היעדרות עקב בידוד נחשבת לתקופת מחלה לכל דבר ועניין</li>
          <li>דמי מחלה - עובד שחלה זכאי לדמי מחלה בהתאם לחוק ולצבירה שלו</li>
          <li>איסור פיטורים - חל איסור על פיטורי עובד בתקופת מחלה</li>
          <li>עובדים בקבוצות סיכון - מעסיקים נדרשים להתאים את תנאי העבודה לעובדים בקבוצות סיכון</li>
        </ul>

        <h3 class="text-xl font-bold mb-3 mt-6">תמיכה ממשלתית</h3>
        <p class="mb-4">בתקופות משבר, המדינה עשויה להציע תמיכה לעובדים ולמעסיקים:</p>
        <ul class="list-disc mr-6 mb-4 space-y-2">
          <li>מענקים למעסיקים - עבור שימור עובדים והחזרתם מחל"ת</li>
          <li>הקלות בדמי אבטלה - הקלות בתנאי הזכאות ובתקופת האכשרה</li>
          <li>דמי בידוד - תשלום מיוחד לעובדים השוהים בבידוד</li>
          <li>מענקים לעצמאים - סיוע לעצמאים שהכנסתם נפגעה</li>
        </ul>

        <h3 class="text-xl font-bold mb-3 mt-6">עצות מעשיות</h3>
        <p class="mb-4">לאור הניסיון שנצבר, הנה מספר עצות לעובדים ולמעסיקים:</p>
        <ul class="list-disc mr-6 mb-4 space-y-2">
          <li>תקשורת שוטפת - חשוב לשמור על תקשורת פתוחה בין הנהלה לעובדים</li>
          <li>תיעוד - לתעד בכתב את כל ההסכמות והשינויים בתנאי העבודה</li>
          <li>התאמת הסכמים - לעדכן חוזי עבודה כך שיכללו התייחסות למצבי חירום</li>
          <li>התייעצות משפטית - להתייעץ עם עורך דין המתמחה בדיני עבודה לפני קבלת החלטות משמעותיות</li>
        </ul>

        <h3 class="text-xl font-bold mb-3 mt-6">סיכום</h3>
        <p class="mb-4">תקופות משבר מציבות אתגרים מורכבים ביחסי עבודה. הכרת הזכויות והחובות יכולה לסייע הן לעובדים והן למעסיקים לצלוח את התקופה באופן מיטבי, תוך שמירה על איזון בין צרכי העסק לזכויות העובדים.</p>
      `
    }
  };

  const article = articleData[id as string];

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-law-navy mb-4">המאמר לא נמצא</h1>
            <p className="text-law-gray mb-8">המאמר שחיפשת אינו קיים או שהוסר</p>
            <Button 
              onClick={() => navigate('/#articles')} 
              className="bg-law-navy hover:bg-law-navy/80"
            >
              חזרה למאמרים
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Find related articles (all articles except current one)
  const relatedArticles = Object.entries(articleData)
    .filter(([key]) => key !== id)
    .map(([key, data]) => ({ id: key, ...data }));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <div className="mb-8 flex items-center text-sm text-law-gray">
            <Button 
              variant="ghost" 
              className="p-0 hover:bg-transparent hover:text-law-navy flex items-center"
              onClick={() => navigate('/')}
            >
              דף הבית
            </Button>
            <span className="mx-2">/</span>
            <Button 
              variant="ghost" 
              className="p-0 hover:bg-transparent hover:text-law-navy flex items-center"
              onClick={() => navigate('/#articles')}
            >
              מאמרים
            </Button>
            <span className="mx-2">/</span>
            <span className="text-law-navy font-medium truncate max-w-[200px]">{article.title}</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 animate-fade-in">
              <h1 className="text-3xl md:text-4xl font-bold text-law-navy mb-6">{article.title}</h1>
              
              {/* Article Meta */}
              <div className="flex flex-wrap items-center mb-8 text-law-gray text-sm">
                <div className="flex items-center ml-6 mb-2">
                  <Calendar className="h-4 w-4 ml-1" />
                  <span>{article.date}</span>
                </div>
                <div className="ml-6 mb-2">
                  <span>מאת: {article.author}</span>
                </div>
                <div className="mb-2">
                  <span>קטגוריה: {article.category}</span>
                </div>
              </div>
              
              {/* Article Image */}
              <div className="mb-8 overflow-hidden rounded-lg shadow-md">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-auto object-cover transform transition-transform duration-500 hover:scale-105" 
                />
              </div>
              
              {/* Article Summary */}
              <div className="bg-law-light p-6 rounded-lg mb-8 border-r-4 border-law-navy">
                <p className="text-lg font-medium text-law-navy">{article.summary}</p>
              </div>
              
              {/* Article Content */}
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
              
              {/* Share Buttons */}
              <div className="mt-10 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-bold mb-4 text-law-navy">שתף את המאמר</h4>
                <div className="flex space-x-3 space-x-reverse">
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Share2 className="ml-2 h-4 w-4" />
                    שתף
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Bookmark className="ml-2 h-4 w-4" />
                    שמור
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Printer className="ml-2 h-4 w-4" />
                    הדפס
                  </Button>
                </div>
              </div>
              
              {/* Navigation between articles */}
              <div className="mt-10 grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center"
                  onClick={() => {
                    const prevId = parseInt(id as string) - 1;
                    if (prevId > 0 && articleData[prevId.toString()]) {
                      navigate(`/article/${prevId}`);
                      window.scrollTo(0, 0);
                    }
                  }}
                  disabled={parseInt(id as string) <= 1}
                >
                  <ArrowRight className="ml-2 h-4 w-4" />
                  המאמר הקודם
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center"
                  onClick={() => {
                    const nextId = parseInt(id as string) + 1;
                    if (articleData[nextId.toString()]) {
                      navigate(`/article/${nextId}`);
                      window.scrollTo(0, 0);
                    }
                  }}
                  disabled={!articleData[(parseInt(id as string) + 1).toString()]}
                >
                  המאמר הבא
                  <ArrowLeft className="mr-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Author Card */}
              <Card className="mb-8 p-6 bg-law-light border-none shadow-md hover:shadow-lg transition-shadow animate-fade-in">
                <div className="flex items-center mb-4">
                  <div className="h-16 w-16 rounded-full overflow-hidden ml-4">
                    <img 
                      src="/lovable-uploads/41432968-0b99-4cba-9e29-f6fdea6a4272.png" 
                      alt="דני פרץ"
                      className="h-full w-full object-cover" 
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-law-navy text-lg">דני פרץ</h4>
                    <p className="text-law-gray text-sm">עורך דין</p>
                  </div>
                </div>
                <p className="text-law-gray mb-4">עו"ד דני פרץ מתמחה בדיני משפחה, חדלות פרעון ומקרקעין. בעל 15+ שנות ניסיון במתן פתרונות משפטיים מקצועיים ואישיים.</p>
                <Button 
                  className="w-full bg-law-navy hover:bg-law-navy/90"
                  onClick={() => navigate('/#contact')}
                >
                  צור קשר
                </Button>
              </Card>
              
              {/* Related Articles */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-xl font-bold text-law-navy mb-6 border-r-4 border-law-navy pr-4">מאמרים נוספים</h3>
                <div className="space-y-4">
                  {relatedArticles.map((relatedArticle) => (
                    <div key={relatedArticle.id} className="border-b border-gray-100 pb-4 last:border-0">
                      <h4 className="font-medium text-law-navy mb-2 hover:text-law-navy/70 transition-colors">
                        <a 
                          href={`/article/${relatedArticle.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/article/${relatedArticle.id}`);
                            window.scrollTo(0, 0);
                          }}
                          className="hover-link"
                        >
                          {relatedArticle.title}
                        </a>
                      </h4>
                      <div className="flex items-center text-sm text-law-gray">
                        <Calendar className="h-3 w-3 ml-1" />
                        <span>{relatedArticle.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Button 
                    variant="outline" 
                    className="w-full border-law-navy text-law-navy hover:bg-law-navy hover:text-white transition-all"
                    onClick={() => navigate('/#articles')}
                  >
                    לכל המאמרים
                  </Button>
                </div>
              </div>
              
              {/* Call to Action */}
              <div className="bg-law-navy text-white rounded-lg p-6 shadow-lg animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <h3 className="text-xl font-bold mb-4">זקוק לייעוץ משפטי?</h3>
                <p className="mb-6">אנו מציעים ייעוץ מקצועי בתחומים מגוונים. צור קשר עוד היום לפגישת ייעוץ ראשונית.</p>
                <Button 
                  className="w-full bg-white text-law-navy hover:bg-law-silver hover:text-law-navy"
                  onClick={() => navigate('/#contact')}
                >
                  קבע פגישת ייעוץ
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Article;
