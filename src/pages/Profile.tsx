
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileDetails } from '@/components/profile/ProfileDetails';
import { ProfileSecurity } from '@/components/profile/ProfileSecurity';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const Profile = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-law-light">
        <Loader2 className="h-10 w-10 text-law-navy animate-spin mx-auto" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold text-law-navy mb-10">הפרופיל שלי</h1>
      
      <div className="grid gap-8">
        <ProfileHeader user={user} />
        
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-fit md:grid-cols-2 mb-8">
            <TabsTrigger value="details">פרטים אישיים</TabsTrigger>
            <TabsTrigger value="security">אבטחה</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <ProfileDetails user={user} />
          </TabsContent>
          
          <TabsContent value="security">
            <ProfileSecurity user={user} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
