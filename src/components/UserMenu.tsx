
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { UserCircle, LogOut, User, ShieldAlert } from 'lucide-react';

export function UserMenu() {
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) {
    return (
      <Button 
        onClick={() => navigate('/auth')}
        className="bg-law-navy hover:bg-law-navy/90 text-white transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg"
      >
        <UserCircle className="h-4 w-4 ml-2" />
        התחברות / הרשמה
      </Button>
    );
  }

  // Get the user's initials for the avatar fallback
  const getUserInitials = () => {
    const displayName = user.displayName || user.email || '';
    if (user.displayName) {
      return displayName.substring(0, 2).toUpperCase();
    }
    return user.email ? user.email.substring(0, 2).toUpperCase() : 'U';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border-2 border-law-navy cursor-pointer">
            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || ''} />
            <AvatarFallback className="bg-law-navy text-white">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>החשבון שלי</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <User className="ml-2 h-4 w-4" />
          <span>הפרופיל שלי</span>
        </DropdownMenuItem>
        
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer font-medium text-law-navy" 
              onClick={() => navigate('/admin')}
            >
              <ShieldAlert className="ml-2 h-4 w-4" />
              <span>פאנל ניהול</span>
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer text-red-600 focus:text-red-600" 
          onClick={handleSignOut}
        >
          <LogOut className="ml-2 h-4 w-4" />
          <span>התנתק</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
