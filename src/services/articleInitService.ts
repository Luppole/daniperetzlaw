
import { supabase } from '@/integrations/supabase/client';

// Function to ensure default articles exist
export async function ensureArticlesExist() {
  const defaultArticles = [
    {
      title: 'מבוא לדיני משפחה',
      summary: 'מאמר זה מספק סקירה של דיני משפחה בישראל והנושאים החשובים שכל אדם צריך להכיר.',
      content: 'דיני משפחה בישראל מהווים תחום משפטי מורכב ורגיש, המושפע מהדין הדתי, החקיקה האזרחית ופסיקות בית המשפט העליון. תחום זה כולל נושאים כמו נישואין וגירושין, משמורת ילדים, מזונות, חלוקת רכוש, אימוץ ופונדקאות. לאור המערכת המשפטית הייחודית בישראל, בה הסמכות בענייני נישואין וגירושין נתונה לבתי הדין הדתיים, נוצרים לעיתים מצבים מורכבים המחייבים התמודדות עם סוגיות של סמכות שיפוטית. חשוב להכיר את הזכויות והחובות במסגרת דיני המשפחה, ולקבל ייעוץ משפטי מקצועי כדי להבטיח את האינטרסים האישיים והמשפחתיים בצורה מיטבית.',
      category: 'דיני משפחה',
      author: 'עו"ד ישראל ישראלי',
      image_url: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7',
      date: new Date().toISOString().split('T')[0],
    },
    {
      title: 'זכויות עובדים בישראל',
      summary: 'סקירה של זכויות העובדים העיקריות בישראל וכיצד ניתן לעמוד על מימושן.',
      content: 'חוקי העבודה בישראל נועדו להגן על זכויות העובדים ולהבטיח תנאי העסקה הוגנים. בין הזכויות הבסיסיות: שכר מינימום, שעות עבודה ומנוחה, תשלום עבור שעות נוספות, ימי חופשה, דמי הבראה, ימי מחלה, פיצויי פיטורין והפרשות פנסיוניות. המחוקק הישראלי קבע הסדרים שונים להגנה על עובדים, כגון: חוק שכר מינימום, חוק שעות עבודה ומנוחה, חוק חופשה שנתית, חוק דמי מחלה, חוק פיצויי פיטורין וחוק הגנת השכר. בנוסף, ישנם חוקים האוסרים על אפליה במקום העבודה על רקע מין, דת, גזע, נטייה מינית, גיל והריון. חשוב לדעת שזכויות רבות ניתנות גם מכוח הסכמים קיבוציים והסדרים קיבוציים החלים על ענפי תעסוקה שונים. במקרה של הפרת זכויות, ניתן לפנות לממונה על אכיפת חוקי עבודה במשרד העבודה, להסתדרות או להגיש תביעה בבית הדין לעבודה.',
      category: 'דיני עבודה',
      author: 'עו"ד שרה לוי',
      image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
      date: new Date().toISOString().split('T')[0],
    },
  ];

  try {
    for (const article of defaultArticles) {
      // Check if article with this title already exists
      const { data, error: checkError } = await supabase
        .from('articles')
        .select('*')
        .eq('title', article.title);

      if (checkError) {
        console.error('Error checking article existence:', checkError);
        continue;
      }

      // Only create if it doesn't exist
      if (data && data.length === 0) {
        const { error: insertError } = await supabase.from('articles').insert([article]);

        if (insertError) {
          console.error('Error creating article:', insertError);
        } else {
          console.log(`Article "${article.title}" created successfully`);
        }
      } else {
        console.log(`Article "${article.title}" already exists`);
      }
    }
  } catch (error) {
    console.error('Error in ensureArticlesExist:', error);
  }
}
