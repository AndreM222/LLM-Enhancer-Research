'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CreditCard, ShieldCheck, Wallet } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { getGlobalActivity, getInvoices, getPlanUsage } from '@/lib/mockApi';
import { Progress } from '@/components/ui/progress';
import { InvoiceTable } from '@/components/tables/invoice-columns';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Flag from 'react-world-flags';
import {
  CardBrand,
  CardBrandIcon,
  PaymentCardVisual,
  detectBrand,
  getBrandLabel,
} from '@/components/card-brand';
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
import { useAvailableWallets } from '@/hooks/payment-method';
import { ScrollArea } from '@/components/ui/scroll-area';
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

type CardForm = {
  number: string;
  expiry: string;
  cvc: string;
  name: string;
  country: string;
  address1: string;
  taxType: string;
  taxId: string;
  useBillingAsTeamPrimary: boolean;
};

const INITIAL_CARDS: PaymentCard[] = [
  { id: 'card-1', last4: '4242', brand: 'visa', expiry: '09/28', isDefault: true, name: 'Jerry' },
];

const EMPTY_FORM: CardForm = {
  number: '',
  expiry: '',
  cvc: '',
  name: '',
  country: 'US',
  address1: '',
  taxType: 'VAT',
  taxId: '',
  useBillingAsTeamPrimary: true,
};

function maskNumber(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

export default function BillingPage() {
  const [cards, setCards] = useState<PaymentCard[]>(INITIAL_CARDS);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<CardForm>(EMPTY_FORM);
  const { wallets, loading } = useAvailableWallets();
  const [paymentTab, setPaymentTab] = useState<'card' | 'apple_pay' | 'google_pay'>('card');

  // reset to card if selected wallet becomes unavailable
  useEffect(() => {
    if (paymentTab !== 'card' && !wallets.includes(paymentTab)) {
      setPaymentTab('card');
    }
  }, [wallets, paymentTab]);

  const { countries } = getGlobalActivity();

  const totalUsage = useMemo(
    () => Math.round((usage.reduce((sum, i) => sum + i.value / i.limit, 0) / usage.length) * 100),
    []
  );

  const defaultCard = cards.find((c) => c.isDefault);
  const liveBrand = detectBrand(form.number);
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
    toast.success('Card removed.');
  };

  const handleAdd = (e: React.SubmitEvent) => {
    e.preventDefault();

    if (paymentTab === 'apple_pay' || paymentTab === 'google_pay') {
      const newCard: PaymentCard = {
        id: `card-${Date.now()}`,
        last4: '0000',
        brand: paymentTab,
        expiry: '——',
        isDefault: cards.length === 0,
        name: form.name,
      };
      setCards((prev) => [...prev, newCard]);
      setAddOpen(false);
      toast.success(`${getBrandLabel(paymentTab)} added.`);
      return;
    }

    const digits = form.number.replace(/\D/g, '');
    if (digits.length < 13) {
      toast.error('Enter a valid card number.');
      return;
    }

    const name = form.name.trim();
    if (name.length < 4) {
      toast.error('Enter a valid name.');
      return;
    }
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
                    onRemove={() => setDeleteId(card.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {cards.length === 0 && (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No payment methods on file.
              </p>
            )}

            <Button variant="outline" className="w-full gap-2" onClick={() => setAddOpen(true)}>
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
        onOpenChange={setAddOpen}
        onAdd={(card) => setCards((prev) => [...prev, card])}
      />

      <ConfirmRemoveCardDialog
        open={!!deleteId}
        onOpenChange={(v) => {
          if (!v) setDeleteId(null);
        }}
        deletingCard={deletingCard}
        onConfirm={confirmRemove}
      />
    </div>
  );
}
