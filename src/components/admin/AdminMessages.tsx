
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchContactMessages, 
  markMessageAsRead, 
  deleteMessage 
} from '@/services/contactMessageService';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Trash2, MailOpen, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { he } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import { ContactMessage } from '@/types/contact-message';
import { auth } from '@/integrations/firebase/client';
import { useAuth } from '@/contexts/AuthContext';

export function AdminMessages() {
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Check if user is authenticated
  useEffect(() => {
    if (!user) {
      toast.error("עליך להתחבר כדי לצפות בהודעות ולנהל אותן");
    }
  }, [user]);

  // Fetch messages with improved error handling
  const { data: messages, isLoading, error, refetch } = useQuery({
    queryKey: ['contactMessages'],
    queryFn: fetchContactMessages,
    retry: 2,
    retryDelay: 1000,
    staleTime: 30000,
    refetchOnWindowFocus: true,
    enabled: !!user // Only fetch if user is authenticated
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: markMessageAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactMessages'] });
      toast.success('הודעה סומנה כנקראה');
    },
    onError: (error) => {
      console.error('Error marking message as read:', error);
      toast.error('שגיאה בסימון ההודעה: ' + error);
    }
  });

  // Delete message mutation with improved error handling
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // Check if user is authenticated before proceeding
      if (!auth.currentUser) {
        throw new Error('יש להתחבר כדי למחוק הודעות');
      }
      
      console.log('Attempting to delete message with ID:', id);
      await deleteMessage(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactMessages'] });
      toast.success('ההודעה נמחקה בהצלחה');
      setMessageToDelete(null);
    },
    onError: (error) => {
      console.error('Error deleting message:', error);
      toast.error(`שגיאה במחיקת ההודעה: ${error}`);
      setMessageToDelete(null);
    }
  });

  // View message details
  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    if (!message.read) {
      markAsReadMutation.mutate(message.id);
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (messageToDelete !== null) {
      deleteMutation.mutate(messageToDelete);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return formatDistance(new Date(dateString), new Date(), { 
        addSuffix: true,
        locale: he 
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  // If no user is authenticated, show a message
  if (!user) {
    return (
      <div className="text-center py-10 bg-law-light/50 rounded-lg">
        <AlertTriangle className="h-10 w-10 text-orange-500 mx-auto mb-2" />
        <p className="text-gray-600 font-medium mb-2">יש להתחבר כדי לצפות בהודעות</p>
        <p className="text-sm text-gray-500">עליך להיות מחובר כדי לנהל את הודעות הקשר</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 text-law-navy animate-spin" />
      </div>
    );
  }

  // Handle empty state or error
  if (!messages || messages.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-law-navy">הודעות מטופס צור קשר</h2>
          <Button variant="outline" onClick={() => refetch()} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            רענן
          </Button>
        </div>
        
        <div className="text-center py-10 bg-law-light/50 rounded-lg">
          {error ? (
            <>
              <AlertTriangle className="h-10 w-10 text-orange-500 mx-auto mb-2" />
              <p className="text-gray-600 font-medium mb-2">שגיאה בטעינת ההודעות</p>
              <p className="text-sm text-gray-500 mb-4">{String(error)}</p>
              <Button 
                variant="outline" 
                onClick={() => refetch()}
                className="mx-auto"
              >
                <RefreshCw className="h-4 w-4 ml-2" />
                נסה שוב
              </Button>
            </>
          ) : (
            <>
              <MailOpen className="h-10 w-10 text-law-gray mx-auto mb-2" />
              <p className="text-law-gray">אין הודעות</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-law-navy">הודעות מטופס צור קשר</h2>
        <Badge variant="outline" className="bg-law-navy/10 text-law-navy">
          {messages?.length || 0} הודעות
        </Badge>
      </div>

      {messages?.length === 0 ? (
        <div className="text-center py-10 bg-law-light/50 rounded-lg">
          <MailOpen className="h-10 w-10 text-law-gray mx-auto mb-2" />
          <p className="text-law-gray">אין הודעות חדשות</p>
        </div>
      ) : (
        <Table>
          <TableCaption>רשימת הודעות מטופס צור קשר</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>סטטוס</TableHead>
              <TableHead>שם</TableHead>
              <TableHead>טלפון</TableHead>
              <TableHead>נושא</TableHead>
              <TableHead>תאריך</TableHead>
              <TableHead className="text-left">פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages?.map((message) => (
              <TableRow 
                key={message.id} 
                className={message.read ? '' : 'bg-law-light/30 font-medium'}
              >
                <TableCell>
                  {message.read ? (
                    <Badge variant="outline" className="bg-gray-100">נקרא</Badge>
                  ) : (
                    <Badge className="bg-law-navy">חדש</Badge>
                  )}
                </TableCell>
                <TableCell>{message.name}</TableCell>
                <TableCell>{message.phone}</TableCell>
                <TableCell>{message.subject}</TableCell>
                <TableCell>{formatDate(message.created_at)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2 space-x-reverse">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-law-navy"
                      onClick={() => handleViewMessage(message)}
                    >
                      <Eye className="h-4 w-4 ml-1" />
                      צפה
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => setMessageToDelete(message.id)}
                    >
                      <Trash2 className="h-4 w-4 ml-1" />
                      מחק
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Message details dialog */}
      <Dialog 
        open={selectedMessage !== null} 
        onOpenChange={(open) => !open && setSelectedMessage(null)}
      >
        {selectedMessage && (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-law-navy text-xl">
                {selectedMessage.subject}
              </DialogTitle>
              <DialogDescription>
                נשלח על ידי {selectedMessage.name} ב-{formatDate(selectedMessage.created_at)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-law-light/30 p-3 rounded-md">
                  <p className="text-sm text-law-gray">שם מלא</p>
                  <p className="font-medium">{selectedMessage.name}</p>
                </div>
                <div className="bg-law-light/30 p-3 rounded-md">
                  <p className="text-sm text-law-gray">טלפון</p>
                  <p className="font-medium">{selectedMessage.phone}</p>
                </div>
                <div className="bg-law-light/30 p-3 rounded-md col-span-2">
                  <p className="text-sm text-law-gray">אימייל</p>
                  <p className="font-medium">{selectedMessage.email}</p>
                </div>
              </div>

              <div className="bg-law-light/20 p-4 rounded-md border border-law-light">
                <p className="text-sm text-law-gray mb-2">תוכן ההודעה:</p>
                <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              <div className="flex justify-end space-x-2 space-x-reverse pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedMessage(null)}
                >
                  סגור
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => {
                    setMessageToDelete(selectedMessage.id);
                    setSelectedMessage(null);
                  }}
                >
                  <Trash2 className="h-4 w-4 ml-2" />
                  מחק הודעה
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Delete confirmation dialog */}
      <AlertDialog 
        open={messageToDelete !== null} 
        onOpenChange={(open) => !open && setMessageToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>האם אתה בטוח שברצונך למחוק הודעה זו?</AlertDialogTitle>
            <AlertDialogDescription>
              פעולה זו לא ניתנת לביטול. הודעה זו תימחק לצמיתות מהמערכת.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ביטול</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  מוחק...
                </>
              ) : (
                'מחק'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
