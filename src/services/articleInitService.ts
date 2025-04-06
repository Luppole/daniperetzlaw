
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  serverTimestamp,
  getCountFromServer,
  limit
} from 'firebase/firestore';
import { db, auth } from '@/integrations/firebase/client';
import { FirebaseArticle } from '@/integrations/firebase/types';

// Sample articles with more content for initial database population
const defaultArticles = [
  {
    title: 'מבוא לדיני משפחה',
    summary: 'מאמר זה מספק סקירה של דיני משפחה בישראל והנושאים החשובים שכל אדם צריך להכיר.',
    content: 'דיני משפחה בישראל מהווים תחום משפטי מורכב ורגיש, המושפע מהדין הדתי, החקיקה האזרחית ופסיקות בית המשפט העליון. תחום זה כולל נושאים כמו נישואין וגירושין, משמורת ילדים, מזונות, חלוקת רכוש, אימוץ ופונדקאות. לאור המערכת המשפטית הייחודית בישראל, בה הסמכות בענייני נישואין וגירושין נתונה לבתי הדין הדתיים, נוצרים לעיתים מצבים מורכבים המחייבים התמודדות עם סוגיות של סמכות שיפוטית. חשוב להכיר את הזכויות והחובות במסגרת דיני המשפחה, ולקבל ייעוץ משפטי מקצועי כדי להבטיח את האינטרסים האישיים והמשפחתיים בצורה מיטבית.',
    category: 'דיני משפחה',
    author: 'עו"ד דני פרץ',
    image_url: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7',
    date: '2023-10-15',
  },
  {
    title: 'זכויות עובדים בישראל',
    summary: 'סקירה של זכויות העובדים העיקריות בישראל וכיצד ניתן לעמוד על מימושן.',
    content: 'חוקי העבודה בישראל נועדו להגן על זכויות העובדים ולהבטיח תנאי העסקה הוגנים. בין הזכויות הבסיסיות: שכר מינימום, שעות עבודה ומנוחה, תשלום עבור שעות נוספות, ימי חופשה, דמי הבראה, ימי מחלה, פיצויי פיטורין והפרשות פנסיוניות. המחוקק הישראלי קבע הסדרים שונים להגנה על עובדים, כגון: חוק שכר מינימום, חוק שעות עבודה ומנוחה, חוק חופשה שנתית, חוק דמי מחלה, חוק פיצויי פיטורין וחוק הגנת השכר. בנוסף, ישנם חוקים האוסרים על אפליה במקום העבודה על רקע מין, דת, גזע, נטייה מינית, גיל והריון. חשוב לדעת שזכויות רבות ניתנות גם מכוח הסכמים קיבוציים והסדרים קיבוציים החלים על ענפי תעסוקה שונים. במקרה של הפרת זכויות, ניתן לפנות לממונה על אכיפת חוקי עבודה במשרד העבודה, להסתדרות או להגיש תביעה בבית הדין לעבודה.',
    category: 'דיני עבודה',
    author: 'עו"ד שרה לוי',
    image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
    date: '2023-11-20',
  },
  {
    title: 'הליך הרישום של דירה בטאבו',
    summary: 'מדריך מקיף להליך רישום הזכויות בדירה בלשכת רישום המקרקעין (טאבו).',
    content: 'רישום דירה בטאבו (לשכת רישום המקרקעין) הוא תהליך חשוב המעגן את זכויות הבעלות בנכס באופן רשמי. הרישום מהווה ראיה חותכת לבעלות ומאפשר לבעלים למכור, למשכן או להוריש את הנכס. השלבים המרכזיים בתהליך כוללים: אימות זכויות המוכר, תשלום מיסים (מס שבח, מס רכישה), הסדרת חובות ארנונה, בדיקת היתרי בנייה, עריכת חוזה מכר, ביצוע עסקה בלשכת רישום המקרקעין וקבלת נסח טאבו המעיד על הבעלות החדשה. במקרים של דירות בבניינים משותפים שטרם נרשמו כבתים משותפים, יש צורך בהליכים מקדימים של רישום הבית המשותף. חשוב להיעזר בעורך דין מקרקעין מנוסה אשר ילווה את התהליך ויוודא שכל הזכויות נרשמות כהלכה.',
    category: 'דיני מקרקעין',
    author: 'עו"ד דני פרץ',
    image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa',
    date: '2023-12-05',
  },
  {
    title: 'דיני ירושה - התמודדות עם צוואות וירושות בישראל',
    summary: 'הסבר מפורט על דיני ירושה בישראל, כולל הליכי אישור צוואה וחלוקת עיזבון.',
    content: 'דיני ירושה בישראל מוסדרים בחוק הירושה, תשכ"ה-1965, המפרט את אופן העברת רכושו של אדם לאחר פטירתו. החוק מכיר בשתי דרכים עיקריות לירושה: על פי צוואה ועל פי דין. ירושה על פי צוואה מכבדת את רצון המוריש כפי שהובע בצוואתו, בכפוף לדרישות הצורה הקבועות בחוק (צוואה בכתב יד, בעדים, בפני רשות או צוואה בעל פה במקרים חריגים). ירושה על פי דין חלה כאשר אדם נפטר ללא צוואה תקפה, וקובעת סדר עדיפויות בין קרובי המשפחה של הנפטר. הליך מימוש הירושה מתחיל בהגשת בקשה לצו ירושה או צו קיום צוואה לרשם לענייני ירושה או לבית המשפט לענייני משפחה. לאחר אישור הצו, ניתן לפעול לחלוקת העיזבון בין היורשים. חשוב להיוועץ בעורך דין המתמחה בדיני ירושה כדי לוודא שהליך העברת הנכסים מתבצע בהתאם לחוק ולרצון המוריש.',
    category: 'דיני ירושה',
    author: 'עו"ד משה כהן',
    image_url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85',
    date: '2024-01-10',
  },
  {
    title: 'הליכי גירושין - הדרך הנכונה להתמודד',
    summary: 'מדריך להתמודדות עם הליכי גירושין בישראל, כולל היבטים משפטיים, רגשיים וכלכליים.',
    content: 'הליכי גירושין בישראל הם מורכבים ומושפעים מהדין הדתי והאזרחי. בשל המבנה הייחודי של מערכת המשפט בישראל, ענייני גירושין מתנהלים בשני מסלולים מקבילים: סידור הגט בבית הדין הדתי (רבני, שרעי, כנסייתי בהתאם לדת בני הזוג) והסדרת הנושאים הנלווים (משמורת ילדים, מזונות, חלוקת רכוש) בבית המשפט לענייני משפחה או בבית הדין הדתי, בהתאם לסמכות השיפוטית. חשוב להתכונן להליך הגירושין באמצעות איסוף מסמכים רלוונטיים (הסכמי ממון, מסמכי בנק, נתוני רכוש), שמירה על תקשורת מכבדת עם בן/בת הזוג, וליווי מקצועי של עורך דין המתמחה בדיני משפחה. גישור או הליך יישוב סכסוך יכולים לסייע בהגעה להסכמות ללא התדיינות ממושכת. בכל מקרה, יש לשים דגש על טובת הילדים ושמירה על יציבות רגשית וכלכלית במהלך התקופה המאתגרת.',
    category: 'דיני משפחה',
    author: 'עו"ד דני פרץ',
    image_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf',
    date: '2024-02-18',
  },
  {
    title: 'זכויות נפגעי תאונות דרכים',
    summary: 'סקירה של זכויות נפגעי תאונות דרכים והדרכים למימוש הפיצויים המגיעים להם.',
    content: 'חוק הפיצויים לנפגעי תאונות דרכים (הפלת"ד) מתשל"ה-1975 מסדיר את זכויות נפגעי תאונות דרכים בישראל. החוק מבוסס על עקרון האחריות המוחלטת, כלומר, הנפגע זכאי לפיצויים ללא צורך בהוכחת אשם. הפיצויים כוללים: הוצאות רפואיות, אובדן השתכרות לתקופת אי-כושר עבודה, פיצוי בגין כאב וסבל, הוצאות עזרה וסיעוד, ובמקרה של נכות תמידית - פיצוי בגין אובדן כושר השתכרות עתידי. חשוב לדעת שקיימת תקופת התיישנות של 7 שנים להגשת תביעה. התהליך מתחיל בהגשת דרישה לחברת הביטוח, הכוללת מסמכים רפואיים ואישור על התאונה. במקרה של דחיית הדרישה או פיצוי בלתי מספק, ניתן להגיש תביעה לבית המשפט. מומלץ להיעזר בעורך דין המתמחה בנזקי גוף, אשר ינהל את המשא ומתן עם חברת הביטוח וידאג למיצוי מלוא הזכויות. חשוב לזכור שחברות הביטוח מעוניינות להקטין את סכום הפיצוי, ולכן ליווי מקצועי הוא קריטי.',
    category: 'דיני נזיקין',
    author: 'עו"ד יעל אברהם',
    image_url: 'https://images.unsplash.com/photo-1551815943-d506cbc9c9bd',
    date: '2024-03-05',
  },
  {
    title: 'הקמת עסק - היבטים משפטיים ומיסויים',
    summary: 'מדריך מעשי להקמת עסק בישראל, כולל בחירת מבנה משפטי, רישוי והיבטי מס.',
    content: 'הקמת עסק בישראל מחייבת התייחסות למספר היבטים משפטיים ומיסויים חשובים. ראשית, יש לבחור את המבנה המשפטי המתאים: עוסק מורשה/פטור, חברה בע"מ, שותפות או עמותה - לכל אחד יתרונות וחסרונות בהיבטי מיסוי, אחריות משפטית וניהול. שנית, יש לדאוג לרישום העסק ברשויות הרלוונטיות: רשם החברות/השותפויות, מס הכנסה, מע"מ וביטוח לאומי. בהתאם לסוג העסק, יתכן שיידרשו אישורים ורישיונות נוספים: רישיון עסק מהרשות המקומית, אישורי בטיחות, אישורי משרד הבריאות ועוד. חשוב להכיר את דיני העבודה החלים על מעסיקים, כולל חובות הפרשה לפנסיה ותנאים סוציאליים. מומלץ להתייעץ עם רואה חשבון לגבי תכנון מס והתנהלות פיננסית נכונה, ועם עורך דין לגבי הסכמים, התקשרויות ורגולציה. כמו כן, יש לדאוג לביטוחים מתאימים: חבות מעבידים, צד ג׳, אחריות מקצועית ורכוש. תכנון נכון בשלב ההקמה יכול למנוע בעיות וסיבוכים משפטיים בהמשך הדרך.',
    category: 'דיני חברות',
    author: 'עו"ד דני פרץ',
    image_url: 'https://images.unsplash.com/photo-1444653614773-995cb1ef9efa',
    date: '2024-03-20',
  }
];

