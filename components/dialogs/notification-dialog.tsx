'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
export default function NotificationDialog({
  open,
  notification,
  onClose,
  onArchive,
}: {
  open: boolean;
  notification: any | null;
  onClose: () => void;
  onArchive: (n: any) => void;
}) {
  if (!notification) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{notification.title}</DialogTitle>
          <DialogDescription>
            {notification.env} • {notification.date}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <p>
            This notification can open a dialog with more details, actions, or a deployment log.
          </p>
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => notification && onArchive(notification)}>Archive</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
