
import React, { useState } from 'react';
import { User, sendPasswordResetEmail } from 'firebase/auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { EditableText } from '@/components/EditableText';
import { AlertCircle, KeyRound, Loader2 } from 'lucide-react';
import { auth } from '@/integrations/firebase/client';

interface ProfileSecurityProps {
  user: User;
}

export function ProfileSecurity({ user }: ProfileSecurityProps) {
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  
  const handleResetPassword = async () => {
    if (!user.email) {
      toast({
        title: "שגיאה",
        description: "לא נמצאה כתובת אימייל משויכת לחשבון זה",
        variant: "destructive",
      });
      return;
    }
    
    setIsResettingPassword(true);
    
    try {
      await sendPasswordResetEmail(auth, user.email);
      
      toast({
        title: "בקשת איפוס סיסמה נשלחה",
        description: "הוראות לאיפוס הסיסמה נשלחו לכתובת האימייל שלך",
        variant: "default",
      });
    } catch (error) {
      console.error('Error sending password reset:', error);
      toast({
        title: "שגיאה בשליחת בקשת איפוס",
        description: "אירעה שגיאה בשליחת בקשת איפוס הסיסמה. אנא נסה שוב מאוחר יותר.",
        variant: "destructive",
      });
    } finally {
      setIsResettingPassword(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <EditableText id="profile-security-title">אבטחה</EditableText>
        </CardTitle>
        <CardDescription>
          <EditableText id="profile-security-description">נהל את הגדרות האבטחה של חשבונך</EditableText>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md flex gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800">
              <EditableText id="profile-password-security">אבטחת סיסמה</EditableText>
            </h4>
            <p className="text-sm text-yellow-700 mt-1">
              <EditableText id="profile-password-recommendation">
                מומלץ לשנות את הסיסמה שלך מעת לעת ולהשתמש בסיסמה חזקה וייחודית.
              </EditableText>
            </p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleResetPassword}
          disabled={isResettingPassword}
          variant="outline"
          className="border-law-navy text-law-navy hover:bg-law-navy/10"
        >
          {isResettingPassword ? (
            <>
              <Loader2 className="h-4 w-4 ml-2 animate-spin" />
              <EditableText id="profile-sending-reset">שולח...</EditableText>
            </>
          ) : (
            <>
              <KeyRound className="h-4 w-4 ml-2" />
              <EditableText id="profile-reset-password">איפוס סיסמה</EditableText>
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
