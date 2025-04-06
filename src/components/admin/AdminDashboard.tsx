
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  MessageSquare, 
  User, 
  CalendarDays,
  Loader2 
} from 'lucide-react';
import { getAppointmentCounts } from '@/services/appointmentService';
import { collection, getCountFromServer, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend 
} from 'chart.js';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

export function AdminDashboard() {
  const [appointmentStats, setAppointmentStats] = useState({ total: 0, pending: 0, confirmed: 0 });
  const [articlesCount, setArticlesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0); 
  const [usersCount, setUsersCount] = useState(0);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [statsData, setStatsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch appointment stats
        const apptCounts = await getAppointmentCounts();
        setAppointmentStats(apptCounts);
        
        // Fetch articles count
        const articlesSnapshot = await getCountFromServer(collection(db, 'articles'));
        setArticlesCount(articlesSnapshot.data().count);
        
        // Fetch comments count
        const commentsSnapshot = await getCountFromServer(collection(db, 'comments'));
        setCommentsCount(commentsSnapshot.data().count);
        
        // Fetch users count (from profiles collection)
        const profilesSnapshot = await getCountFromServer(collection(db, 'profiles'));
        setUsersCount(profilesSnapshot.data().count);

        // Create stats data for the chart
        setStatsData([
          { name: 'מאמרים', value: articlesSnapshot.data().count },
          { name: 'תגובות', value: commentsSnapshot.data().count },
          { name: 'משתמשים', value: profilesSnapshot.data().count },
          { name: 'פגישות', value: apptCounts.total }
        ]);
        
        // Fetch recent activity (recent comments)
        const recentCommentsQuery = query(
          collection(db, 'comments'),
          orderBy('created_at', 'desc'),
          limit(5)
        );
        
        const recentCommentsSnapshot = await getDocs(recentCommentsQuery);
        const recentCommentsData = recentCommentsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            type: 'comment',
            content: data.content.substring(0, 60) + (data.content.length > 60 ? '...' : ''),
            user_id: data.user_id,
            date: data.created_at?.toDate() || new Date(),
            article_id: data.article_id
          };
        });
        
        setRecentActivity(recentCommentsData);
        
        // TODO: Fetch upcoming appointments if needed in the future
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Set up interval to refresh data every minute
    const intervalId = setInterval(fetchData, 60000);
    
    return () => clearInterval(intervalId);
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
      icon: MessageSquare,
      color: 'bg-amber-50 text-amber-600',
      link: '/admin/comments',
    },
    {
      title: 'משתמשים',
      value: usersCount,
      icon: User,
      color: 'bg-purple-50 text-purple-600',
      link: '#',
    },
  ];

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('he-IL', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

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
            <CardDescription>התגובות האחרונות שנוספו למערכת</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <Link 
                    key={activity.id} 
                    to={`/article/${activity.article_id}`}
                    className="flex items-start p-3 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <div className={`p-2 rounded-full bg-amber-50 text-amber-600 mr-3`}>
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium text-sm">תגובה חדשה</p>
                        <span className="text-xs text-gray-500">{formatDate(activity.date)}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{activity.content}</p>
                    </div>
                  </Link>
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
            <CardTitle>סטטיסטיקות</CardTitle>
            <CardDescription>סקירה כללית של נתוני המערכת</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-law-navy animate-spin" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={statsData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-2 border rounded shadow-sm">
                            <p className="font-bold">{payload[0].payload.name}</p>
                            <p>כמות: {payload[0].value}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
