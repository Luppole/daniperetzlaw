
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, FileText, MessageCircle, Users } from 'lucide-react';
import { getAppointmentCounts } from '@/services/appointmentService';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { getAllArticles } from '@/services/articleService';
import { collection, getCountFromServer } from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';

export function AdminDashboard() {
  const [appointmentStats, setAppointmentStats] = useState({ total: 0, pending: 0, confirmed: 0 });
  const [articlesCount, setArticlesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch appointment stats
        const apptCounts = await getAppointmentCounts();
        setAppointmentStats(apptCounts);
        
        // Fetch article count from Firebase
        try {
          const articlesSnapshot = await getCountFromServer(collection(db, 'articles'));
          setArticlesCount(articlesSnapshot.data().count);
        } catch (error) {
          console.error('Error fetching articles count:', error);
          // Fallback: Fetch all articles and count them
          const articles = await getAllArticles();
          // Remove duplicates by creating a Set of IDs
          const uniqueArticles = new Set(articles.map(article => article.id));
          setArticlesCount(uniqueArticles.size);
        }
        
        // Fetch comments count
        const { count: commentsCountData } = await supabase
          .from('comments')
          .select('*', { count: 'exact' });
        setCommentsCount(commentsCountData || 0);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const statCards = [
    {
      title: 'מאמרים',
      value: articlesCount,
      icon: FileText,
      color: 'bg-blue-50 text-blue-600',
      link: '/admin/articles',
    },
    {
      title: 'פגישות',
      value: appointmentStats.total,
      icon: CalendarDays,
      color: 'bg-green-50 text-green-600',
      link: '/admin/appointments',
    },
    {
      title: 'תגובות',
      value: commentsCount,
      icon: MessageCircle,
      color: 'bg-amber-50 text-amber-600',
      link: '/admin/comments',
    },
    {
      title: 'משתמשים',
      value: null,
      icon: Users,
      color: 'bg-purple-50 text-purple-600',
      link: '#',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-law-navy">דשבורד</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <Link key={card.title} to={card.link} className="block">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex justify-between items-start">
                  <span>{card.title}</span>
                  <div className={`p-2.5 rounded-lg ${card.color}`}>
                    <card.icon className="h-5 w-5" />
                  </div>
                </CardTitle>
                <CardDescription>סה"כ מספר ה{card.title}</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-3xl font-bold">{card.value ?? 0}</div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>פעילות אחרונה</CardTitle>
            <CardDescription>הפעולות האחרונות שבוצעו במערכת</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                אין נתוני פעילות להצגה כרגע
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>פגישות קרובות</CardTitle>
            <CardDescription>הפגישות המתוכננות בימים הקרובים</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                אין פגישות קרובות להצגה כרגע
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
