
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllSanityArticles } from '@/services/sanityService';
import { MappedArticle } from '@/types/sanity';
import { deleteArticle } from '@/services/articleService';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Edit, Trash2, Plus, RefreshCw, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion';

interface ArticlesListProps {
  onImportArticles?: () => Promise<void>;
}

export function ArticlesList({ onImportArticles }: ArticlesListProps) {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<MappedArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const data = await getAllSanityArticles();
      setArticles(data);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast.error('שגיאה בטעינת המאמרים');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
    setPageLoaded(true);
  }, []);

  // Apply Motion animations when page loads
  useEffect(() => {
    if (pageLoaded && !isLoading) {
      motion('.page-header', {
        opacity: [0, 1],
        y: [20, 0],
      });
      
      motion('.articles-list', {
        opacity: [0, 1],
        y: [20, 0],
        delay: 0.2
      });
      
      // Animate article rows with staggered delay
      articles.forEach((_, index) => {
        motion(`.article-row-${index}`, {
          opacity: [0, 1],
          x: [-10, 0],
          delay: 0.3 + (index * 0.05)
        });
      });
    }
  }, [pageLoaded, isLoading, articles.length]);

  const handleDelete = async (id: string) => {
    try {
      const success = await deleteArticle(id);
      if (success) {
        toast.success('המאמר נמחק בהצלחה');
        setArticles(articles.filter(article => article.id !== id));
      } else {
        toast.error('שגיאה במחיקת המאמר');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      toast.error('שגיאה במחיקת המאמר');
    }
    setDeleteTarget(null);
  };

  const handleImportArticles = async () => {
    if (!onImportArticles) return;
    
    setIsImporting(true);
    try {
      await onImportArticles();
      fetchArticles();
    } finally {
      setIsImporting(false);
    }
  };

  const openSanityStudio = () => {
    window.open('https://daniplaw.sanity.studio/desk/article', '_blank');
  };

  return (
    <div className="container py-6">
      <div className="page-header flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">ניהול מאמרים</h1>
        <div className="flex gap-2">
          {onImportArticles && (
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleImportArticles}
              disabled={isImporting}
            >
              <RefreshCw className={`h-4 w-4 ${isImporting ? 'animate-spin' : ''}`} />
              ייבוא מאמרים
            </Button>
          )}
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={openSanityStudio}
          >
            <ExternalLink className="h-4 w-4" />
            Sanity Studio
          </Button>
          <Button 
            onClick={() => navigate('/admin/articles/new')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            מאמר חדש
          </Button>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="text-blue-700 font-medium mb-2">שדרוג בממשק הניהול</h3>
        <p className="text-sm text-blue-600">
          האתר שודרג להשתמש ב-Sanity.io לניהול מאמרים. ניתן להמשיך לנהל מאמרים כאן, 
          אך מומלץ להשתמש בממשק Sanity החדש לחוויית עריכה משופרת עם כלי עריכה מתקדמים.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-10">
          <div className="animate-spin h-8 w-8 border-4 border-law-navy border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>טוען מאמרים...</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-md">
          <p className="text-gray-500 mb-4">לא נמצאו מאמרים</p>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => navigate('/admin/articles/new')}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              יצירת מאמר חדש
            </Button>
            <Button 
              variant="outline"
              onClick={openSanityStudio}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Sanity Studio
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-md shadow overflow-hidden articles-list">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>כותרת</TableHead>
                <TableHead>קטגוריה</TableHead>
                <TableHead>תאריך</TableHead>
                <TableHead>מחבר</TableHead>
                <TableHead className="text-left">פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article, index) => (
                <TableRow key={article.id} className={`article-row-${index}`}>
                  <TableCell className="font-medium">{article.title}</TableCell>
                  <TableCell>{article.category}</TableCell>
                  <TableCell>{article.date}</TableCell>
                  <TableCell>{article.author}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate(`/admin/articles/edit/${article.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setDeleteTarget(article.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>האם אתה בטוח?</AlertDialogTitle>
            <AlertDialogDescription>
              פעולה זו תמחק את המאמר לצמיתות ולא ניתן יהיה לשחזר אותו.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ביטול</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && handleDelete(deleteTarget)}
              className="bg-red-500 hover:bg-red-600"
            >
              מחיקה
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
