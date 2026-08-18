'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { PaymentCard } from '@/components/dialogs/add-payment-dialog';
import { getBrandLabel } from '@/components/card-brand';
import { Button } from '@/components/ui/button';

export default function ConfirmRemoveCardDialog({
  open,
  onOpenChange,
  deletingCard,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  deletingCard: PaymentCard | undefined | null;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove card?</AlertDialogTitle>
        </AlertDialogHeader>

        <div className="py-2">
          <p className="text-sm text-muted-foreground">
            {deletingCard && deletingCard.isDefault
              ? 'This is your default card. The next card on file will become the default.'
              : `This will permanently remove ${getBrandLabel(deletingCard?.brand ?? 'unknown')} ending in ${deletingCard?.last4}.`}
          </p>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={onConfirm}
            >
              Remove card
            </Button>
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
