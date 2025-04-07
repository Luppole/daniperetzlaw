
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { Loader2 } from 'lucide-react';
import { SidebarProvider } from '@/components/ui/sidebar';

const Admin = () => {
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If not loading and either not logged in or not admin, redirect to login
    if (!authLoading && !adminLoading) {
      if (!user) {
        navigate('/auth', { replace: true });
      } else if (!isAdmin) {
        navigate('/', { replace: true });
      }
    }
  }, [isAdmin, user, authLoading, adminLoading, navigate]);

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-law-light">
        <Loader2 className="h-10 w-10 text-law-navy animate-spin mx-auto" />
      </div>
    );
  }

  // If not admin, redirect to home
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Wrap AdminLayout with SidebarProvider to fix the context error
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminLayout />
      </div>
    </SidebarProvider>
  );
}

export default Admin;
