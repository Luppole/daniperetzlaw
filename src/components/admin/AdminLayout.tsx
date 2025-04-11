
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Calendar,
  MessageCircle,
  Mail,
  ChevronLeft,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useTextEdit } from '@/contexts/TextEditContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSidebar } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';

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
  const { signOut } = useAuth();
  const { toggleEditMode, isEditMode, resetTexts } = useTextEdit();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { open, setOpen } = useSidebar();

  useEffect(() => {
    // Close mobile menu when changing routes
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Set sidebar expanded state based on mobile state
  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile, setOpen]);

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
      {/* Header */}
      <div className="bg-white p-4 shadow flex justify-between items-center">
        <div className="flex items-center">
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mr-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <Link to="/admin" className="text-xl md:text-2xl font-bold text-law-navy">
            ממשק ניהול
          </Link>
          <Separator orientation="vertical" className="h-6 mx-4 hidden md:block" />
          <Link to="/" className="text-law-gray hover:text-law-navy flex items-center text-sm hidden md:flex">
            <ChevronLeft className="h-4 w-4 ml-1" />
            חזרה לאתר
          </Link>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          {isMobile ? (
            <Button
              variant={isEditMode ? "default" : "outline"}
              size="sm"
              onClick={toggleEditMode}
              className="px-2"
            >
              {isEditMode ? 'סיום עריכה' : 'עריכה'}
            </Button>
          ) : (
            <Button
              variant={isEditMode ? "default" : "outline"}
              size="sm"
              onClick={toggleEditMode}
            >
              {isEditMode ? 'סיום עריכת תוכן' : 'עריכת תוכן'}
            </Button>
          )}
          
          {isEditMode && !isMobile && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetTexts}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              אפס טקסטים
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => signOut ? signOut() : null}
            className="text-law-gray"
            aria-label="התנתק"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex flex-1 relative">
        {/* Mobile Sidebar (Slide-in) */}
        {isMobile && (
          <div 
            className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${
              mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <aside 
              className={`absolute top-0 right-0 h-full w-64 bg-white shadow-xl transition-transform transform ${
                mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="font-bold text-law-navy">תפריט</h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
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
                          <Badge className="mr-auto">
                            {link.badge}
                          </Badge>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
                
                {isEditMode && (
                  <div className="mt-6 pt-6 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetTexts}
                      className="w-full text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      אפס טקסטים
                    </Button>
                  </div>
                )}
                
                <div className="mt-6 pt-6 border-t">
                  <Link 
                    to="/"
                    className="flex items-center p-3 rounded-md text-law-gray hover:bg-law-light hover:text-law-navy"
                  >
                    <ChevronLeft className="h-4 w-4 ml-2" />
                    חזרה לאתר
                  </Link>
                </div>
              </nav>
            </aside>
          </div>
        )}
        
        {/* Desktop Sidebar */}
        {!isMobile && (
          <aside className="w-64 bg-white shadow-md hidden md:block">
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
                        <Badge className="mr-auto bg-white text-law-navy">
                          {link.badge}
                        </Badge>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        )}
        
        <main className="flex-1 p-3 md:p-6 overflow-auto w-full">
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 min-h-[calc(100vh-120px)]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
