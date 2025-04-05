
import { supabase } from '@/integrations/supabase/client';

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  date: string;
  image_url: string;
  created_at: string;
}

// Fetch a single article by ID
export async function getArticleById(id: string): Promise<Article | null> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

// Fetch all articles
export async function getAllArticles(): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

// Get like count for an article
export async function getArticleLikeCount(articleId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('likes')
      .select('*', { count: 'exact' })
      .eq('article_id', articleId);
    
    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error getting like count:', error);
    return 0;
  }
}

// Insert sample articles into Supabase if they don't exist
export async function ensureArticlesExist(): Promise<void> {
  try {
    // Check if articles already exist
    const { count, error } = await supabase
      .from('articles')
      .select('*', { count: 'exact' });
    
    if (error) throw error;
    
    // If no articles, insert sample data
    if (count === 0) {
      const sampleArticles = [
        {
          id: '1',
          title: 'חידושים בדיני חוזים: פסיקה אחרונה של בית המשפט העליון',
          summary: 'סקירה מקיפה של פסיקת בית המשפט העליון בנושא דיני חוזים בשנה האחרונה והשלכותיה על עסקאות מסחריות.',
          content: `
            <p class="mb-4">בשנה האחרונה, בית המשפט העליון הוציא מספר פסקי דין משמעותיים בתחום דיני החוזים, אשר משפיעים באופן ישיר על אופן ניהול עסקאות מסחריות במשק הישראלי. פסיקות אלו מהוות אבני דרך בהתפתחות דיני החוזים ומשקפות מגמות חדשות בגישת בתי המשפט לסוגיות חוזיות.</p>

            <h3 class="text-xl font-bold mb-3 mt-6">פרשנות חוזים והסתמכות על נסיבות חיצוניות</h3>
            <p class="mb-4">בפסק דין ע"א 1234/21 (פלוני נ' אלמוני), בית המשפט העליון הרחיב את היכולת להסתמך על נסיבות חיצוניות בפרשנות חוזים. לפי הפסיקה החדשה, גם כאשר לשון החוזה ברורה, ניתן להביא ראיות לנסיבות חיצוניות המצביעות על כוונה שונה של הצדדים, במקרים מסוימים. זאת, תוך סטייה מסוימת מהלכת אפרופים המפורסמת, והדגשת החשיבות של הכתוב בחוזה.</p>

            <h3 class="text-xl font-bold mb-3 mt-6">תום לב במשא ומתן</h3>
            <p class="mb-4">בע"א 5678/22 (חברה א' נ' חברה ב'), הרחיב בית המשפט העליון את חובת תום הלב במשא ומתן לחוזה. נקבע כי הסתרת מידע מהותי במהלך המשא ומתן, גם אם לא נשאלה שאלה ישירה לגביו, עלולה להיחשב כחוסר תום לב המצדיק פיצויים או אף ביטול החוזה בנסיבות מסוימות.</p>

            <h3 class="text-xl font-bold mb-3 mt-6">סיכום</h3>
            <p class="mb-4">פסיקות בית המשפט העליון בשנה האחרונה משקפות מגמה של איזון בין עקרון חופש החוזים לבין שיקולי הגינות וצדק. עסקים נדרשים להתאים את התנהלותם המשפטית לאור פסיקות אלו, ולבחון מחדש את אסטרטגיית ניהול החוזים שלהם.</p>
          `,
          category: 'דיני חוזים',
          author: 'דני פרץ',
          date: '12 מרץ, 2025',
          image_url: '/lovable-uploads/41432968-0b99-4cba-9e29-f6fdea6a4272.png'
        },
        {
          id: '2',
          title: 'יתרונות וחסרונות של הסכם ממון לפני נישואין',
          summary: 'מאמר מקיף על היתרונות, החסרונות והשיקולים לעריכת הסכם ממון לפני נישואין, כולל דוגמאות מהפסיקה.',
          content: `
            <p class="mb-4">הסכם ממון לפני נישואין הוא מסמך משפטי המסדיר את יחסי הרכוש בין בני זוג במקרה של פרידה או גירושין. בעידן שבו יחסי משפחה מורכבים יותר, ושיעורי הגירושין גבוהים יחסית, יותר ויותר זוגות שוקלים חתימה על הסכם ממון טרם נישואיהם.</p>

            <h3 class="text-xl font-bold mb-3 mt-6">יתרונות הסכם ממון</h3>
            <p class="mb-4">חתימה על הסכם ממון לפני נישואין מציעה מספר יתרונות משמעותיים, כולל הגנה על נכסים קיימים והגדרה מראש של חלוקת רכוש.</p>

            <h3 class="text-xl font-bold mb-3 mt-6">חסרונות אפשריים</h3>
            <p class="mb-4">לצד היתרונות, יש לקחת בחשבון גם את החסרונות הפוטנציאליים, כמו חשש מפגיעה רגשית או עלויות משפטיות.</p>

            <h3 class="text-xl font-bold mb-3 mt-6">סיכום</h3>
            <p class="mb-4">הסכם ממון אינו רק "פוליסת ביטוח" למקרה של פרידה, אלא כלי שיכול לסייע בבניית יסודות פיננסיים יציבים לנישואין. עם זאת, חשוב לגשת לתהליך ברגישות, הוגנות ותוך קבלת ייעוץ משפטי מקצועי.</p>
          `,
          category: 'דיני משפחה',
          author: 'דני פרץ',
          date: '5 פברואר, 2025',
          image_url: '/lovable-uploads/41432968-0b99-4cba-9e29-f6fdea6a4272.png'
        },
        {
          id: '3',
          title: 'זכויות עובדים בתקופת משבר: מה שחשוב לדעת',
          summary: 'סקירה של זכויות עובדים בתקופות משבר, כולל התייחסות למשבר הקורונה והשלכותיו על יחסי עובד-מעביד.',
          content: `
            <p class="mb-4">מגפת הקורונה חידדה סוגיות רבות בתחום דיני העבודה, והציפה שאלות משפטיות מורכבות באשר לזכויות עובדים בתקופות משבר. מאמר זה סוקר את זכויות העובדים בעתות משבר, ומספק מידע חיוני הן לעובדים והן למעסיקים.</p>

            <h3 class="text-xl font-bold mb-3 mt-6">חל"ת (חופשה ללא תשלום)</h3>
            <p class="mb-4">אחד האמצעים הנפוצים בתקופת משבר הוא הוצאת עובדים לחל"ת. חשוב להדגיש כי חל"ת דורש הסכמה ושומר על זכויות ותק.</p>

            <h3 class="text-xl font-bold mb-3 mt-6">פיטורים בתקופת משבר</h3>
            <p class="mb-4">גם בתקופת משבר, פיטורי עובדים כפופים לדיני העבודה וכוללים חובת שימוע ואיסור אפליה.</p>

            <h3 class="text-xl font-bold mb-3 mt-6">סיכום</h3>
            <p class="mb-4">תקופות משבר מציבות אתגרים מורכבים ביחסי עבודה. הכרת הזכויות והחובות יכולה לסייע הן לעובדים והן למעסיקים לצלוח את התקופה באופן מיטבי, תוך שמירה על איזון בין צרכי העסק לזכויות העובדים.</p>
          `,
          category: 'דיני עבודה',
          author: 'דני פרץ',
          date: '18 ינואר, 2025',
          image_url: '/lovable-uploads/41432968-0b99-4cba-9e29-f6fdea6a4272.png'
        }
      ];
    
      const { error: insertError } = await supabase
        .from('articles')
        .insert(sampleArticles);
        
      if (insertError) throw insertError;
      console.log('Sample articles inserted successfully');
    }
  } catch (error) {
    console.error('Error ensuring articles exist:', error);
  }
}
