'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { AlertTriangle, ShieldCheck, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'motion/react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getInvoices, getPlanUsage } from '@/lib/mockApi';
import { Progress } from '@/components/ui/progress';
import { InvoiceTable } from '@/components/tables/invoice-columns';
import { CardBrand, PaymentCardVisual, getBrandLabel } from '@/components/card-brand';
import AddPaymentDialog from '@/components/dialogs/add-payment-dialog';
import ConfirmRemoveCardDialog from '@/components/dialogs/confirm-remove-card-dialog';

const invoices = getInvoices();
const usage = getPlanUsage();

type PaymentCard = {
  id: string;
  last4: string;
  brand: CardBrand;
  expiry: string;
  isDefault: boolean;
  name: string;
};

const INITIAL_CARDS: PaymentCard[] = [
  { id: 'card-1', last4: '4242', brand: 'visa', expiry: '09/28', isDefault: true, name: 'Jerry' },
];

function BillingPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [cards, setCards] = useState<PaymentCard[]>(INITIAL_CARDS);
  const [addOpen, setAddOpen] = useState(searchParams.get('dialog') === 'add-card');
  const [deleteId, setDeleteId] = useState<string | null>(searchParams.get('remove-card'));

  useEffect(() => {
    const dialog = searchParams.get('dialog');
    const removeCard = searchParams.get('remove-card');
    setAddOpen(dialog === 'add-card');
    setDeleteId(removeCard || null);
  }, [searchParams]);

  const syncDialogParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.replace(`${pathname}${params.toString() ? `?${params}` : ''}`, { scroll: false });
  };

  const totalUsage = useMemo(
    () => Math.round((usage.reduce((sum, i) => sum + i.value / i.limit, 0) / usage.length) * 100),
    []
  );

  const defaultCard = cards.find((c) => c.isDefault);
  const deletingCard = cards.find((c) => c.id === deleteId);

  const setDefault = (id: string) => {
    setCards((prev) => prev.map((c) => ({ ...c, isDefault: c.id === id })));
    toast.success('Default card updated.');
  };

  const confirmRemove = () => {
    if (!deleteId) return;
    setCards((prev) => {
      const next = prev.filter((c) => c.id !== deleteId);
      if (next.length && !next.some((c) => c.isDefault)) {
        next[0] = { ...next[0], isDefault: true };
      }
      return next;
    });
    setDeleteId(null);
    syncDialogParam('remove-card', null);
    toast.success('Card removed.');
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Current plan</CardTitle>
              <CardDescription>Next billing date: Aug 2, 2026</CardDescription>
            </div>
            <Badge>Pro</Badge>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Monthly price</p>
                  <p className="mt-2 text-2xl font-semibold">$59</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Billing status</p>
                  <p className="mt-2 flex items-center gap-2 text-2xl font-semibold">
                    <ShieldCheck className="h-5 w-5 text-emerald-500" />
                    Active
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Usage</CardTitle>
                <CardDescription>Summary of data usage throughout the project.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Plan usage</p>
                    <p className="text-sm text-muted-foreground">{totalUsage}% average used</p>
                  </div>
                  <Progress value={totalUsage} className="h-2" />
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  {usage.map((item) => {
                    const percent = Math.round((item.value / item.limit) * 100);
                    return (
                      <Card key={item.label}>
                        <CardHeader>
                          <CardTitle className="text-sm text-muted-foreground">
                            {item.label}
                          </CardTitle>
                          <CardAction>
                            <div className={cn('h-2.5 w-2.5 rounded-full', item.tone)} />
                          </CardAction>
                        </CardHeader>
                        <CardContent>
                          <p className="mt-2 text-lg font-semibold">
                            {item.value} / {item.limit}
                          </p>
                          <Progress value={percent} className="mt-3 h-2" />
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoice history</CardTitle>
            <CardDescription>Download past billing receipts.</CardDescription>
          </CardHeader>
          <CardContent>
            <InvoiceTable data={invoices} pageSize={10} />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment methods</CardTitle>
            <CardDescription>The default card is charged on renewal.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AnimatePresence initial={false} mode="popLayout">
              {cards.map((card) => (
                <motion.div
                  key={card.id}
                  layout
                  layoutId={card.id}
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                >
                  <PaymentCardVisual
                    card={card}
                    onSetDefault={() => setDefault(card.id)}
                    onRemove={() => {
                      const params = new URLSearchParams(searchParams.toString());
                      params.set('remove-card', card.id);
                      router.replace(`${pathname}${params.toString() ? `?${params}` : ''}`, {
                        scroll: false,
                      });
                      setDeleteId(card.id);
                    }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {cards.length === 0 && (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No payment methods on file.
              </p>
            )}

            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set('dialog', 'add-card');
                router.replace(`${pathname}${params.toString() ? `?${params}` : ''}`, {
                  scroll: false,
                });
                setAddOpen(true);
              }}
            >
              <Wallet className="h-4 w-4" /> Add payment method
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Billing note</CardTitle>
            <CardDescription>Keep usage and invoices visible to reduce surprises.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              Overage charges are shown clearly before checkout or renewal.
            </p>
            {defaultCard && (
              <p className="font-medium text-foreground">
                Next charge goes to {getBrandLabel(defaultCard.brand)} ···· {defaultCard.last4}.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <AddPaymentDialog
        open={addOpen}
        onOpenChange={(open) => {
          setAddOpen(open);
          if (open) syncDialogParam('dialog', 'add-card');
          else syncDialogParam('dialog', null);
        }}
        onAdd={(card) => setCards((prev) => [...prev, card])}
      />

      <ConfirmRemoveCardDialog
        open={!!deleteId}
        onOpenChange={(v) => {
          if (!v) {
            setDeleteId(null);
            syncDialogParam('remove-card', null);
          }
        }}
        deletingCard={deletingCard}
        onConfirm={confirmRemove}
      />
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense
      fallback={
        <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
          Loading billing...
        </div>
      }
    >
      <BillingPageContent />
    </Suspense>
  );
}
