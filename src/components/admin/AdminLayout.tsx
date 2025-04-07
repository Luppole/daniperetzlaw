
import React from 'react';
import { Route, Routes, Link, useLocation, Navigate } from 'react-router-dom';
import { Sidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  MessageSquare, 
  MessageCircle,
  Star
} from 'lucide-react';
import { AdminDashboard } from './AdminDashboard';
import { AdminArticles } from './AdminArticles';
import { AdminAppointments } from './AdminAppointments';
import { AdminMessages } from './AdminMessages';
import { AdminComments } from './AdminComments';
import ReviewManagement from './reviews/ReviewManagement';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { isAdmin, isLoading } = useAdmin();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-10 h-10 border-4 border-law-navy border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  const items = [
    {
      title: 'דף הבית',
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: '/admin',
      active: location.pathname === '/admin'
    },
    {
      title: 'מאמרים',
      icon: <FileText className="h-5 w-5" />,
      href: '/admin/articles',
      active: location.pathname.startsWith('/admin/articles')
    },
    {
      title: 'פגישות',
      icon: <Calendar className="h-5 w-5" />,
      href: '/admin/appointments',
      active: location.pathname === '/admin/appointments'
    },
    {
      title: 'הודעות',
      icon: <MessageSquare className="h-5 w-5" />,
      href: '/admin/messages',
      active: location.pathname === '/admin/messages'
    },
    {
      title: 'תגובות',
      icon: <MessageCircle className="h-5 w-5" />,
      href: '/admin/comments',
      active: location.pathname === '/admin/comments'
    },
    {
      title: 'חוות דעת',
      icon: <Star className="h-5 w-5" />,
      href: '/admin/reviews',
      active: location.pathname === '/admin/reviews'
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 w-full">
      <Sidebar className="hidden md:block border-l pt-6">
        <div className="space-y-4 py-4">
          <div className="px-4 py-2 mb-8">
            <h2 className="px-2 mb-2 text-lg font-semibold tracking-tight text-law-navy">
              פאנל ניהול
            </h2>
          </div>
          <nav className="flex flex-col gap-2 px-2">
            {items.map((item, index) => (
              <Link 
                key={index} 
                to={item.href}
              >
                <Button 
                  variant={item.active ? "secondary" : "ghost"} 
                  className={cn(
                    "w-full justify-start", 
                    item.active ? "bg-gray-100 text-law-navy font-medium" : ""
                  )}
                >
                  {item.icon}
                  <span className="mr-2">{item.title}</span>
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      </Sidebar>

      <div className="flex-1 p-8 pr-4 bg-white dark:bg-gray-950 shadow-sm rounded-tr-lg overflow-auto">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/articles/*" element={<AdminArticles />} />
          <Route path="/appointments" element={<AdminAppointments />} />
          <Route path="/messages" element={<AdminMessages />} />
          <Route path="/comments" element={<AdminComments />} />
          <Route path="/reviews" element={<ReviewManagement />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminLayout;
