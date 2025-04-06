
import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { updateProfile } from 'firebase/auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { EditableText } from '@/components/EditableText';
import { Loader2, Save } from 'lucide-react';

interface ProfileDetailsProps {
  user: User;
}

export function ProfileDetails({ user }: ProfileDetailsProps) {
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleUpdateProfile = async () => {
    if (!displayName.trim()) {
      toast({
        title: "שגיאה",
        description: "שם תצוגה אינו יכול להיות ריק",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await updateProfile(user, {
        displayName: displayName
      });
      
      toast({
        title: "הפרופיל עודכן",
        description: "פרטי הפרופיל שלך עודכנו בהצלחה",
        variant: "default",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "שגיאה בעדכון הפרופיל",
        description: "אירעה שגיאה בעדכון הפרופיל. אנא נסה שוב מאוחר יותר.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <EditableText id="profile-details-title">פרטים אישיים</EditableText>
        </CardTitle>
        <CardDescription>
          <EditableText id="profile-details-description">עדכן את פרטי הפרופיל שלך</EditableText>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="displayName">
            <EditableText id="profile-display-name-label">שם תצוגה</EditableText>
          </Label>
          <Input 
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="הזן את שם התצוגה שלך"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">
            <EditableText id="profile-email-label">כתובת אימייל</EditableText>
          </Label>
          <Input 
            id="email"
            value={user.email || ''}
            disabled
            className="bg-gray-100"
          />
          <p className="text-xs text-law-gray">
            <EditableText id="profile-email-note">לא ניתן לשנות את כתובת האימייל</EditableText>
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleUpdateProfile}
          disabled={isSubmitting}
          className="bg-law-navy hover:bg-law-navy/90"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 ml-2 animate-spin" />
              <EditableText id="profile-updating">מעדכן...</EditableText>
            </>
          ) : (
            <>
              <Save className="h-4 w-4 ml-2" />
              <EditableText id="profile-save-changes">שמור שינויים</EditableText>
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
