
import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('נדרשת כתובת דוא"ל תקינה'),
  password: z.string().min(6, 'הסיסמה חייבת להיות לפחות 6 תווים'),
});

const signupSchema = z.object({
  fullName: z.string().min(2, 'השם המלא חייב להיות לפחות 2 תווים'),
  email: z.string().email('נדרשת כתובת דוא"ל תקינה'),
  password: z.string().min(6, 'הסיסמה חייבת להיות לפחות 6 תווים'),
  confirmPassword: z.string().min(6, 'הסיסמה חייבת להיות לפחות 6 תווים'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "הסיסמאות אינן תואמות",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

const Auth = () => {
  const { user, loading, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onLoginSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      await signIn(values.email, values.password);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSignupSubmit = async (values: SignupFormValues) => {
    setIsSubmitting(true);
    try {
      await signUp(values.email, values.password, values.fullName);
      setActiveTab('login');
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If the user is already logged in, redirect to home page
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-law-navy" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">התחברות</TabsTrigger>
              <TabsTrigger value="signup">הרשמה</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-center text-law-navy">התחברות</CardTitle>
                  <CardDescription className="text-center">
                    התחבר לחשבון שלך כדי לגשת לתכונות נוספות
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>דוא"ל</FormLabel>
                            <FormControl>
                              <Input placeholder="הזן את הדוא״ל שלך" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>סיסמה</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="הזן את הסיסמה שלך" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full bg-law-navy hover:bg-law-navy/90"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                            מתחבר...
                          </>
                        ) : 'התחבר'}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button 
                    variant="link" 
                    onClick={() => setActiveTab('signup')}
                    className="text-law-navy"
                  >
                    אין לך חשבון? הירשם עכשיו
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-center text-law-navy">הרשמה</CardTitle>
                  <CardDescription className="text-center">
                    צור חשבון חדש כדי להגיב, לדרג תוכן ולהשאיר ביקורות
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...signupForm}>
                    <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                      <FormField
                        control={signupForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>שם מלא</FormLabel>
                            <FormControl>
                              <Input placeholder="הזן את שמך המלא" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signupForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>דוא"ל</FormLabel>
                            <FormControl>
                              <Input placeholder="הזן את הדוא״ל שלך" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signupForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>סיסמה</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="בחר סיסמה" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signupForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>אימות סיסמה</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="הזן שוב את הסיסמה" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full bg-law-navy hover:bg-law-navy/90"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                            יוצר חשבון...
                          </>
                        ) : 'הירשם'}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button 
                    variant="link" 
                    onClick={() => setActiveTab('login')}
                    className="text-law-navy"
                  >
                    יש לך כבר חשבון? התחבר כאן
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
