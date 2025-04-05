
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Calendar, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Articles = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');
  
  // Sample articles data (in real app, this would come from an API/database)
  const allArticles = [
    {
      id: '1',
      title: 'חידושים בדיני חוזים: פסיקה אחרונה של בית המשפט העליון',
      date: '12 מרץ, 2025',
      author: 'דני פרץ',
      category: 'דיני חוזים',
      summary: 'סקירה מקיפה של פסיקת בית המשפט העליון בנושא דיני חוזים בשנה האחרונה והשלכותיה על עסקאות מסחריות.',
      image: '/lovable-uploads/41432968-0b99-4cba-9e29-f6fdea6a4272.png'
    },
    {
      id: '2',
      title: 'יתרונות וחסרונות של הסכם ממון לפני נישואין',
      date: '5 פברואר, 2025',
      author: 'דני פרץ',
      category: 'דיני משפחה',
      summary: 'מאמר מקיף על היתרונות, החסרונות והשיקולים לעריכת הסכם ממון לפני נישואין, כולל דוגמאות מהפסיקה.',
      image: '/lovable-uploads/41432968-0b99-4cba-9e29-f6fdea6a4272.png'
    },
    {
      id: '3',
      title: 'זכויות עובדים בתקופת משבר: מה שחשוב לדעת',
      date: '18 ינואר, 2025',
      author: 'דני פרץ',
      category: 'דיני עבודה',
      summary: 'סקירה של זכויות עובדים בתקופות משבר, כולל התייחסות למשבר הקורונה והשלכותיו על יחסי עובד-מעביד.',
      image: '/lovable-uploads/41432968-0b99-4cba-9e29-f6fdea6a4272.png'
    },
    {
      id: '4',
      title: 'חדלות פירעון: מדריך מקיף לחוק החדש',
      date: '5 ינואר, 2025',
      author: 'דני פרץ',
      category: 'חדלות פירעון',
      summary: 'סקירה מקיפה של חוק חדלות פירעון ושיקום כלכלי החדש והשלכותיו על חייבים, נושים ובעלי עסקים.',
      image: '/lovable-uploads/41432968-0b99-4cba-9e29-f6fdea6a4272.png'
    },
    {
      id: '5',
      title: 'צוואות וירושות: טעויות נפוצות וכיצד להימנע מהן',
      date: '20 דצמבר, 2024',
      author: 'דני פרץ',
      category: 'צוואות וירושות',
      summary: 'מדריך מקיף לטעויות נפוצות בעריכת צוואות וניהול ירושות, עם טיפים מעשיים כיצד להימנע מהן.',
      image: '/lovable-uploads/41432968-0b99-4cba-9e29-f6fdea6a4272.png'
    },
    {
      id: '6',
      title: 'מדריך לרכישת דירה יד שנייה: היבטים משפטיים',
      date: '10 דצמבר, 2024',
      author: 'דני פרץ',
      category: 'מקרקעין',
      summary: 'מדריך מקיף להיבטים המשפטיים ברכישת דירה יד שנייה, כולל בדיקות שיש לבצע ומכשולים שיש להיזהר מהם.',
      image: '/lovable-uploads/41432968-0b99-4cba-9e29-f6fdea6a4272.png'
    }
  ];

  // Filter articles based on search query
  const filteredArticles = allArticles.filter(article => 
    searchQuery === '' || 
    article.title.includes(searchQuery) ||
    article.category.includes(searchQuery) ||
    article.summary.includes(searchQuery)
  );

  // Categories for filter
  const categories = [...new Set(allArticles.map(article => article.category))];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-law-navy mb-4">מאמרים משפטיים</h1>
            <p className="text-lg text-law-gray max-w-2xl mx-auto">מידע מקצועי עדכני וניתוח משפטי מעמיק בנושאים שונים מעולם המשפט</p>
          </div>
          
          {/* Search and Filter */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-grow">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-law-gray" size={18} />
                <Input 
                  type="search"
                  placeholder="חיפוש מאמרים..."
                  className="pr-10 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={searchQuery === '' ? "default" : "outline"}
                  className={searchQuery === '' ? "bg-law-navy text-white" : "border-law-navy text-law-navy"}
                  onClick={() => setSearchQuery('')}
                >
                  הכל
                </Button>
                {categories.map(category => (
                  <Button 
                    key={category}
                    variant={searchQuery === category ? "default" : "outline"}
                    className={searchQuery === category ? "bg-law-navy text-white" : "border-law-navy text-law-navy"}
                    onClick={() => setSearchQuery(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Articles Grid */}
          {filteredArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {filteredArticles.map((article, index) => (
                <Card 
                  key={article.id} 
                  className="border border-gray-200 hover:shadow-lg transition-shadow flex flex-col h-full transform transition-transform hover:-translate-y-2 animate-on-scroll"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="h-48 overflow-hidden rounded-t-lg">
                    <img 
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-white bg-law-navy px-3 py-1 rounded-full">
                        {article.category}
                      </span>
                      <div className="flex items-center text-law-gray text-sm">
                        <Calendar className="h-3 w-3 ml-1" />
                        <span>{article.date}</span>
                      </div>
                    </div>
                    <CardTitle className="text-xl font-serif text-law-navy line-clamp-2 hover:text-law-navy/80 transition-colors">
                      <a 
                        href={`/article/${article.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/article/${article.id}`);
                          window.scrollTo(0, 0);
                        }}
                      >
                        {article.title}
                      </a>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription className="text-law-gray line-clamp-3">
                      {article.summary}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="pt-4 border-t border-gray-100">
                    <Button 
                      variant="ghost" 
                      className="text-law-navy hover:bg-law-navy/10 p-0 group"
                      onClick={() => navigate(`/article/${article.id}`)}
                    >
                      <span className="group-hover:mr-1 transition-all">המשך קריאה</span>
                      <ArrowLeft className="mr-2 h-4 w-4 group-hover:mr-3 transition-all" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-law-light rounded-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-2xl font-bold text-law-navy mb-4">לא נמצאו תוצאות</h3>
              <p className="text-law-gray mb-6">לא נמצאו מאמרים התואמים את החיפוש שלך</p>
              <Button 
                onClick={() => setSearchQuery('')} 
                className="bg-law-navy hover:bg-law-navy/90"
              >
                הצג את כל המאמרים
              </Button>
            </div>
          )}
          
          {/* Call to Action */}
          <div className="bg-law-navy text-white rounded-lg p-8 mt-16 shadow-lg flex flex-col md:flex-row items-center justify-between animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="mb-6 md:mb-0 text-center md:text-right">
              <h3 className="text-2xl font-bold mb-2">מעוניין בייעוץ משפטי?</h3>
              <p className="text-law-silver max-w-xl">צור קשר עוד היום לקביעת פגישת ייעוץ עם עו"ד דני פרץ בנושאים משפטיים מגוונים</p>
            </div>
            <Button 
              className="bg-white text-law-navy hover:bg-law-silver hover:text-law-navy transform transition-transform hover:scale-105"
              onClick={() => navigate('/#contact')}
            >
              צור קשר עכשיו
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Articles;
