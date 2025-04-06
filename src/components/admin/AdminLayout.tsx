
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Calendar,
  MessageCircle,
  Mail,
  ChevronLeft,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useTextEdit } from '@/contexts/TextEditContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface SidebarLink {
  title: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const { logout } = useAuth();
  const { toggleEditMode, isEditMode } = useTextEdit();

  const links: SidebarLink[] = [
    {
      title: 'לוח בקרה',
      path: '/admin',
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      title: 'מאמרים',
      path: '/admin/articles',
      icon: <FileText className="h-5 w-5" />
    },
    {
      title: 'פגישות',
      path: '/admin/appointments',
      icon: <Calendar className="h-5 w-5" />
    },
    {
      title: 'תגובות',
      path: '/admin/comments',
      icon: <MessageCircle className="h-5 w-5" />
    },
    {
      title: 'הודעות',
      path: '/admin/messages',
      icon: <Mail className="h-5 w-5" />
    }
  ];

  const currentPath = location.pathname;
  
  const isActive = (path: string) => {
    if (path === '/admin') {
      return currentPath === '/admin';
    }
    return currentPath.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-law-light/30 flex flex-col">
      <div className="bg-white p-4 shadow flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/admin" className="text-2xl font-bold text-law-navy">
            ממשק ניהול
          </Link>
          <Separator orientation="vertical" className="h-6 mx-4" />
          <Link to="/" className="text-law-gray hover:text-law-navy flex items-center text-sm">
            <ChevronLeft className="h-4 w-4 ml-1" />
            חזרה לאתר
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant={isEditMode ? "default" : "outline"}
            size="sm"
            onClick={toggleEditMode}
          >
            {isEditMode ? 'סיום עריכת תוכן' : 'עריכת תוכן'}
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => logout ? logout() : null}
          >
            <LogOut className="h-4 w-4 ml-2" />
            התנתק
          </Button>
        </div>
      </div>
      
      <div className="flex flex-1">
        <aside className="w-64 bg-white shadow-md">
          <nav className="p-4">
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className={`
                      flex items-center p-3 rounded-md transition-colors
                      ${isActive(link.path) 
                        ? 'bg-law-navy text-white' 
                        : 'text-law-gray hover:bg-law-light hover:text-law-navy'
                      }
                    `}
                  >
                    <span className="ml-3">{link.icon}</span>
                    <span>{link.title}</span>
                    {link.badge && (
                      <span className="mr-auto bg-law-navy text-white px-2 py-0.5 rounded-full text-xs">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 min-h-[calc(100vh-120px)]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
