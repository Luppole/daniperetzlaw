
import React from 'react';
import { User } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EditableText } from '@/components/EditableText';
import { Card, CardContent } from '@/components/ui/card';

interface ProfileHeaderProps {
  user: User;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  // Get initials for avatar fallback
  const getInitials = () => {
    if (user.displayName) {
      return user.displayName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase();
    }
    return user.email ? user.email.substring(0, 2).toUpperCase() : 'U';
  };

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col md:flex-row items-center gap-6 p-6">
        <Avatar className="h-24 w-24 border-4 border-law-light">
          <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User profile'} />
          <AvatarFallback className="text-2xl bg-law-navy text-white">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        
        <div className="text-center md:text-right">
          <h2 className="text-2xl font-bold text-law-navy">
            {user.displayName || 'משתמש'}
          </h2>
          <p className="text-law-gray">{user.email}</p>
          
          <div className="mt-2 text-sm">
            <span className="text-law-navy bg-law-light/50 px-3 py-1 rounded-full">
              <EditableText id="profile-member-status">חבר מאז {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('he-IL') : 'לא ידוע'}</EditableText>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
