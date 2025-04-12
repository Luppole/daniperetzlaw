
import React, { useEffect } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { useAuth } from '@/contexts/AuthContext';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AdminArticles } from '@/components/admin/AdminArticles';
import { AdminAppointments } from '@/components/admin/AdminAppointments';
import { AdminComments } from '@/components/admin/AdminComments';
import { AdminMessages } from '@/components/admin/AdminMessages';
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
      <div className="min-h-screen w-full flex items-center justify-center bg-law-light">
        <Loader2 className="h-10 w-10 text-law-navy animate-spin mx-auto" />
      </div>
    );
  }

  // If not admin, redirect to home
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <SidebarProvider>
      <div className="w-full">
        <AdminLayout>
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="articles/*" element={<AdminArticles />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="comments" element={<AdminComments />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </AdminLayout>
      </div>
    </SidebarProvider>
  );
}

export default Admin;
