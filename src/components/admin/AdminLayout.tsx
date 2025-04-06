
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  MessageSquare, 
  LogOut,
  Menu,
  X,
  ArrowLeft,
  Edit,
  Save
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { useTextEdit } from '@/contexts/TextEditContext';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { signOut } = useAuth();
  const { isEditMode, toggleEditMode, resetTexts } = useTextEdit();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleBackToWebsite = () => {
    navigate('/');
  };

  const navItems = [
    { name: 'דשבורד', path: '/admin', icon: LayoutDashboard },
    { name: 'מאמרים', path: '/admin/articles', icon: FileText },
    { name: 'פגישות', path: '/admin/appointments', icon: Calendar },
    { name: 'תגובות', path: '/admin/comments', icon: MessageSquare },
  ];

  const NavItem = ({ item }: { item: typeof navItems[0] }) => (
    <NavLink
      to={item.path}
      className={({ isActive }) => `
        flex items-center space-x-2 space-x-reverse px-4 py-3 rounded-lg text-right
        ${isActive ? 'bg-law-navy text-white' : 'text-gray-700 hover:bg-gray-100'}
        transition-all duration-200
      `}
      onClick={() => setIsMobileMenuOpen(false)}
    >
      <item.icon className="ml-2 h-5 w-5" />
      <span>{item.name}</span>
    </NavLink>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <div className="flex items-center rtl">
          <h1 className="text-2xl font-bold text-law-navy">פאנל ניהול</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Text editing toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={isEditMode ? "default" : "outline"}
              onClick={toggleEditMode}
              className={`${isEditMode ? 'bg-green-600 hover:bg-green-700' : 'text-gray-600'}`}
            >
              {isEditMode ? (
                <>
                  <Save className="ml-2 h-4 w-4" />
                  מצב עריכה פעיל
                </>
              ) : (
                <>
                  <Edit className="ml-2 h-4 w-4" />
                  עריכת תוכן
                </>
              )}
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  disabled={!isEditMode}
                >
                  איפוס העריכות
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>איפוס כל העריכות</AlertDialogTitle>
                  <AlertDialogDescription>
                    פעולה זו תמחק את כל העריכות שבוצעו. האם אתה בטוח שברצונך להמשיך?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>ביטול</AlertDialogCancel>
                  <AlertDialogAction 
                    className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                    onClick={resetTexts}
                  >
                    כן, אפס את כל העריכות
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          
          {/* Back to Website Button */}
          <Button 
            variant="outline" 
            onClick={handleBackToWebsite} 
            className="text-law-navy hover:bg-gray-100 mr-2"
          >
            <ArrowLeft className="ml-2 h-4 w-4" />
            חזרה לאתר
          </Button>

          <Button 
            variant="ghost" 
            onClick={handleSignOut} 
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="ml-2 h-4 w-4" />
            התנתק
          </Button>
          
          {/* Mobile menu trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] p-0">
              <div className="py-4 px-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-law-navy">תפריט ניהול</h2>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <NavItem key={item.path} item={item} />
                  ))}
                  <Separator className="my-4" />
                  <Button 
                    variant={isEditMode ? "default" : "outline"}
                    onClick={toggleEditMode}
                    className="w-full justify-start mb-2"
                  >
                    {isEditMode ? (
                      <>
                        <Save className="ml-2 h-4 w-4" />
                        מצב עריכה פעיל
                      </>
                    ) : (
                      <>
                        <Edit className="ml-2 h-4 w-4" />
                        עריכת תוכן
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={handleBackToWebsite}
                  >
                    <ArrowLeft className="ml-2 h-4 w-4" />
                    חזרה לאתר
                  </Button>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - desktop only */}
        <aside className="hidden md:block w-64 border-l bg-white shadow-sm overflow-y-auto">
          <nav className="py-6 px-3 space-y-1">
            {navItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </nav>
        </aside>
        
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
