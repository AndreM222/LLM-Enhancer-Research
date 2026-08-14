'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { User } from '@/components/tables/users-columns';

export function InvitationDialog({
  openUser,
  onOpenChange,
}: {
  openUser: User | null;
  onOpenChange: (v: boolean) => void;
}) {
  if (!openUser) return null;

  function statusVariant(status: string) {
    switch (status.toUpperCase()) {
      case 'ACCEPTED':
        return 'default';
      case 'REJECTED':
        return 'destructive';
      case 'SENT':
        return 'secondary';
      default:
        return 'outline';
    }
  }

  return (
    <Dialog open={!!openUser} onOpenChange={(v) => !v && onOpenChange(false)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invitation details</DialogTitle>
          <DialogDescription>Full details for this workspace invitation.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">To</p>
              <p className="font-medium">{openUser.name || '—'}</p>
              <p className="text-sm text-muted-foreground">{openUser.email}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Status</p>
              <Badge variant={statusVariant(openUser.status)}>{openUser.status}</Badge>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Role</p>
              <p className="font-medium">{openUser.roleId ?? '—'}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Sent at</p>
              <p className="text-sm">
                {openUser.time ? new Date(openUser.time).toLocaleString() : '—'}
              </p>
            </div>
          </div>

          {openUser.status.toUpperCase() === 'REJECTED' && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 space-y-1">
              <p className="text-xs font-medium text-destructive">Rejection reason</p>
              <p className="text-sm text-muted-foreground">The user declined this invitation.</p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            {openUser.status.toUpperCase() !== 'ACCEPTED' && (
              <button className="btn btn-outline">Resend</button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
