import * as React from 'react';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/integrations/firebase/client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { EditableText } from '@/components/EditableText';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<User | null>;
  signUp: (email: string, password: string, fullName?: string) => Promise<User | null>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signIn: async () => null,
  signUp: async () => null,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<User | null> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast.success('התחברת בהצלחה');
      return userCredential.user;
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = getErrorMessage(error.code);
      toast.error(errorMessage || 'שגיאה בכניסה');
      throw error;
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    fullName?: string
  ): Promise<User | null> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
      
      if (fullName) {
        await updateProfile(newUser, {
          displayName: fullName
        });
      }

      await setDoc(doc(db, 'profiles', newUser.uid), {
        id: newUser.uid,
        full_name: fullName || '',
        avatar_url: null,
        created_at: serverTimestamp(),
      });

      await sendEmailVerification(newUser);
      
      toast.success('הרשמה בוצעה בהצלחה! אנא בדוק את המייל שלך לאימות');
      return newUser;
    } catch (error: any) {
      console.error('Signup error:', error);
      const errorMessage = getErrorMessage(error.code);
      toast.error(errorMessage || 'שגיאה בהרשמה');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      toast.success('התנתקת בהצלחה');
    } catch (error: any) {
      toast.error(error.message || 'שגיאה בהתנתקות');
    }
  };

  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'כתובת המייל אינה תקינה';
      case 'auth/user-disabled':
        return 'חשבון זה מושבת';
      case 'auth/user-not-found':
        return 'לא נמצא משתמש עם כתובת המייל הזו';
      case 'auth/wrong-password':
        return 'סיסמה שגויה';
      case 'auth/email-already-in-use':
        return 'כתובת המייל כבר בשימוש';
      case 'auth/weak-password':
        return 'הסיסמה חלשה מדי';
      case 'auth/operation-not-allowed':
        return 'פעולה זו אינה מורשית';
      case 'auth/too-many-requests':
        return 'יותר מדי ניסיונות כניסה, נסה שוב מאוחר יותר';
      case 'auth/network-request-failed':
        return 'בעיית רשת, בדוק את החיבור שלך לאינטרנט';
      default:
        return 'שגיאה לא צפויה, נסה שוב מאוחר יותר';
    }
  };

  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-law-light">
        <div className="text-center">
          <Loader2 className="h-10 w-10 text-law-navy animate-spin mx-auto mb-4" />
          <p className="text-law-gray font-medium">
            <EditableText id="auth-loading">טוען...</EditableText>
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