// Function to ensure default articles exist
export async function ensureArticlesExist() {
  try {
    console.log('Checking for existing articles...');
    
    // Check if current user is authenticated
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log('User not authenticated. Skipping article creation.');
      return;
    }
    
    console.log('User authenticated:', currentUser.uid);
    
    // First, check if we can read from the articles collection at all
    try {
      const articlesRef = collection(db, 'articles');
      const countSnapshot = await getCountFromServer(query(articlesRef, limit(1)));
      console.log(`Articles collection accessible, found ${countSnapshot.data().count} documents`);
    } catch (error: any) {
      console.error('Error accessing articles collection:', error.message);
      throw new Error(`Cannot access articles collection: ${error.message}`);
    }
    
    // Get existing articles to check against
    const articlesRef = collection(db, 'articles');
    const articlesSnapshot = await getDocs(articlesRef);
    const existingArticleTitles = new Set();
    
    articlesSnapshot.forEach((doc) => {
      const data = doc.data();
      existingArticleTitles.add(data.title);
    });
    
    // Count for logging purposes
    let addedCount = 0;
    let skippedCount = 0;
    
    // Add each article if it doesn't already exist
    for (const article of defaultArticles) {
      if (!existingArticleTitles.has(article.title)) {
        try {
          const firestoreArticle: Omit<FirebaseArticle, 'id'> = {
            ...article,
            created_at: serverTimestamp() as any,
            updated_at: null
          };
          
          const docRef = await addDoc(collection(db, 'articles'), firestoreArticle);
          console.log(`Article "${article.title}" created successfully with ID: ${docRef.id}`);
          addedCount++;
        } catch (error: any) {
          console.error(`Error creating article "${article.title}":`, error.message);
          if (error.code === 'permission-denied') {
            throw new Error('Permission denied. Please check that you have admin rights.');
          }
        }
      } else {
        console.log(`Article "${article.title}" already exists, skipping`);
        skippedCount++;
      }
    }
    
    console.log(`Articles initialization complete. Added: ${addedCount}, Skipped: ${skippedCount}`);
  } catch (error: any) {
    console.error('Error in ensureArticlesExist:', error.message);
    throw error;
  }
}
