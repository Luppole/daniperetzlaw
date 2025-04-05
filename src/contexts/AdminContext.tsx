
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';

// List of admin emails
const ADMIN_EMAILS = [
  'itamarperetzofficial@gmail.com',
  'danip05@gmail.com'
];

type AdminContextType = {
  isAdmin: boolean;
  isLoading: boolean;
};

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  isLoading: true
});

export const useAdmin = () => useContext(AdminContext);

type AdminProviderProps = {
  children: ReactNode;
};

export const AdminProvider = ({ children }: AdminProviderProps) => {
  const { user, isLoading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      // Check if user email is in admin list
      setIsAdmin(!!user && user.email && ADMIN_EMAILS.includes(user.email));
      setIsLoading(false);
    }
  }, [user, authLoading]);

  return (
    <AdminContext.Provider value={{ isAdmin, isLoading }}>
      {children}
    </AdminContext.Provider>
  );
};
