
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface DeleteCommentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => Promise<void>;
  isDeleting: boolean;
}

export function DeleteCommentDialog({
  open,
  onOpenChange,
  onDelete,
  isDeleting
}: DeleteCommentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>האם אתה בטוח שברצונך למחוק את התגובה?</DialogTitle>
          <DialogDescription>
            פעולה זו לא ניתנת לביטול. התגובה תימחק לצמיתות מהמערכת.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            ביטול
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                מוחק...
              </>
            ) : 'מחק'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
