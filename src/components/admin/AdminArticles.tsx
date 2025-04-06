
import React from 'react';
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import { ArticlesList } from './articles/ArticlesList';
import { ArticleForm } from './articles/ArticleForm';
import { ensureArticlesExist } from '@/services/articleInitService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { auth } from '@/integrations/firebase/client';
import { useAdmin } from '@/contexts/AdminContext';

export function AdminArticles() {
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();

  const importDefaultArticles = async () => {
    try {
      // Verify the user is logged in and is an admin
      if (!auth.currentUser) {
        toast.error('יש להתחבר כדי לייבא מאמרים');
        return;
      }
      
      if (!isAdmin) {
        toast.error('רק מנהלים רשאים לייבא מאמרים');
        return;
      }
      
      toast.info('מייבא מאמרים...');
      await ensureArticlesExist();
      toast.success('המאמרים יובאו בהצלחה');
      // Refresh the current page to show the new articles
      navigate(0);
    } catch (error: any) {
      console.error('Error importing articles:', error);
      toast.error(`אירעה שגיאה בייבוא המאמרים: ${error.message}`);
    }
  };

  return (
    <Routes>
      <Route index element={<ArticlesList onImportArticles={importDefaultArticles} />} />
      <Route path="new" element={<ArticleForm />} />
      <Route path="edit/:id" element={<ArticleForm />} />
      <Route path="*" element={<Navigate to="/admin/articles" replace />} />
    </Routes>
  );
}
