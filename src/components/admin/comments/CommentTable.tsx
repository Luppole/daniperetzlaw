
import React from 'react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { Eye, Trash2 } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CommentWithArticle } from '@/types/comment';

interface CommentTableProps {
  comments: CommentWithArticle[];
  onDelete: (comment: CommentWithArticle) => void;
}

export function CommentTable({ comments, onDelete }: CommentTableProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd בMMM yyyy, HH:mm', { locale: he });
    } catch (error) {
      return dateString;
    }
  };

  const truncateContent = (content: string, maxLength = 50) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>מאמר</TableHead>
            <TableHead>תגובה</TableHead>
            <TableHead>משתמש</TableHead>
            <TableHead>תאריך</TableHead>
            <TableHead className="text-left">פעולות</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comments.map((comment) => (
            <TableRow key={comment.id}>
              <TableCell>
                <Badge variant="outline" className="bg-gray-50 hover:bg-gray-100">
                  {truncateContent(comment.article_title, 20)}
                </Badge>
              </TableCell>
              <TableCell>{truncateContent(comment.content)}</TableCell>
              <TableCell>{comment.user_name}</TableCell>
              <TableCell>{formatDate(comment.created_at)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => window.open(`/article/${comment.article_id}`, '_blank')}
                    title="צפה במאמר"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onDelete(comment)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    title="מחק תגובה"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
